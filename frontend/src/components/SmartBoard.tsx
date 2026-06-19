import React, { useEffect } from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from './Typewriter';
import { 
  MdPlayArrow,
  MdPause,
  MdRefresh,
  MdVolumeUp,
  MdFullscreen,
  MdFullscreenExit
} from 'react-icons/md';

// --- Animated SVG Diagrams for Concept Display ---

const PhotosynthesisDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full max-h-[220px]">
      {/* Background grid */}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
        </marker>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
        <marker id="arrow-yellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#eab308" />
        </marker>
      </defs>

      {/* Sun */}
      <motion.g 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <circle cx="60" cy="60" r="30" fill="#fef08a" stroke="#eab308" strokeWidth="3" />
        <circle cx="60" cy="60" r="24" fill="#fde047" />
        {/* Sun rays */}
        <line x1="60" y1="18" x2="60" y2="6" stroke="#eab308" strokeWidth="2" />
        <line x1="60" y1="102" x2="60" y2="114" stroke="#eab308" strokeWidth="2" />
        <line x1="18" y1="60" x2="6" y2="60" stroke="#eab308" strokeWidth="2" />
        <line x1="102" y1="60" x2="114" y2="60" stroke="#eab308" strokeWidth="2" />
        <line x1="30" y1="30" x2="20" y2="20" stroke="#eab308" strokeWidth="2" />
        <line x1="90" y1="90" x2="100" y2="100" stroke="#eab308" strokeWidth="2" />
        <line x1="90" y1="30" x2="100" y2="20" stroke="#eab308" strokeWidth="2" />
        <line x1="30" y1="90" x2="20" y2="100" stroke="#eab308" strokeWidth="2" />
      </motion.g>

      {/* Soil */}
      <rect x="0" y="240" width="400" height="40" fill="#d97706" rx="4" />
      <rect x="0" y="240" width="400" height="8" fill="#b45309" />

      {/* Plant Roots */}
      <path d="M 200 230 Q 185 250 170 260 M 200 235 Q 205 255 215 270 M 200 230 Q 200 260 195 275" stroke="#78350f" strokeWidth="3" fill="none" />

      {/* Plant Stem */}
      <path d="M 200 240 L 200 130" stroke="#15803d" strokeWidth="5" fill="none" />

      {/* Big Leaf */}
      <path d="M 200 160 Q 260 130 300 160 Q 250 190 200 160" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
      <path d="M 200 160 Q 250 160 300 160" stroke="#16a34a" strokeWidth="2" fill="none" />
      <path d="M 230 160 Q 240 150 250 145" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      <path d="M 250 160 Q 265 170 280 175" stroke="#16a34a" strokeWidth="1.5" fill="none" />

      {/* Smaller Leaf */}
      <path d="M 200 180 Q 140 160 110 185 Q 160 210 200 180" fill="#4ade80" stroke="#22c55e" strokeWidth="2.5" />

      {/* Flower */}
      <circle cx="200" cy="115" r="12" fill="#ef4444" />
      <circle cx="200" cy="95" r="10" fill="#f59e0b" />
      <circle cx="218" cy="107" r="10" fill="#f59e0b" />
      <circle cx="212" cy="127" r="10" fill="#f59e0b" />
      <circle cx="188" cy="127" r="10" fill="#f59e0b" />
      <circle cx="182" cy="107" r="10" fill="#f59e0b" />
      <circle cx="200" cy="115" r="8" fill="#fef08a" />

      {/* Sunlight Arrow */}
      <path d="M 90 90 L 160 135" stroke="#eab308" strokeWidth="2.5" strokeDasharray="4" markerEnd="url(#arrow-yellow)" fill="none" />
      <text x="100" y="105" fill="#a16207" fontSize="10" fontWeight="bold">Sunlight</text>

      {/* Water Arrow */}
      <path d="M 140 265 Q 160 250 180 240" stroke="#0284c7" strokeWidth="2" strokeDasharray="3" markerEnd="url(#arrow)" fill="none" />
      <text x="115" y="255" fill="#0369a1" fontSize="10" fontWeight="bold">Water (H₂O)</text>

      {/* CO2 Arrow */}
      <path d="M 340 100 Q 290 120 260 145" stroke="#0284c7" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
      <text x="305" y="105" fill="#0f172a" fontSize="10" fontWeight="bold">CO₂ (Air)</text>

      {/* Oxygen Arrow */}
      <path d="M 270 170 Q 310 190 350 175" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow-green)" fill="none" />
      <text x="315" y="200" fill="#047857" fontSize="10" fontWeight="bold">Oxygen (O₂)</text>
    </svg>
  );
};

const WaterCycleDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full max-h-[220px] rounded-lg shadow-inner">
      <defs>
        {/* Arrow Markers */}
        <marker id="blue-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284c7" />
        </marker>
        <marker id="green-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="#15803d" />
        </marker>
        <marker id="precip-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284c7" />
        </marker>
        <marker id="coll-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="#0369a1" />
        </marker>

        {/* Sky Gradient */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>

        {/* Mountain Gradient */}
        <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Land Gradient */}
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        {/* Ocean Gradient */}
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect x="0" y="0" width="400" height="280" fill="url(#skyGrad)" rx="8" />

      {/* Sun Rays */}
      <g stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 3">
        <line x1="40" y1="40" x2="120" y2="40" />
        <line x1="40" y1="40" x2="100" y2="100" />
        <line x1="40" y1="40" x2="40" y2="120" />
        <line x1="40" y1="40" x2="130" y2="80" />
        <line x1="40" y1="40" x2="80" y2="130" />
      </g>

      {/* Sun */}
      <circle cx="40" cy="40" r="22" fill="#fde047" stroke="#eab308" strokeWidth="2" />
      <circle cx="40" cy="40" r="16" fill="#fef08a" />

      {/* Mountains */}
      <path d="M 210 220 L 300 90 L 380 220 Z" fill="url(#mountainGrad)" />
      <path d="M 275 126 L 300 90 L 322 122 L 310 130 Z" fill="#f8fafc" /> {/* Snow Cap 1 */}

      <path d="M 280 220 L 350 70 L 400 220 Z" fill="#64748b" />
      <path d="M 325 120 L 350 70 L 378 112 L 362 125 Z" fill="#f8fafc" /> {/* Snow Cap 2 */}

      {/* Green Land */}
      <path d="M 150 220 L 400 220 L 400 280 L 110 280 Z" fill="url(#landGrad)" />

      {/* Tree (for Transpiration) */}
      <rect x="247" y="205" width="6" height="16" fill="#78350f" rx="1" />
      <circle cx="240" cy="195" r="10" fill="#15803d" />
      <circle cx="260" cy="195" r="10" fill="#15803d" />
      <circle cx="250" cy="185" r="12" fill="#22c55e" />

      {/* Ocean */}
      <path d="M 0 215 Q 85 220 150 230 L 150 280 L 0 280 Z" fill="url(#oceanGrad)" />
      <path d="M 0 215 Q 85 220 150 230" stroke="#bae6fd" strokeWidth="1.5" fill="none" />

      {/* River flowing into Ocean */}
      <path d="M 300 185 Q 240 195 190 220 T 120 245" stroke="#0ea5e9" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M 300 185 Q 240 195 190 220 T 120 245" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Clouds */}
      {/* Cloud 1 */}
      <g fill="#ffffff" stroke="#e2e8f0" strokeWidth="1">
        <circle cx="130" cy="65" r="15" />
        <circle cx="150" cy="55" r="20" />
        <circle cx="172" cy="65" r="15" />
        <rect x="130" y="60" width="42" height="20" fill="#ffffff" />
      </g>
      {/* Cloud 2 (Darker, rain cloud) */}
      <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1">
        <circle cx="290" cy="65" r="15" />
        <circle cx="310" cy="55" r="20" />
        <circle cx="332" cy="65" r="15" />
        <rect x="290" y="60" width="42" height="20" fill="#cbd5e1" />
      </g>

      {/* Evaporation Arrow */}
      <path d="M 60 195 Q 70 135 120 95" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4 2" markerEnd="url(#blue-arrow)" fill="none" />
      
      {/* Transpiration Arrow */}
      <path d="M 250 170 Q 235 125 178 95" stroke="#15803d" strokeWidth="2.5" strokeDasharray="4 2" markerEnd="url(#green-arrow)" fill="none" />

      {/* Condensation Arrows */}
      <path d="M 122 88 Q 135 80 142 75" stroke="#475569" strokeWidth="2" markerEnd="url(#blue-arrow)" fill="none" />
      <path d="M 180 88 Q 215 72 270 70" stroke="#475569" strokeWidth="2" markerEnd="url(#blue-arrow)" fill="none" />

      {/* Precipitation (Raindrops) */}
      <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
        <line x1="295" y1="90" x2="288" y2="110" />
        <line x1="312" y1="92" x2="305" y2="112" />
        <line x1="328" y1="90" x2="321" y2="110" />
        
        <line x1="288" y1="120" x2="281" y2="140" />
        <line x1="305" y1="122" x2="298" y2="142" />
        <line x1="321" y1="120" x2="314" y2="140" />
      </g>

      {/* Collection / Runoff Arrows */}
      <path d="M 345 130 Q 320 160 310 175" stroke="#0369a1" strokeWidth="2" markerEnd="url(#coll-arrow)" fill="none" />
      <path d="M 190 220 Q 155 230 100 232" stroke="#0369a1" strokeWidth="2" markerEnd="url(#coll-arrow)" fill="none" />

      {/* TEXT LABELS WITH HIGH-VISIBILITY OUTLINES */}
      <text x="30" y="145" fill="#0284c7" fontSize="10" fontWeight="extrabold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke fill">Evaporation</text>
      <text x="235" y="140" fill="#15803d" fontSize="10" fontWeight="extrabold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke fill">Transpiration</text>
      <text x="135" y="98" fill="#475569" fontSize="10" fontWeight="extrabold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke fill">Condensation</text>
      <text x="315" y="125" fill="#0369a1" fontSize="10" fontWeight="extrabold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke fill">Precipitation</text>
      <text x="200" y="240" fill="#0c4a6e" fontSize="9" fontWeight="extrabold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke fill">Collection</text>
    </svg>
  );
};

const GravityDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full max-h-[220px]">
      <defs>
        <marker id="red-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="400" height="280" fill="#f8fafc" rx="4" />
      
      {/* Earth Surface / Grass */}
      <rect x="0" y="220" width="400" height="60" fill="#22c55e" rx="4" />
      <rect x="0" y="235" width="400" height="45" fill="#16a34a" />

      {/* Newton's Apple Tree */}
      <path d="M 80 220 L 80 130" stroke="#78350f" strokeWidth="12" fill="none" />
      {/* Foliage */}
      <circle cx="50" cy="110" r="30" fill="#15803d" />
      <circle cx="80" cy="90" r="35" fill="#166534" />
      <circle cx="110" cy="110" r="30" fill="#15803d" />
      <rect x="40" y="100" width="80" height="30" fill="#15803d" stroke="none" />

      {/* Apples on tree */}
      <circle cx="60" cy="110" r="5" fill="#ef4444" />
      <circle cx="95" cy="100" r="5" fill="#ef4444" />
      <circle cx="75" cy="120" r="5" fill="#ef4444" />

      {/* The Apple Falling */}
      {/* Motion trail */}
      <line x1="160" y1="110" x2="160" y2="170" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
      {/* Falling Apple */}
      <g>
        <circle cx="160" cy="180" r="8" fill="#ef4444" />
        <path d="M 160 172 Q 163 170 162 168" stroke="#15803d" strokeWidth="2" fill="none" />
      </g>
      {/* Gravity Pull Arrow */}
      <path d="M 160 192 L 160 215" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" fill="none" />
      
      {/* Labels */}
      <text x="175" y="205" fill="#ef4444" fontSize="10" fontWeight="bold">Gravity Pulls Down</text>
      <text x="140" y="95" fill="#475569" fontSize="10" fontWeight="bold">Newton's Apple</text>

      {/* Core Earth Center Visualization */}
      <circle cx="340" cy="180" r="35" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
      <circle cx="340" cy="180" r="12" fill="#ef4444" /> {/* Core */}
      {/* Inward arrows */}
      <path d="M 340 120 L 340 140" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#red-arrow)" fill="none" />
      <path d="M 340 240 L 340 220" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#red-arrow)" fill="none" />
      <path d="M 280 180 L 300 180" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#red-arrow)" fill="none" />
      <path d="M 400 180 L 380 180" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#red-arrow)" fill="none" />
      <text x="315" y="135" fill="#1e3a8a" fontSize="8" fontWeight="bold">Earth Mass</text>
    </svg>
  );
};

const GenericDiagram: React.FC<{ topicName: string }> = ({ topicName }) => {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full max-h-[220px]">
      <rect x="10" y="10" width="380" height="260" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* Core Node */}
      <circle cx="200" cy="140" r="35" fill="#0284c7" />
      <text x="200" y="143" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{topicName.slice(0, 12)}</text>
      
      {/* Node 1 */}
      <circle cx="80" cy="70" r="25" fill="#10b981" />
      <text x="80" y="73" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Input</text>
      <line x1="100" y1="85" x2="170" y2="125" stroke="#cbd5e1" strokeWidth="2" />

      {/* Node 2 */}
      <circle cx="320" cy="70" r="25" fill="#f59e0b" />
      <text x="320" y="73" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Energy</text>
      <line x1="300" y1="85" x2="230" y2="125" stroke="#cbd5e1" strokeWidth="2" />

      {/* Node 3 */}
      <circle cx="200" cy="230" r="25" fill="#8b5cf6" />
      <text x="200" y="233" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Output</text>
      <line x1="200" y1="205" x2="200" y2="175" stroke="#cbd5e1" strokeWidth="2" />

      <text x="200" y="35" fill="#475569" fontSize="12" fontWeight="bold" textAnchor="middle">{topicName} Visual Model</text>
    </svg>
  );
};

// --- Sub-components for each smart board display state ---

