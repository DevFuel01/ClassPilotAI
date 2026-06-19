import { useEffect, useRef } from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { parseStructuredCommand } from '../utils/commandParser';

export const useVoiceAssistant = () => {
  const {
    voiceStatus,
    setVoiceStatus,
    setRecognizedText,
    lastSpokenText,
    triggerConceptSimplification,
    triggerQuizGeneration,
    triggerTranslation,
    triggerActivityGuide,
    triggerLessonSummary,
    triggerHomeworkGeneration,
    settings,
    updateSettings,
    speakText,
    stopSpeaking,
    addChatMessage,
    sendChatMessage
  } = useClassroom();

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop when the user stops speaking
      rec.interimResults = false;
      
      // Use hi-IN or en-IN for Indian Accent and Hinglish mapping
      rec.lang = settings.language === 'Hindi' ? 'hi-IN' : 'hi-IN'; // hi-IN is excellent at capturing both Hindi and English words in Hinglish
      
      rec.onstart = () => {
        setVoiceStatus('listening');
        isListeningRef.current = true;
      };

      rec.onend = () => {
        isListeningRef.current = false;
        // Only reset status to idle if it wasn't set to processing/speaking
        (setVoiceStatus as any)((prev: 'idle' | 'listening' | 'processing' | 'speaking') => {
          if (prev === 'listening') return 'idle';
          return prev;
        });
      };

      rec.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        isListeningRef.current = false;
        setVoiceStatus('idle');
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setRecognizedText(text);
        parseCommand(text);
      };

      recognitionRef.current = rec;
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, [settings.language]);

  const startListening = () => {
    // Stop any speaking text before listening
    stopSpeaking();
    
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  };

  // --- Voice Command Parsing Logic ---
  const parseCommand = async (transcript: string) => {
    setVoiceStatus('processing');
    const cleanText = transcript.trim().toLowerCase();
    
    console.log('Voice Command Received:', cleanText);

    // 7. Repeat Command
    const repeatRegex = /^(?:repeat|repeat explanation|phir se batao|phir se)$/i;

    // 8. View Mode / Settings Toggles
    const darkModeRegex = /^(?:toggle\s+)?dark\s*mode$/i;
    const smartBoardModeRegex = /^(?:toggle\s+)?smart\s*board\s*mode$/i;
    const stopAudioRegex = /^(?:stop|mute|shant ho jao|chup)$/i;

    // --- Command Routing ---

    // ── Voice-only commands ───────────────────────────────────────────────

    // Stop speaking
    if (stopAudioRegex.test(cleanText)) {
      stopSpeaking();
      addChatMessage('user', `Voice command: "${transcript}"`);
      addChatMessage('assistant', 'Maine audio stop kar diya hai.');
      setVoiceStatus('idle');
      return;
    }

    // Repeat last audio
    if (repeatRegex.test(cleanText)) {
      addChatMessage('user', `Voice command: "${transcript}"`);
      addChatMessage('assistant', 'Hum last concept explanation ko phir se sunte hain.');
      if (lastSpokenText) {
        speakText(lastSpokenText);
      } else {
        speakText("Abhi koi active explanation nahi hai.");
      }
      return;
    }

    // Toggles
    if (darkModeRegex.test(cleanText)) {
      updateSettings({ dark_mode: !settings.dark_mode });
      addChatMessage('user', `Voice command: "${transcript}"`);
      addChatMessage('assistant', `Dark mode ${!settings.dark_mode ? 'on' : 'off'} kiya gaya.`);
      setVoiceStatus('idle');
      return;
    }

    if (smartBoardModeRegex.test(cleanText)) {
      updateSettings({ smart_board_mode: !settings.smart_board_mode });
      addChatMessage('user', `Voice command: "${transcript}"`);
      addChatMessage('assistant', `Smart Board Mode ${!settings.smart_board_mode ? 'activated' : 'deactivated'}.`);
      setVoiceStatus('idle');
      return;
    }

    // ── Shared structured command routing ────────────────────────────────────
    // Handles: concept, quiz, translate, activity, homework, summary
    const matched = await parseStructuredCommand(transcript, {
      triggerConceptSimplification,
      triggerQuizGeneration,
      triggerTranslation,
      triggerActivityGuide,
      triggerLessonSummary,
      triggerHomeworkGeneration
    });

    if (matched) return;

    // ── Fallback: General free-form chat → mirrors to Smart Board ───────────
    await sendChatMessage(transcript);
  };

  return {
    startListening,
    stopListening,
    isListening: voiceStatus === 'listening',
    isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
