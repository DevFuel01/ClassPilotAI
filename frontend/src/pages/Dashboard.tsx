import React from 'react';
import { Navigation } from '../components/Navigation';
import { Sidebar } from '../components/Sidebar';
import { SmartBoard } from '../components/SmartBoard';
import { AIPanel } from '../components/AIPanel';
import { BottomVoiceControls } from '../components/BottomVoiceControls';
import { SafetyToast } from '../components/SafetyToast';
import { useClassroom } from '../context/ClassroomContext';

export const Dashboard: React.FC = () => {
  const { safetyMessage, safetyMessageType, clearSafetyMessage } = useClassroom();

  return (
    <div className="h-screen flex flex-col bg-transparent dark:bg-slate-950 transition-colors duration-300">
      {/* Top Header Navigation */}
      <Navigation />

      {/* Main split dashboard view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left features sidebar */}
        <Sidebar />

        {/* Center Smart Projector Board */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <SmartBoard />
        </main>

        {/* Right conversational AI assistant */}
        <AIPanel />
      </div>

      {/* Bottom voice control microphone block */}
      <BottomVoiceControls />

      {/* Global Safety / Error Toast — floats above all content */}
      <SafetyToast
        message={safetyMessage}
        type={safetyMessageType}
        onDismiss={clearSafetyMessage}
      />
    </div>
  );
};
