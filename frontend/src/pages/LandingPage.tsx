import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdPlayArrow, 
  MdOutlineLightbulb, 
  MdOutlineQuiz, 
  MdOutlineTranslate, 
  MdOutlineTimer,
  MdOutlineAutoAwesome
} from 'react-icons/md';

interface LandingPageProps {
  onStartTeaching: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartTeaching }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const features = [
    {
      icon: MdOutlineLightbulb,
      title: "Live Concept Simplification",
      desc: "Teacher commands like 'Explain Photosynthesis' instantly project bullet points, fun facts, and animated SVG diagrams on the Smart Board in easy Hinglish.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      icon: MdOutlineQuiz,
      title: "Voice-Triggered Quizzes",
      desc: "Instantly create five-question MCQ quizzes verbally. Students answer out loud, scores are recorded, and results project live onto the board.",
      color: "from-emerald-500 to-green-500",
      bg: "bg-green-500/10 text-green-600 dark:text-green-400"
    },
    {
      icon: MdOutlineTranslate,
      title: "Bilingual Translation",
      desc: "Speak paragraphs in English and project translations into Hindi and Hinglish side-by-side. Use AI text-to-speech to read translations aloud.",
      color: "from-indigo-500 to-blue-500",
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      icon: MdOutlineTimer,
      title: "Hands-Free Activity Guide",
      desc: "Start countdown timers and display structured steps for classroom group activities automatically via voice trigger commands.",
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    }
  ];

  return (
    <div className="min-h-screen grid-bg relative flex flex-col justify-between dark:bg-slate-950 transition-colors duration-300">
      
      {/* Decorative header blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navigation header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-extrabold text-xl">
            CP
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight font-display text-slate-800 dark:text-white m-0 p-0 leading-none">
              ClassPilot <span className="text-accent-500 font-extrabold">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase leading-none mt-1">
              AI Classroom Companion
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border dark:border-slate-700/50">
            v1.0.0 Stable
          </span>
        </div>
      </header>

      {/* Main hero and features */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center gap-16 z-10">
        
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl space-y-6"
        >
          {/* Top tag */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-300"
          >
            <MdOutlineAutoAwesome className="text-sm animate-pulse" />
            Designed for Government & Smart Board Schools
          </motion.div>

          {/* Headline */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 dark:text-white font-display leading-[1.08] p-0 m-0"
          >
            Empower Live Teaching With <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Voice-First AI Assistance</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            ClassPilot AI assists you during live classroom sessions. Simply speak voice commands to project simplified summaries, bilingual translations, interactive group activity timers, and live quizzes directly onto your Smart Board.
          </motion.p>

          {/* Start button */}
          <motion.div 
            variants={itemVariants}
            className="pt-4"
          >
            <button
              onClick={onStartTeaching}
              className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center gap-2.5 mx-auto text-base cursor-pointer"
            >
              Start Teaching <MdPlayArrow className="text-xl" />
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 font-display">What ClassPilot AI does</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i, type: "spring", stiffness: 80 }}
                  className="p-5 rounded-2xl border bg-white/60 dark:bg-slate-900/60 dark:border-slate-800/80 backdrop-blur-sm shadow-sm flex flex-col justify-between hover:border-brand-200 dark:hover:border-brand-900/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-inner ${feat.bg}`}>
                      <Icon className="text-xl" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 border-t border-slate-200/50 dark:border-slate-800/50 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <p>© 2026 ClassPilot AI. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Built with <span className="text-rose-500">❤️</span> for Government Smart Schools in India
        </p>
      </footer>
    </div>
  );
};
