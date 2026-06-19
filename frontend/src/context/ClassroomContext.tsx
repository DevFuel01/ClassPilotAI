import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { detectLanguage } from '../utils/languageDetector';

// --- Interfaces ---

export interface ConceptData {
  title: string;
  explanation: string;
  keywords: string[];
  diagram_suggestion: string;
  fun_fact: string;
  real_life_example: string;
  summary: string;
  audio_text: string;
  flowchart_steps: string[];
  comparison_table: { parameter: string; detail: string }[];
  key_takeaways: string[];
  classroom_tips: string[];
  analogies: string[];
  teaching_examples: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  selectedOption: string | null;
  isAnswered: boolean;
  showResults: boolean;
}

export interface TranslationData {
  english_text: string;
  hindi_text: string;
  hinglish_text: string;
  original_text: string;
  target_lang: 'English' | 'Hindi' | 'Hinglish' | 'Auto';
  audio_text: string;
}

export interface ActivityData {
  title: string;
  duration_seconds: number;
  elapsed_seconds: number;
  steps: string[];
  materials: string[];
  voice_intro: string;
  completion_message: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  type: 'concept' | 'quiz' | 'translation' | 'activity' | 'summary' | 'homework';
  title: string;
  timestamp: Date;
}

export interface TeacherSettings {
  teacher_name: string;
  current_lesson: string;
  language: 'Hinglish' | 'English' | 'Hindi' | 'Auto';
  dark_mode: boolean;
  smart_board_mode: boolean;
  sound_enabled: boolean;
}

interface ClassroomContextType {
  // Navigation / Feature State
  activeFeature: 'welcome' | 'concept' | 'quiz' | 'translation' | 'activity' | 'summary' | 'homework' | 'history' | 'chat';
  setActiveFeature: (feature: 'welcome' | 'concept' | 'quiz' | 'translation' | 'activity' | 'summary' | 'homework' | 'history' | 'chat') => void;
  
  // Feature Specific States
  currentConcept: ConceptData | null;
  currentQuiz: QuizData | null;
  currentTranslation: TranslationData | null;
  currentActivity: ActivityData | null;
  summaryText: string | null;
  homeworkQuestions: string[] | null;
  historyList: HistoryItem[];
  
  // AI Panel Chat
  chatHistory: ChatMessage[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
  isChatLoading: boolean;

  // Smart Board Chat Mirror (free-form Q&A projected to board)
  smartBoardChatMessage: { question: string; answer: string } | null;
  
  // Voice Controls
  voiceStatus: 'idle' | 'listening' | 'processing' | 'speaking';
  setVoiceStatus: (status: 'idle' | 'listening' | 'processing' | 'speaking') => void;
  recognizedText: string;
  setRecognizedText: (text: string) => void;
  lastSpokenText: string;
  setLastSpokenText: (text: string) => void;
  
  // Settings
  settings: TeacherSettings;
  updateSettings: (patch: Partial<TeacherSettings>) => void;
  
  // Action triggers (Backend API calls)
  triggerConceptSimplification: (concept: string) => Promise<void>;
  triggerQuizGeneration: (topic: string) => Promise<void>;
  triggerTranslation: (text: string, targetLang?: 'English' | 'Hindi' | 'Hinglish' | 'Auto') => Promise<void>;
  triggerActivityGuide: (topic: string, durationMinutes?: number) => Promise<void>;
  triggerLessonSummary: () => void;
  triggerHomeworkGeneration: () => void;
  sendChatMessage: (prompt: string) => Promise<void>;
  
  // Utility actions
  selectQuizOption: (option: string) => void;
  submitQuizAnswer: () => void;
  nextQuizQuestion: () => void;
  resetQuiz: () => void;
  toggleActivityTimer: () => void;
  resetActivityTimer: () => void;
  speakText: (text: string, lang?: string) => void;
  stopSpeaking: () => void;

  // Safety
  safetyMessage: string | null;
  safetyMessageType: 'safety' | 'error' | 'warning';
  clearSafetyMessage: () => void;
}

// --- Context Definition ---

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

// In production (Vercel), VITE_API_BASE_URL is set to the Railway backend URL.
// In local development it falls back to localhost automatically.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active page state
  const [activeFeature, setActiveFeature] = useState<'welcome' | 'concept' | 'quiz' | 'translation' | 'activity' | 'summary' | 'homework' | 'history' | 'chat'>('welcome');
  
