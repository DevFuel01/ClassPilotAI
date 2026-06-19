import React from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { HiOutlineVolumeUp, HiOutlineVolumeOff } from 'react-icons/hi';
import { MdLanguage } from 'react-icons/md';

export const Navigation: React.FC = () => {
  const { settings, updateSettings } = useClassroom();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ language: e.target.value as any });
  };

  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b px-6 py-3 flex items-center justify-between transition-all duration-300">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-extrabold text-lg">
          CP
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-600 to-brand-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent m-0 p-0 font-display leading-none">
            ClassPilot <span className="text-accent-500 font-extrabold">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase leading-none mt-0.5">
            AI Teacher Assistant
          </p>
        </div>
      </div>

      {/* Lesson details / status */}
      <div className="hidden md:flex items-center gap-3">
        <div className="px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Active Session: <span className="text-brand-600 dark:text-brand-400">{settings.current_lesson}</span>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </div>

      {/* Quick Settings & Profile */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs font-medium text-slate-100 shadow-inner">
          <MdLanguage className="text-brand-400 text-sm" />
          <select 
            value={settings.language}
            onChange={handleLanguageChange}
            className="bg-transparent border-none outline-none font-semibold text-slate-100 cursor-pointer pr-1 py-0.5"
          >
            <option value="Auto" className="bg-slate-900 text-slate-100">🌐 Auto Detect</option>
            <option value="Hinglish" className="bg-slate-900 text-slate-100">Hinglish</option>
            <option value="English" className="bg-slate-900 text-slate-100">English</option>
            <option value="Hindi" className="bg-slate-900 text-slate-100">Hindi</option>
          </select>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => updateSettings({ sound_enabled: !settings.sound_enabled })}
          className={`p-2 rounded-lg border transition-all ${
            settings.sound_enabled 
              ? 'bg-brand-50 border-brand-100 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400 hover:bg-brand-100' 
              : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-200'
          }`}
          title={settings.sound_enabled ? 'Mute AI speech synthesis' : 'Unmute AI speech synthesis'}
        >
          {settings.sound_enabled ? <HiOutlineVolumeUp className="text-lg" /> : <HiOutlineVolumeOff className="text-lg" />}
        </button>

        {/* Dark Mode toggle */}
        <button
          onClick={() => updateSettings({ dark_mode: !settings.dark_mode })}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Toggle Dark Mode"
        >
          {settings.dark_mode ? <IoSunnyOutline className="text-lg" /> : <IoMoonOutline className="text-lg" />}
        </button>

        {/* Teacher profile summary */}
        <div className="flex items-center gap-2 border-l pl-3 border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {settings.teacher_name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold leading-none text-slate-800 dark:text-slate-200">{settings.teacher_name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">Government School Teacher</p>
          </div>
        </div>
      </div>
    </header>
  );
};
