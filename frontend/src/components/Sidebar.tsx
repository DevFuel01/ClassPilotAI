import React from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { 
  MdOutlineLightbulb, 
  MdOutlineQuiz, 
  MdOutlineTranslate, 
  MdOutlineTimer, 
  MdOutlineAssignment, 
  MdOutlineHistory, 
  MdOutlineStickyNote2,
  MdRecordVoiceOver
} from 'react-icons/md';

export const Sidebar: React.FC = () => {
  const { activeFeature, setActiveFeature } = useClassroom();

  const menuItems = [
    { id: 'concept', label: 'Live Concept', icon: MdOutlineLightbulb, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'quiz', label: 'Voice Quiz', icon: MdOutlineQuiz, color: 'text-green-500 bg-green-500/10' },
    { id: 'translation', label: 'Translation', icon: MdOutlineTranslate, color: 'text-indigo-500 bg-indigo-500/10' },
    { id: 'activity', label: 'Activity Guide', icon: MdOutlineTimer, color: 'text-rose-500 bg-rose-500/10' },
    { id: 'summary', label: 'Lesson Summary', icon: MdOutlineStickyNote2, color: 'text-sky-500 bg-sky-500/10' },
    { id: 'homework', label: 'Homework', icon: MdOutlineAssignment, color: 'text-violet-500 bg-violet-500/10' },
    { id: 'history', label: 'History Logs', icon: MdOutlineHistory, color: 'text-slate-500 bg-slate-500/10' },
  ] as const;

  return (
    <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/40 p-4 justify-between transition-all duration-300">
      {/* Sidebar Navigation */}
      <div className="space-y-6 overflow-y-auto flex-1 pr-1">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-3 mb-2">
            Classroom Tools
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFeature === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveFeature(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/15 scale-[1.02]' 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : item.color}`}>
                    <Icon className="text-base" />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Voice Prompt Guidelines Card */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-2 mt-6 shrink-0">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <MdRecordVoiceOver className="text-base animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-display">Speak Command</h4>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <p className="font-semibold">Try saying these aloud:</p>
          <ul className="list-disc pl-3.5 space-y-1">
            <li>"Explain <span className="text-brand-600 dark:text-brand-400 font-medium">photosynthesis</span>"</li>
            <li>"Create a <span className="text-brand-600 dark:text-brand-400 font-medium">quiz</span>"</li>
            <li>"Translate <span className="text-brand-600 dark:text-brand-400 font-medium">welcome to class</span>"</li>
            <li>"Start a <span className="text-brand-600 dark:text-brand-400 font-medium">5 minute activity</span>"</li>
            <li>"Lesson <span className="text-brand-600 dark:text-brand-400 font-medium">summary</span>"</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