  // Feature states
  const [currentConcept, setCurrentConcept] = useState<ConceptData | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [currentTranslation, setCurrentTranslation] = useState<TranslationData | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [homeworkQuestions, setHomeworkQuestions] = useState<string[] | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Namaste! Main aapka AI Teaching Assistant hoon. Aap microphone dabakar kisi bhi scientific concept ko explain karne ko kah sakte hain, jaise ki "Explain Photosynthesis".',
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Smart Board Chat Mirror — holds the latest free-form Q&A to project
  const [smartBoardChatMessage, setSmartBoardChatMessage] = useState<{ question: string; answer: string } | null>(null);

  // Safety message state
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);
  const [safetyMessageType, setSafetyMessageType] = useState<'safety' | 'error' | 'warning'>('safety');

  const clearSafetyMessage = () => setSafetyMessage(null);

  const showSafetyBlock = (detail: string) => {
    setSafetyMessageType('safety');
    setSafetyMessage(detail);
  };

  const showError = (detail: string) => {
    setSafetyMessageType('error');
    setSafetyMessage(detail);
  };
  
  // Voice states
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // Settings
  const [settings, setSettings] = useState<TeacherSettings>({
    teacher_name: 'Rita Sharma',
    current_lesson: 'Science - Class VI',
    language: 'Hinglish',
    dark_mode: true,
    smart_board_mode: true,
    sound_enabled: true
  });

  // Audio elements ref
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTimeoutRef = useRef<any>(null);

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Manage Dark Mode class
  useEffect(() => {
    if (settings.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.dark_mode]);

  // Manage Activity Countdown Timer
  useEffect(() => {
    let timer: any;
    if (currentActivity && currentActivity.isActive && !currentActivity.isCompleted) {
      timer = setInterval(() => {
        setCurrentActivity((prev) => {
          if (!prev) return null;
          const nextElapsed = prev.elapsed_seconds + 1;
          const isDone = nextElapsed >= prev.duration_seconds;
          
          if (isDone) {
            clearInterval(timer);
            speakText(prev.completion_message);
            return {
              ...prev,
              elapsed_seconds: prev.duration_seconds,
              isActive: false,
              isCompleted: true
            };
          }
          
          return {
            ...prev,
            elapsed_seconds: nextElapsed
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentActivity?.isActive, currentActivity?.isCompleted]);

  // --- Voice Synthesis Helpers ---

  const speakText = (text: string, forceLang?: string) => {
    if (!settings.sound_enabled || !synthesisRef.current) return;
    
    // Clear any pending speak timeouts
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
    }

    // Stop any active speech first
    synthesisRef.current.cancel();
    setVoiceStatus('speaking');

    // Remove markdown asterisks from TTS output
    const cleanText = text.replace(/\*\*/g, '');

    // Speech setup
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Detect language or use config
    let targetLang = forceLang || settings.language;
    if (targetLang === 'Auto') {
      targetLang = detectLanguage(text);
    }
    if (targetLang === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else if (targetLang === 'English') {
      utterance.lang = 'en-IN'; // Indian English
    } else {
      // Hinglish - default to Indian English voice or Hindi voice depending on script
      // Standard SpeechSynthesis does not have a "Hinglish" locale. hi-IN works nicely for Hinglish phrases.
      utterance.lang = 'hi-IN';
    }

    // Set voice options
    utterance.rate = 0.95; // Slightly slower for classroom clarity
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setVoiceStatus('idle');
      setLastSpokenText(cleanText);
    };

    utterance.onerror = (e) => {
      // Ignore 'interrupted' errors caused by calling cancel() on the prior utterance
      if (e.error !== 'interrupted') {
        console.error('SpeechSynthesis error:', e);
        setVoiceStatus('idle');
      }
    };

    // Use a small timeout to allow SpeechSynthesis engine to clear state after cancel()
    speakTimeoutRef.current = setTimeout(() => {
      synthesisRef.current?.speak(utterance);
    }, 150);
  };

  const stopSpeaking = () => {
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setVoiceStatus('idle');
    }
  };

  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    // Strip markdown bold asterisks if present in the chat panel content
    const cleanContent = content.replace(/\*\*/g, '');

    setChatHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        role,
        content: cleanContent,
        timestamp: new Date()
      }
    ]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const addToHistory = (type: HistoryItem['type'], title: string) => {
    setHistoryList((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        timestamp: new Date()
      },
      ...prev
    ]);
  };

  const updateSettings = (patch: Partial<TeacherSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  // --- API Integrations ---

  const triggerConceptSimplification = async (concept: string) => {
    setVoiceStatus('processing');
    setIsChatLoading(true);
    addChatMessage('user', `Explain "${concept}"`);

    // Speak immediate Snappy Intro to the class
    let introText = `Sure! Let's learn about ${concept}. I am loading the smart board now.`;
    if (settings.language === 'Hindi') {
      introText = `Zaroor! Aaiye ${concept} ke baare mein seekhte hain. Main smart board load kar rahi hoon.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Sure! Aaiye ${concept} samajhte hain. Main smart board par details load kar rahi hoon.`;
    }
    speakText(introText);

    try {
      const response = await fetch(`${API_BASE_URL}/api/concept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept_name: concept })
      });
      if (response.status === 422) {
        const err = await response.json();
        showSafetyBlock(err.detail || 'This topic is not appropriate for a classroom context.');
        addChatMessage('assistant', '🛡️ Safety Block: Yeh topic classroom ke liye appropriate nahi hai. Kripya ek educational sawaal poochein.');
        speakText('Yeh topic classroom ke liye appropriate nahi hai. Kripya ek educational sawaal poochein.');
        return;
      }
      if (!response.ok) throw new Error('API request failed');
      const data: ConceptData = await response.json();
      
      setCurrentConcept(data);
      setActiveFeature('concept');
      addChatMessage('assistant', `Concept simplify kiya gaya hai: **${data.title}**. Aaiye smart board par leaf/diagram aur points dekhte hain.`);
      addToHistory('concept', data.title);
      
      // Speak natural Hinglish explanation
      speakText(data.audio_text);
    } catch (e) {
      console.error(e);
      showError('Server se concept details download karne mein error aayi. Please check internet connection.');
      stopSpeaking();
    } finally {
      setIsChatLoading(false);
    }
  };

  const triggerQuizGeneration = async (topic: string) => {
    setVoiceStatus('processing');
    setIsChatLoading(true);
    addChatMessage('user', `Generate a quiz on "${topic}"`);

    // Speak immediate Snappy Intro to the class
    let introText = `Sure! Creating a quiz on ${topic} for the class.`;
    if (settings.language === 'Hindi') {
      introText = `Zaroor! Aaiye ${topic} par ek quiz shuru karte hain.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Sure! ${topic} par quiz create kar rahi hoon.`;
    }
    speakText(introText);
    
    const lessonContext = currentConcept ? {
      current_topic: currentConcept.title,
      explanation: currentConcept.explanation,
      keywords: currentConcept.keywords,
      summary: currentConcept.summary,
      key_takeaways: currentConcept.key_takeaways || [],
      flowchart_steps: currentConcept.flowchart_steps || [],
      fun_fact: currentConcept.fun_fact,
      real_life_example: currentConcept.real_life_example
    } : null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic,
          lesson_context: lessonContext
        })
      });
      if (response.status === 422) {
        const err = await response.json();
        showSafetyBlock(err.detail || 'This topic is not appropriate for a classroom context.');
        addChatMessage('assistant', '🛡️ Safety Block: Yeh quiz topic classroom ke liye appropriate nahi hai.');
        speakText('Yeh quiz topic classroom ke liye appropriate nahi hai.');
        return;
      }
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      setCurrentQuiz({
        topic: data.topic,
        questions: data.questions,
        currentIndex: 0,
        score: 0,
        selectedOption: null,
        isAnswered: false,
        showResults: false
      });
      setActiveFeature('quiz');
      addChatMessage('assistant', `Maine **${data.topic}** par 5 questions ka quiz banaya hai. Let's start!`);
      addToHistory('quiz', `Quiz: ${data.topic}`);
      
      speakText(`Chalo bachon, ${data.topic} par quiz shuru karte hain. Pehla sawal board par dekhiye aur dhyan se suniye.`);
    } catch (e) {
      console.error(e);
      showError('Quiz load nahi ho paaya. Please try again.');
      stopSpeaking();
    } finally {
      setIsChatLoading(false);
    }
  };

  const triggerTranslation = async (text: string, targetLang?: 'English' | 'Hindi' | 'Hinglish' | 'Auto') => {
    setVoiceStatus('processing');
    setIsChatLoading(true);
    let lang = targetLang || settings.language;
    
    // Resolve "Auto" selection to target language using bi-directional flow
    let resolveLang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish';
    if (lang === 'Auto') {
      const sourceLang = detectLanguage(text);
      if (sourceLang === 'English') {
        resolveLang = 'Hindi';
      } else {
        resolveLang = 'English';
      }
    } else {
      resolveLang = lang;
    }
    
    // Speak immediate Snappy Intro to the class
    let introText = `Translating the text now.`;
    if (settings.language === 'Hindi') {
      introText = `Main abhi iska anuvaad kar rahi hoon.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Translate kar rahi hoon.`;
    }
    speakText(introText);

    addChatMessage('user', `Translate: "${text}" into ${lang === 'Auto' ? `Auto (${resolveLang})` : lang}`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_lang: resolveLang })
      });
      if (response.status === 422) {
        const err = await response.json();
        showSafetyBlock(err.detail || 'This content is not appropriate for a classroom context.');
        addChatMessage('assistant', '🛡️ Safety Block: Yeh content translate nahi kiya ja sakta.');
        speakText('Yeh content translate nahi kiya ja sakta.');
        return;
      }
      if (!response.ok) throw new Error('API request failed');
      const data: TranslationData = await response.json();
      
      const translationObject: TranslationData = {
        ...data,
        original_text: text,
        target_lang: resolveLang
      };
      
      setCurrentTranslation(translationObject);
      setActiveFeature('translation');
      addChatMessage('assistant', `Mera translation ready hai side-by-side view mein. English aur Hindi dono modes display ho rahe hain.`);
      addToHistory('translation', `Translation: ${text.slice(0, 15)}...`);
      
      speakText(translationObject.audio_text, resolveLang);
    } catch (e) {
      console.error(e);
      showError('Translation request failed. Please try again.');
      stopSpeaking();
    } finally {
      setIsChatLoading(false);
    }
  };

  const triggerActivityGuide = async (topic: string, durationMinutes = 5) => {
    setVoiceStatus('processing');
    setIsChatLoading(true);
    addChatMessage('user', `Start a ${durationMinutes}-minute group activity about "${topic}"`);

    // Speak immediate Snappy Intro to the class
    let introText = `Sure! Let's prepare for a group activity on ${topic}.`;
    if (settings.language === 'Hindi') {
      introText = `Aaiye ${topic} par ek group activity shuru karte hain.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Sure! ${topic} par activity prepare kar rahi hoon.`;
    }
    speakText(introText);

    try {
      const response = await fetch(`${API_BASE_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration_minutes: durationMinutes })
      });
      if (response.status === 422) {
        const err = await response.json();
        showSafetyBlock(err.detail || 'This activity topic is not appropriate for a classroom context.');
        addChatMessage('assistant', '🛡️ Safety Block: Yeh activity topic classroom ke liye appropriate nahi hai.');
        speakText('Yeh activity topic classroom ke liye appropriate nahi hai.');
        return;
      }
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      const newActivity: ActivityData = {
        title: data.title,
        duration_seconds: data.duration_seconds,
        elapsed_seconds: 0,
        steps: data.steps,
        materials: data.materials,
        voice_intro: data.voice_intro,
        completion_message: data.completion_message,
        isActive: true,
        isCompleted: false
      };

      setCurrentActivity(newActivity);
      setActiveFeature('activity');
      addChatMessage('assistant', `Maine ek group activity shuru ki hai: **${data.title}**. 5-minute ka timer chalu hai.`);
      addToHistory('activity', data.title);
      
      speakText(newActivity.voice_intro);
    } catch (e) {
      console.error(e);
      showError('Activity timer load nahi ho paaya. Please try again.');
      stopSpeaking();
    } finally {
      setIsChatLoading(false);
    }
  };

  const triggerLessonSummary = () => {
    setIsChatLoading(true);
    setVoiceStatus('processing');
    addChatMessage('user', 'Summarize today\'s lesson.');
    
    // Speak immediate Snappy Intro to the class
    let introText = `Sure, summarizing today's lesson.`;
    if (settings.language === 'Hindi') {
      introText = `Zaroor, aaj ki class ka summary taiyar kar rahi hoon.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Sure, aaj ke lesson ki summary load kar rahi hoon.`;
    }
    speakText(introText);

    // Generate simple summary based on what was discussed in this session
    setTimeout(() => {
      let topicsList = ['General Science Topics'];
      if (currentConcept) topicsList.push(currentConcept.title);
      if (currentQuiz) topicsList.push(`Quiz on ${currentQuiz.topic}`);
      if (currentActivity) topicsList.push(`Activity: ${currentActivity.title}`);

      const summary = `Aaj ki class mein humne **${topicsList.join(', ')}** ke baare mein seekha. Humne Photosynthesis aur natural science cycles ki importance dekhi, quiz solve kiya, aur group activity bhi complete ki. Sabhi bachon ne bahut acchi tarah participate kiya!`;
      
      setSummaryText(summary);
      setActiveFeature('summary');
      addChatMessage('assistant', 'Maine aaj ki lesson summary board par load kar di hai.');
      addToHistory('summary', 'Lesson Summary');
      speakText('Pyare bachon, aaj ki class mein humne jo kuch seekha uska summary board par hai. Humne key definitions aur concepts ko cover kiya hai.');
      setIsChatLoading(false);
    }, 1000);
  };

  const triggerHomeworkGeneration = () => {
    setIsChatLoading(true);
    setVoiceStatus('processing');
    addChatMessage('user', 'Generate homework for the class.');
    
    // Speak immediate Snappy Intro to the class
    let introText = `Generating homework questions for the class.`;
    if (settings.language === 'Hindi') {
      introText = `Zaroor, homework taiyar kar rahi hoon.`;
    } else if (settings.language === 'Hinglish') {
      introText = `Sure, class ke liye homework generate kar rahi hoon.`;
    }
    speakText(introText);

    setTimeout(() => {
      const homework = [
        "Photosynthesis ka neat labelled diagram apni notebooks mein draw karke layein.",
        "Apne ghar ke kisi plant ko observer karein aur uske green leaves par short paragraph likhein.",
        "Gravity kya hai aur agar Earth par gravity na ho toh kya hoga? 3 points mein answer dein.",
        "Jal chakra (Water Cycle) ke components ka chart paper banayein.",
        "Ghar mein hone wale 2 real-life evaporation ke examples note karein."
      ];
      
      setHomeworkQuestions(homework);
      setActiveFeature('homework');
      addChatMessage('assistant', 'Maine home assignment generate kar diya hai.');
      addToHistory('homework', 'Homework Assignment');
      speakText('Bachon, aaj ka homework board par likha hai. Ise apni copy mein note kar lijiye aur kal karke aana hai.');
      setIsChatLoading(false);
    }, 1000);
  };

  const sendChatMessage = async (prompt: string) => {
    setIsChatLoading(true);
    addChatMessage('user', prompt);
    
    const lessonContext = currentConcept ? {
      current_topic: currentConcept.title,
      explanation: currentConcept.explanation,
      keywords: currentConcept.keywords,
      summary: currentConcept.summary,
      key_takeaways: currentConcept.key_takeaways || [],
      flowchart_steps: currentConcept.flowchart_steps || [],
      fun_fact: currentConcept.fun_fact,
      real_life_example: currentConcept.real_life_example
    } : null;

    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: formattedHistory,
          lesson_context: lessonContext
        })
      });
      if (!response.ok) throw new Error('Chat API failed');
      const data = await response.json();

      // The chat endpoint returns 200 with a safety message embedded in response
      // when input is blocked (not 422). The model message already has 🛡️ icon.
      addChatMessage('assistant', data.response);
      // Mirror the Q&A to the Smart Board and switch to 'chat' feature mode
      setSmartBoardChatMessage({ question: prompt, answer: data.response });
      setActiveFeature('chat');
      speakText(data.response);
    } catch (e) {
      console.error(e);
      showError('Server error — message send failed. Please try again.');
      setVoiceStatus('idle');
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Quiz Actions ---

  const selectQuizOption = (option: string) => {
    if (!currentQuiz || currentQuiz.isAnswered) return;
    setCurrentQuiz(prev => prev ? { ...prev, selectedOption: option } : null);
  };

  const submitQuizAnswer = () => {
    if (!currentQuiz || !currentQuiz.selectedOption || currentQuiz.isAnswered) return;
    
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const isCorrect = currentQuiz.selectedOption === question.correct_answer;
    
    setCurrentQuiz(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isAnswered: true,
        score: isCorrect ? prev.score + 1 : prev.score
      };
    });

    const responsePhrase = isCorrect 
      ? 'Bilkul sahi jawab! Bahut badhiya.' 
      : `Galat jawab. Sahi jawab hai: ${question.correct_answer}.`;
    
    speakText(`${responsePhrase} Explanation: ${question.explanation}`);
  };

  const nextQuizQuestion = () => {
    if (!currentQuiz) return;
    
    const isLast = currentQuiz.currentIndex === currentQuiz.questions.length - 1;
    
    setCurrentQuiz(prev => {
      if (!prev) return null;
      if (isLast) {
        return {
          ...prev,
          showResults: true
        };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        isAnswered: false
      };
    });

    if (isLast) {
      const finalScore = currentQuiz.score + (currentQuiz.selectedOption === currentQuiz.questions[currentQuiz.currentIndex].correct_answer ? 1 : 0);
      speakText(`Quiz khatam! Aapka score hai ${finalScore} out of 5. Sabhi students ke liye taaliyan bajayein!`);
    } else {
      const nextQ = currentQuiz.questions[currentQuiz.currentIndex + 1];
      speakText(`Agla sawal: ${nextQ.question}`);
    }
  };

  const resetQuiz = () => {
    if (!currentQuiz) return;
    setCurrentQuiz(prev => prev ? {
      ...prev,
      currentIndex: 0,
      score: 0,
      selectedOption: null,
      isAnswered: false,
      showResults: false
    } : null);
    speakText("Quiz ko restart kar diya gaya hai. Pehla sawal dekhiye.");
  };

  // --- Activity Actions ---

  const toggleActivityTimer = () => {
    setCurrentActivity(prev => {
      if (!prev) return null;
      const willBeActive = !prev.isActive;
      
      if (willBeActive) {
        speakText("Timer resumed.");
      } else {
        stopSpeaking();
      }

      return {
        ...prev,
        isActive: willBeActive
      };
    });
  };

  const resetActivityTimer = () => {
    setCurrentActivity(prev => prev ? {
      ...prev,
      elapsed_seconds: 0,
      isActive: false,
      isCompleted: false
    } : null);
    speakText("Activity timer has been reset.");
  };

  return (
    <ClassroomContext.Provider value={{
      activeFeature,
      setActiveFeature,
      currentConcept,
      currentQuiz,
      currentTranslation,
      currentActivity,
      summaryText,
      homeworkQuestions,
      historyList,
      chatHistory,
      addChatMessage,
      clearChat,
      isChatLoading,
      smartBoardChatMessage,
      voiceStatus,
      setVoiceStatus,
      recognizedText,
      setRecognizedText,
      lastSpokenText,
      setLastSpokenText,
      settings,
      updateSettings,
      triggerConceptSimplification,
      triggerQuizGeneration,
      triggerTranslation,
      triggerActivityGuide,
      triggerLessonSummary,
      triggerHomeworkGeneration,
      sendChatMessage,
      selectQuizOption,
      submitQuizAnswer,
      nextQuizQuestion,
      resetQuiz,
      toggleActivityTimer,
      resetActivityTimer,
      speakText,
      stopSpeaking,
      safetyMessage,
      safetyMessageType,
      clearSafetyMessage
    }}>
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within a ClassroomProvider');
  }
  return context;
};
