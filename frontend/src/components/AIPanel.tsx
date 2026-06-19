import React, { useState, useRef, useEffect } from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { MdOutlineSend, MdOutlineAutoAwesome, MdClearAll } from 'react-icons/md';
import { Typewriter } from './Typewriter';
import { parseStructuredCommand } from '../utils/commandParser';

export const AIPanel: React.FC = () => {
  const { 
    chatHistory, 
    isChatLoading, 
    triggerConceptSimplification, 
    triggerQuizGeneration,
    triggerTranslation,
    triggerActivityGuide,
    triggerLessonSummary,
    triggerHomeworkGeneration,
    clearChat,
    voiceStatus,
    sendChatMessage
  } = useClassroom();

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    const text = inputVal.trim();
    setInputVal('');

    // Route through the shared command parser first (same logic as voice mic).
    // This ensures typed commands like "explain gravity" activate the correct
    // Smart Board view and sidebar link — identical to saying it aloud.
    const matched = await parseStructuredCommand(text, {
      triggerConceptSimplification,
      triggerQuizGeneration,
      triggerTranslation,
      triggerActivityGuide,
      triggerLessonSummary,
      triggerHomeworkGeneration
    });

    // Only fall back to free-form chat if no structured command was detected.
    if (!matched) {
      await sendChatMessage(text);
    }
  };

  const handleSuggestionClick = (type: 'concept' | 'quiz' | 'translate' | 'activity', value: string) => {
    if (type === 'concept') triggerConceptSimplification(value);
    else if (type === 'quiz') triggerQuizGeneration(value);
    else if (type === 'translate') triggerTranslation(value);
    else if (type === 'activity') triggerActivityGuide(value, 5);
  };

  const commandSuggestions = [
    { type: 'concept', label: '🌱 Photosynthesis', val: 'Photosynthesis' },
    { type: 'concept', label: '💧 Water Cycle', val: 'Water Cycle' },
    { type: 'concept', label: '🍎 Gravity', val: 'Gravity' },
    { type: 'quiz', label: '📝 Start Quiz', val: 'Photosynthesis' },
    { type: 'translate', label: '🗣️ Translate "Hello"', val: 'Welcome to class, children!' },
    { type: 'activity', label: '⏳ 5-min Activity', val: 'Photosynthesis' }
  ] as const;

  return (
    <div className="w-80 border-l border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/40 p-4 justify-between transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3 mb-3">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <MdOutlineAutoAwesome className="text-lg animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-display text-slate-800 dark:text-slate-200">
            AI Co-Pilot Panel
          </h3>
        </div>
        <button 
          onClick={clearChat}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <MdClearAll className="text-lg" />
        </button>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 text-xs">
        {chatHistory.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isLastMessage = idx === chatHistory.length - 1;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5 px-1 uppercase tracking-wider font-bold">
                {isUser ? 'Teacher' : 'ClassPilot'}
              </span>
              <div 
                className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl leading-relaxed font-semibold shadow-sm ${
                  isUser 
                    ? 'bg-brand-500 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 rounded-bl-none'
                }`}
              >
                {!isUser && isLastMessage ? (
                  <Typewriter text={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isChatLoading && (
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5 px-1 uppercase tracking-wider font-bold">ClassPilot</span>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Badges */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 py-3 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left leading-none">
          Quick Suggestions
        </p>
        <div className="flex flex-wrap gap-1.5 justify-start">
          {commandSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(sug.type, sug.val)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg shadow-sm transition-all active:scale-95"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Footer */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={voiceStatus === 'listening' ? 'Listening voice...' : 'Type a question...'}
          className="flex-1 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 text-slate-700 dark:text-slate-200 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isChatLoading}
          className={`p-2 rounded-xl text-white shadow-sm flex items-center justify-center transition-all ${
            inputVal.trim() && !isChatLoading 
              ? 'bg-brand-500 hover:bg-brand-600 active:scale-95 cursor-pointer' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border dark:border-slate-700'
          }`}
        >
          <MdOutlineSend className="text-sm" />
        </button>
      </form>
    </div>
  );
};
