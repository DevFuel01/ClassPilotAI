import React from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { MdMic, MdMicOff, MdRefresh } from 'react-icons/md';

export const BottomVoiceControls: React.FC = () => {
  const { 
    voiceStatus, 
    recognizedText, 
    speakText, 
    lastSpokenText, 
    stopSpeaking 
  } = useClassroom();
  
  const { startListening, stopListening, isListening, isSupported } = useVoiceAssistant();

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleRepeat = () => {
    if (lastSpokenText) {
      speakText(lastSpokenText);
    } else {
      speakText("Abhi koi explanation active nahi hai.");
    }
  };

  // Status mapping
  const getStatusDetails = () => {
    switch (voiceStatus) {
      case 'listening':
        return {
          label: 'Listening to your voice...',
          color: 'text-rose-500 font-bold',
          badgeBg: 'bg-rose-500/10'
        };
      case 'processing':
        return {
          label: 'ClassPilot is generating content...',
          color: 'text-amber-500 font-bold',
          badgeBg: 'bg-amber-500/10'
        };
      case 'speaking':
        return {
          label: 'AI is speaking to the class...',
          color: 'text-green-500 font-bold',
          badgeBg: 'bg-green-500/10'
        };
      case 'idle':
      default:
        return {
          label: 'Microphone is ready. Press to talk.',
          color: 'text-slate-400 dark:text-slate-500 font-medium',
          badgeBg: 'bg-slate-100 dark:bg-slate-800'
        };
    }
  };

  const status = getStatusDetails();

  return (
    <div className="glass-panel w-full border-t p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
      
      {/* Voice Status Indicator and Waveform */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className={`px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2.5 shadow-inner ${status.badgeBg}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${
            voiceStatus === 'listening' ? 'bg-rose-500 animate-ping' :
            voiceStatus === 'processing' ? 'bg-amber-500 animate-pulse' :
            voiceStatus === 'speaking' ? 'bg-green-500 animate-bounce' : 'bg-slate-400'
          }`}></span>
          <p className={`text-xs ${status.color}`}>
            {status.label}
          </p>
        </div>

        {/* CSS Voice Waveform Visualizer */}
        {voiceStatus === 'listening' && (
          <div className="flex items-center gap-0.5 h-6">
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.0s' }}></div>
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-0.5 h-full bg-rose-500 animate-wave rounded-full" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Large Central Mic Button Deck */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Pulse backing circles */}
        {voiceStatus === 'listening' && (
          <>
            <div className="absolute inset-0 bg-rose-500/20 rounded-full scale-150 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 bg-rose-500/10 rounded-full scale-200 animate-ping" style={{ animationDuration: '3.5s' }}></div>
          </>
        )}
        
        <button
          onClick={handleMicToggle}
          disabled={!isSupported}
          className={`h-16 w-16 rounded-full flex items-center justify-center text-white shadow-lg z-10 transition-all duration-300 scale-100 hover:scale-105 active:scale-95 cursor-pointer ${
            !isSupported ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed' :
            voiceStatus === 'listening' ? 'bg-rose-500 shadow-rose-500/30' :
            voiceStatus === 'processing' ? 'bg-amber-500 shadow-amber-500/30' :
            voiceStatus === 'speaking' ? 'bg-green-500 shadow-green-500/30' : 
            'bg-brand-500 shadow-brand-500/30 hover:bg-brand-600'
          }`}
        >
          {voiceStatus === 'listening' ? (
            <MdMicOff className="text-3xl" />
          ) : (
            <MdMic className="text-3xl" />
          )}
        </button>
      </div>

      {/* Extra Action Buttons (Repeat, Mute, Text Log summary) */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {recognizedText && (
          <div className="hidden xl:block text-right max-w-[200px] border-r pr-3 border-slate-200 dark:border-slate-800">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Last Spoken</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-1">"{recognizedText}"</p>
          </div>
        )}

        {/* Repeat audio */}
        <button
          onClick={handleRepeat}
          disabled={!lastSpokenText}
          className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
            lastSpokenText 
              ? 'bg-white hover:bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer' 
              : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 cursor-not-allowed'
          }`}
          title="Repeat last explanation"
        >
          <MdRefresh className="text-base" /> Repeat Speech
        </button>

        {/* Stop synthesis */}
        <button
          onClick={stopSpeaking}
          disabled={voiceStatus !== 'speaking'}
          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
            voiceStatus === 'speaking'
              ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 cursor-not-allowed'
          }`}
          title="Stop reading aloud"
        >
          Stop Audio
        </button>
      </div>
    </div>
  );
};