export const SmartBoard: React.FC = () => {
  const { 
    activeFeature, 
    currentConcept, 
    currentQuiz, 
    currentTranslation, 
    currentActivity, 
    summaryText, 
    homeworkQuestions,
    historyList,
    smartBoardChatMessage,
    triggerConceptSimplification,
    triggerQuizGeneration,
    triggerTranslation,
    triggerActivityGuide,
    selectQuizOption,
    submitQuizAnswer,
    nextQuizQuestion,
    resetQuiz,
    toggleActivityTimer,
    resetActivityTimer,
    speakText
  } = useClassroom();

  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeConceptTab, setActiveConceptTab] = React.useState<'overview' | 'steps' | 'table' | 'analogies' | 'examples' | 'tips'>('overview');

  useEffect(() => {
    setActiveConceptTab('overview');
  }, [currentConcept?.title]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flex-1 flex flex-col rounded-2xl overflow-hidden glass-panel border shadow-md relative transition-all duration-300 ${
        isFullscreen ? 'p-8 bg-slate-50 dark:bg-slate-950 z-50 h-screen w-screen rounded-none' : 'p-6 bg-white dark:bg-slate-900/80'
      }`}
    >
      {/* Smart Board Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3.5 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-lg dark:text-brand-400">
            📺
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-slate-800 dark:text-slate-100 uppercase tracking-wider m-0 p-0 leading-none">
              Smart Projector Display
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-1">
              Optimized for live classroom projection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Mode indicator badge */}
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
            {activeFeature} MODE
          </span>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Fullscreen Smart Board"
          >
            {isFullscreen ? <MdFullscreenExit className="text-lg" /> : <MdFullscreen className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col justify-start items-center overflow-y-auto pr-1 py-4">
        <AnimatePresence mode="wait">
          {activeFeature === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center max-w-xl space-y-6 py-6"
            >
              <div className="mx-auto w-16 h-16 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center text-3xl shadow-sm dark:bg-brand-500/15 dark:text-brand-400">
                👩‍🏫
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                  Welcome to ClassPilot AI
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Apne class ki learning ko double karein voice commands ke saath. Start karne ke liye niche diye gaye standard lessons mein se ek pick karein ya seedhe microphone button ko click karke speak karein!
                </p>
              </div>

              {/* Quick Start Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-4">
                <button 
                  onClick={() => triggerConceptSimplification('Photosynthesis')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 dark:border-slate-800 dark:hover:border-brand-700/50 dark:hover:bg-brand-500/5 text-left transition-all duration-200 group flex items-center gap-3"
                >
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 leading-tight">Explain Photosynthesis</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Learn food making process in plants</p>
                  </div>
                </button>

                <button 
                  onClick={() => triggerQuizGeneration('Photosynthesis')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/30 dark:border-slate-800 dark:hover:border-green-700/50 dark:hover:bg-green-500/5 text-left transition-all duration-200 group flex items-center gap-3"
                >
                  <span className="text-2xl">📝</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-green-600 dark:group-hover:text-green-400 leading-tight">Start Photosynthesis Quiz</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">5 MCQ questions for evaluation</p>
                  </div>
                </button>

                <button 
                  onClick={() => triggerConceptSimplification('Water Cycle')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 dark:border-slate-800 dark:hover:border-brand-700/50 dark:hover:bg-brand-500/5 text-left transition-all duration-200 group flex items-center gap-3"
                >
                  <span className="text-2xl">💧</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 leading-tight">Explain Water Cycle</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Evaporation, rain, and runoff</p>
                  </div>
                </button>

                <button 
                  onClick={() => triggerActivityGuide('Water Cycle', 5)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 dark:border-slate-800 dark:hover:border-rose-700/50 dark:hover:bg-rose-500/5 text-left transition-all duration-200 group flex items-center gap-3"
                >
                  <span className="text-2xl">⏳</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 leading-tight">5-min Group Activity</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Team activity with countdown timer</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeFeature === 'concept' && (
            !currentConcept ? (
              <motion.div 
                key="concept-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 text-slate-400 space-y-4 max-w-sm mx-auto"
              >
                <span className="text-5xl">🌱</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Active Concept</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Smart Board par concept explain karne ke liye voice command boleins (e.g. <i>"Explain Photosynthesis"</i>) ya niche click karein.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button 
                    onClick={() => triggerConceptSimplification('Photosynthesis')}
                    className="px-3 py-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg border border-brand-100 dark:border-brand-900/30 transition-all active:scale-95"
                  >
                    🌱 Photosynthesis
                  </button>
                  <button 
                    onClick={() => triggerConceptSimplification('Water Cycle')}
                    className="px-3 py-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg border border-brand-100 dark:border-brand-900/30 transition-all active:scale-95"
                  >
                    💧 Water Cycle
                  </button>
                  <button 
                    onClick={() => triggerConceptSimplification('Gravity')}
                    className="px-3 py-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg border border-brand-100 dark:border-brand-900/30 transition-all active:scale-95"
                  >
                    🍎 Gravity
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="concept"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-2"
            >
              {/* Concept Text Panel */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Title & Keywords */}
                <div className="space-y-1">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                    {currentConcept.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentConcept.keywords.map((word, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase bg-brand-50 text-brand-600 rounded-md border border-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Classroom Tabs */}
                <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-x-4 gap-y-2 mb-2 pb-1">
                  <button 
                    onClick={() => setActiveConceptTab('overview')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'overview' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    📖 Overview
                  </button>
                  <button 
                    onClick={() => setActiveConceptTab('steps')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'steps' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    🔄 Process Steps
                  </button>
                  <button 
                    onClick={() => setActiveConceptTab('table')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'table' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    📊 Parameter Table
                  </button>
                  <button 
                    onClick={() => setActiveConceptTab('analogies')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'analogies' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    🗣️ Analogies
                  </button>
                  <button 
                    onClick={() => setActiveConceptTab('examples')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'examples' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    🔬 Classroom Demos
                  </button>
                  <button 
                    onClick={() => setActiveConceptTab('tips')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeConceptTab === 'tips' 
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                        : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                  >
                    💡 Teacher Tips
                  </button>
                </div>

                {/* Tab content 1: Overview */}
                {activeConceptTab === 'overview' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                      <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Simple Explanation (Hinglish)</h4>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                        <Typewriter text={currentConcept.explanation} />
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-950/15 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                          <span>💡</span>
                          <h4>Fun Fact</h4>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                          {currentConcept.fun_fact}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/15 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                          <span>🔄</span>
                          <h4>Real-life Example</h4>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                          {currentConcept.real_life_example}
                        </p>
                      </div>
                    </div>

                    {currentConcept.key_takeaways && currentConcept.key_takeaways.length > 0 && (
                      <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/10 dark:border-brand-900/30 dark:bg-brand-950/15 space-y-2">
                        <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                          <span>📌</span>
                          <h4>Key Takeaways</h4>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                          {currentConcept.key_takeaways.map((takeaway, idx) => (
                            <li key={idx}>{takeaway}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        <span className="font-bold not-italic text-slate-700 dark:text-slate-300">Summary: </span>
                        {currentConcept.summary}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Tab content 2: Step-by-Step Flow */}
                {activeConceptTab === 'steps' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Step-by-Step Process</h4>
                      
                      {currentConcept.flowchart_steps && currentConcept.flowchart_steps.length > 0 ? (
                        <div className="relative pl-6 space-y-4">
                          {/* Connection line */}
                          <div className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-brand-200 dark:bg-brand-800"></div>

                          {currentConcept.flowchart_steps.map((step, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="relative flex items-start gap-4"
                            >
                              {/* Step circle node */}
                              <div className="absolute left-[-20px] top-1.5 h-5 w-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-sm">
                                {idx + 1}
                              </div>
                              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex-1">
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                  {step}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">Step-by-step process steps are not available for this concept.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tab content 3: Parameter Table */}
                {activeConceptTab === 'table' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Parameters & Comparison Table</h4>
                      
                      {currentConcept.comparison_table && currentConcept.comparison_table.length > 0 ? (
                        <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left font-bold text-[10px]">Parameter</th>
                                <th scope="col" className="px-4 py-3 text-left font-bold text-[10px]">Detail</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                              {currentConcept.comparison_table.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 w-1/3">
                                    {row.parameter}
                                  </td>
                                  <td className="px-4 py-3">
                                    {row.detail}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">Parameter comparison table is not available for this concept.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tab content 4: Analogies */}
                {activeConceptTab === 'analogies' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Real-Life Analogies (उदाहरण)</h4>
                      
                      {currentConcept.analogies && currentConcept.analogies.length > 0 ? (
                        <div className="space-y-3">
                          {currentConcept.analogies.map((analogy, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm flex items-start gap-3 relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                              <span className="text-lg leading-none mt-0.5">🗣️</span>
                              <div>
                                <h5 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Analogy {idx + 1}</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                  {analogy}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No analogies available for this concept.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tab content 5: Classroom Demos */}
                {activeConceptTab === 'examples' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Interactive Classroom Demos (प्रयोग)</h4>
                      
                      {currentConcept.teaching_examples && currentConcept.teaching_examples.length > 0 ? (
                        <div className="space-y-3">
                          {currentConcept.teaching_examples.map((example, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-start gap-3 relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                              <span className="text-lg leading-none mt-0.5">🔬</span>
                              <div>
                                <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Demo {idx + 1}</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                  {example}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No classroom demos available for this concept.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tab content 6: Teacher Tips */}
                {activeConceptTab === 'tips' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Pedagogical Classroom Tips (शिक्षक सुझाव)</h4>
                      
                      {currentConcept.classroom_tips && currentConcept.classroom_tips.length > 0 ? (
                        <div className="space-y-3">
                          {currentConcept.classroom_tips.map((tip, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm flex items-start gap-3 relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                              <span className="text-lg leading-none mt-0.5">💡</span>
                              <div>
                                <h5 className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Tip {idx + 1}</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                  {tip}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No teacher tips available for this concept.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Interactive Diagram Panel */}
              <div className="lg:col-span-5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-3 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left mb-2">Live Diagram / Animation</h4>
                  <div className="bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-center">
                    {currentConcept.title.toLowerCase().includes('photosynthesis') ? (
                      <PhotosynthesisDiagram />
                    ) : currentConcept.title.toLowerCase().includes('water cycle') || currentConcept.title.toLowerCase().includes('jal') ? (
                      <WaterCycleDiagram />
                    ) : currentConcept.title.toLowerCase().includes('gravity') || currentConcept.title.toLowerCase().includes('gurutva') ? (
                      <GravityDiagram />
                    ) : (
                      <GenericDiagram topicName={currentConcept.title} />
                    )}
                  </div>
                </div>
                <div className="text-left bg-brand-50/50 dark:bg-brand-950/40 p-3.5 rounded-lg border border-brand-100/40 dark:border-brand-500/20 shadow-sm">
                  <h5 className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider leading-none mb-1.5">Visual Suggestion</h5>
                  <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {currentConcept.diagram_suggestion}
                  </p>
                </div>
              </div>
            </motion.div>
          )
          )}

          {activeFeature === 'quiz' && (
            !currentQuiz ? (
              <motion.div 
                key="quiz-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 text-slate-400 space-y-4 max-w-sm mx-auto"
              >
                <span className="text-5xl">📝</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Active Quiz</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Students ke liye interactive quiz create karne ke liye voice command dein (e.g. <i>"Start quiz on Photosynthesis"</i>) ya niche click karein.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button 
                    onClick={() => triggerQuizGeneration('Photosynthesis')}
                    className="px-3 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-900/30 transition-all active:scale-95"
                  >
                    🌱 Photosynthesis Quiz
                  </button>
                  <button 
                    onClick={() => triggerQuizGeneration('Water Cycle')}
                    className="px-3 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-900/30 transition-all active:scale-95"
                  >
                    💧 Water Cycle Quiz
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl py-4 space-y-6"
            >
              {/* Quiz progress header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                    Interactive Quiz: {currentQuiz.topic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {!currentQuiz.showResults 
                      ? `Question ${currentQuiz.currentIndex + 1} of ${currentQuiz.questions.length}` 
                      : 'Quiz Completed'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs font-bold rounded-lg border border-green-100 dark:border-green-500/20">
                  Score: {currentQuiz.score} / {currentQuiz.questions.length}
                </div>
              </div>

              {!currentQuiz.showResults ? (
                <div className="space-y-6">
                  {/* Question Card */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-brand-500"></div>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">VERBAL MCQ</span>
                    <h4 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 mt-1.5 leading-snug">
                      {currentQuiz.questions[currentQuiz.currentIndex].question}
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuiz.questions[currentQuiz.currentIndex].options.map((option, i) => {
                      const isSelected = currentQuiz.selectedOption === option;
                      const isCorrectAnswer = option === currentQuiz.questions[currentQuiz.currentIndex].correct_answer;
                      
                      let btnStyle = 'border-slate-200 hover:border-brand-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                      if (currentQuiz.isAnswered) {
                        if (isCorrectAnswer) {
                          btnStyle = 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400';
                        } else if (isSelected) {
                          btnStyle = 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400';
                      }

                      return (
                        <button
                          key={i}
                          disabled={currentQuiz.isAnswered}
                          onClick={() => selectQuizOption(option)}
                          className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </div>
                          {currentQuiz.isAnswered && isCorrectAnswer && <span className="text-green-600 text-lg">✓</span>}
                          {currentQuiz.isAnswered && isSelected && !isCorrectAnswer && <span className="text-red-600 text-lg">✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {currentQuiz.isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-slate-50 border dark:bg-slate-800/40 dark:border-slate-700/50 text-left space-y-1"
                    >
                      <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Explanation (Hinglish)</h5>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {currentQuiz.questions[currentQuiz.currentIndex].explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Controllers */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {!currentQuiz.isAnswered ? (
                      <button
                        onClick={submitQuizAnswer}
                        disabled={!currentQuiz.selectedOption}
                        className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          currentQuiz.selectedOption 
                            ? 'bg-brand-500 text-white hover:bg-brand-600 cursor-pointer shadow-md' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border dark:border-slate-700'
                        }`}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuizQuestion}
                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-md"
                      >
                        {currentQuiz.currentIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Results Slate */
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-8 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/20 text-center space-y-6 max-w-md mx-auto"
                >
                  <div className="text-5xl">🏆</div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-display">Well Done!</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Class has successfully completed the evaluation.</p>
                  </div>

                  <div className="py-4 px-6 bg-white dark:bg-slate-900 rounded-xl inline-block border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Final Classroom Score</p>
                    <h5 className="text-4xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
                      {currentQuiz.score} <span className="text-slate-300 dark:text-slate-700 text-2xl">/</span> {currentQuiz.questions.length}
                    </h5>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <MdRefresh className="text-base" /> Restart Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
          )}

          {activeFeature === 'translation' && (
            !currentTranslation ? (
              <motion.div 
                key="translation-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 text-slate-400 space-y-4 max-w-sm mx-auto"
              >
                <span className="text-5xl">🗣️</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Translation Active</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Textbook sentence dictate karne ya translate karne ke liye voice command boleins (e.g. <i>"Translate Welcome to class children"</i>) ya click karein.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button 
                    onClick={() => triggerTranslation('Welcome to class, children! Today we will learn a new topic.')}
                    className="px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 rounded-lg border border-orange-100 dark:border-orange-900/30 transition-all active:scale-95"
                  >
                    🗣️ Welcome Message
                  </button>
                  <button 
                    onClick={() => triggerTranslation('Photosynthesis is the process by which green plants prepare their own food.')}
                    className="px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 rounded-lg border border-orange-100 dark:border-orange-900/30 transition-all active:scale-95"
                  >
                    🌱 Science Sentence
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="translation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl py-2 space-y-6"
            >
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                  Bilingual Translation & Dictation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Converts speech to text and reads translated text aloud side-by-side
                </p>
              </div>

              {/* Dictation Box */}
              <div className="p-4 rounded-xl bg-slate-100/55 dark:bg-slate-800/40 border text-left">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Original Dictation (English)</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  "{currentTranslation.original_text}"
                </p>
              </div>

              {/* Translation grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hindi panel */}
                <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="text-left space-y-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-orange-50 text-orange-600 rounded dark:bg-orange-500/10 dark:text-orange-400">Hindi (हिंदी)</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed font-display">
                      {currentTranslation.hindi_text}
                    </p>
                  </div>
                  <button
                    onClick={() => speakText(currentTranslation.hindi_text, 'Hindi')}
                    className="self-start px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200 hover:bg-brand-50/20 text-xs font-bold text-brand-600 dark:border-slate-800 dark:text-brand-400 flex items-center gap-1"
                  >
                    <MdVolumeUp className="text-sm" /> Listen Hindi
                  </button>
                </div>

                {/* Hinglish panel */}
                <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="text-left space-y-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-blue-50 text-blue-600 rounded dark:bg-blue-500/10 dark:text-blue-400">Hinglish (रोमन हिंदी)</span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentTranslation.hinglish_text}
                    </p>
                  </div>
                  <button
                    onClick={() => speakText(currentTranslation.hinglish_text, 'Hinglish')}
                    className="self-start px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200 hover:bg-brand-50/20 text-xs font-bold text-brand-600 dark:border-slate-800 dark:text-brand-400 flex items-center gap-1"
                  >
                    <MdVolumeUp className="text-sm" /> Listen Hinglish
                  </button>
                </div>
              </div>
            </motion.div>
          )
          )}

          {activeFeature === 'activity' && (
            !currentActivity ? (
              <motion.div 
                key="activity-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 text-slate-400 space-y-4 max-w-sm mx-auto"
              >
                <span className="text-5xl">⏳</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Active Activity</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Class group activity shuru karne ke liye voice command boleins (e.g. <i>"Start a 5-minute activity about Water Cycle"</i>) ya niche click karein.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button 
                    onClick={() => triggerActivityGuide('Water Cycle', 5)}
                    className="px-3 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-900/30 transition-all active:scale-95"
                  >
                    💧 Water Cycle Activity
                  </button>
                  <button 
                    onClick={() => triggerActivityGuide('Photosynthesis', 5)}
                    className="px-3 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-900/30 transition-all active:scale-95"
                  >
                    🌱 Photosynthesis Activity
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2"
            >
              {/* Timer & controls */}
              <div className="md:col-span-5 flex flex-col items-center space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display text-center leading-tight">
                  {currentActivity.title}
                </h3>
                
                {/* SVG Circular Progress Ring */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-slate-800" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="72" 
                      stroke="#f43f5e" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={452}
                      strokeDashoffset={452 - (452 * (currentActivity.duration_seconds - currentActivity.elapsed_seconds)) / currentActivity.duration_seconds}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  
                  {/* Timer display */}
                  <div className="absolute text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Remaining</p>
                    <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono leading-none mt-1">
                      {Math.floor((currentActivity.duration_seconds - currentActivity.elapsed_seconds) / 60)}:
                      {String((currentActivity.duration_seconds - currentActivity.elapsed_seconds) % 60).padStart(2, '0')}
                    </h4>
                  </div>
                </div>

                {/* Progress Indicators & Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleActivityTimer}
                    className={`p-2.5 rounded-full shadow-md text-white transition-transform duration-200 active:scale-95 ${
                      currentActivity.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={currentActivity.isActive ? 'Pause Timer' : 'Start Timer'}
                  >
                    {currentActivity.isActive ? <MdPause className="text-xl" /> : <MdPlayArrow className="text-xl" />}
                  </button>
                  <button
                    onClick={resetActivityTimer}
                    className="p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-md"
                    title="Reset Timer"
                  >
                    <MdRefresh className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Instructions steps and materials */}
              <div className="md:col-span-7 text-left space-y-4">
                {/* Materials list */}
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/15 dark:border-rose-950/20 dark:bg-rose-950/5">
                  <h4 className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5">Required Materials</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentActivity.materials.map((mat, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border rounded-lg shadow-sm">
                        📍 {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step List */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Activity Steps</h4>
                  <div className="space-y-2">
                    {currentActivity.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
          )}

          {activeFeature === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl py-4"
            >
              {summaryText ? (
                <div className="p-6 rounded-2xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-left space-y-4 shadow-inner relative">
                  {/* Chalkboard styling header */}
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-800 pb-3 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
                      📝 Board Notes: Lesson Summary
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Class VI Science</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {summaryText.replace(/\*\*/g, '')}
                  </p>
                  <button
                    onClick={() => speakText(summaryText)}
                    className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow hover:bg-brand-600"
                  >
                    <MdVolumeUp className="text-sm" /> Read Aloud
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2">
                  <span className="text-4xl">🗒️</span>
                  <p className="text-sm">Summary abhi generated nahi hai. Voice Command dein: "Lesson Summary".</p>
                </div>
              )}
            </motion.div>
          )}

          {activeFeature === 'homework' && (
            <motion.div 
              key="homework"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl py-4"
            >
              {homeworkQuestions ? (
                <div className="p-6 rounded-2xl border border-amber-200/70 bg-amber-50/10 dark:border-amber-900/30 dark:bg-amber-950/5 text-left space-y-4 shadow-sm relative overflow-hidden">
                  {/* Notebook line decorations */}
                  <div className="absolute top-0 right-10 w-8 h-full border-r border-red-200/50 hidden sm:block"></div>
                  
                  <div className="border-b border-amber-200 dark:border-amber-900 pb-3">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                      Homework Assignment (गृहकार्य)
                    </h3>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase mt-0.5">Note in your notebooks</p>
                  </div>
                  
                  <ol className="space-y-3.5 list-decimal pl-5 text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {homeworkQuestions.map((q, i) => (
                      <li key={i} className="border-b border-dashed border-slate-200/60 dark:border-slate-800 pb-1.5">
                        {q}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2">
                  <span className="text-4xl">🏠</span>
                  <p className="text-sm">Homework abhi generated nahi hai. Voice Command dein: "Generate Homework".</p>
                </div>
              )}
            </motion.div>
          )}

          {activeFeature === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl py-2 space-y-4"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">Session Log History</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">History of all topics explained and quizzes run in this session</p>
              </div>

              {historyList.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {item.type === 'concept' ? '🌱' : item.type === 'quiz' ? '📝' : item.type === 'translation' ? '🗣️' : '⏳'}
                        </span>
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.title}</h4>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.type} • {item.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (item.type === 'concept') triggerConceptSimplification(item.title.replace(/ \(.*\)/g, ''));
                          else if (item.type === 'quiz') triggerQuizGeneration(item.title.replace('Quiz: ', ''));
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg"
                      >
                        Reload
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2 border border-dashed rounded-2xl">
                  <span className="text-4xl">⏱️</span>
                  <p className="text-sm">Session log is empty. Try explaining a concept first!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Free-form Chat Mirror ─────────────────────────────────────────── */}
          {activeFeature === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl py-4 space-y-5"
            >
              {smartBoardChatMessage ? (
                <div className="space-y-5">

                  {/* Board badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200/40 dark:border-brand-800/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                      📡 AI Co-Pilot — Live Response
                    </span>
                  </div>

                  {/* Teacher's question */}
                  <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                      🧑‍🏫 Teacher's Question
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{smartBoardChatMessage.question}"
                    </p>
                  </div>

                  {/* AI Answer — large projector-friendly card */}
                  <div className="p-6 rounded-2xl border border-brand-200/40 bg-gradient-to-br from-brand-50/20 to-transparent dark:border-brand-800/30 dark:from-brand-950/20 shadow-sm space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-extrabold shadow-sm shrink-0">
                        AI
                      </div>
                      <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        ClassPilot Answer
                      </p>
                    </div>
                    <p className="text-base lg:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
                      <Typewriter text={smartBoardChatMessage.answer} />
                    </p>
                  </div>

                  {/* Read aloud button */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => speakText(smartBoardChatMessage.answer)}
                      className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow hover:bg-brand-600 active:scale-95 transition-all"
                    >
                      <MdVolumeUp className="text-sm" /> Read Aloud
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-400 space-y-3">
                  <span className="text-5xl">💬</span>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Ask a Question</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Mic ya chat box mein koi bhi sawaal poochein — Smart Board par jawab yahan dikhega.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
