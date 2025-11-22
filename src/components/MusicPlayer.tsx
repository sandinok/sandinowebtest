import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed top-6 right-6 z-40"
    >
      <motion.div
        animate={{ width: isExpanded ? 320 : 60, height: isExpanded ? 140 : 60 }}
        className="liquid-glass rounded-[2rem] overflow-hidden relative cursor-pointer"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Compact View (Icon only) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <span className="text-xs font-bold text-white">♫</span>
          </div>
        </div>

        {/* Expanded View */}
        <div className={`p-5 flex flex-col justify-between h-full transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg" />
              <div>
                <h3 className="text-white font-medium text-sm leading-tight">Cosmic Vibes</h3>
                <p className="text-white/50 text-xs">Sandino's Mix</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="text-white/40 hover:text-white transition-colors"
            >
              <MinusIcon />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button className="text-white/70 hover:text-white"><SkipBack size={20} /></button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white/70 hover:text-white"><SkipForward size={20} /></button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MinusIcon = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
