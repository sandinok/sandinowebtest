import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Heart, Music2 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulación de progreso
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        w-full max-w-xs p-4 rounded-[1.5rem]
        ios-liquid-glass border border-white/10
        flex flex-col gap-4
      "
    >
      <div className="flex gap-4 items-center">
        {/* Album Art */}
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg overflow-hidden">
          <Music2 className="text-white/50 relative z-10" />
          {isPlaying && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">Midnight City</h3>
          <p className="text-xs text-white/60 truncate">M83 • Hurry Up, We're Dreaming</p>
        </div>

        <button className="text-white/40 hover:text-red-400 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-2">
          <button className="text-white/70 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" className="opacity-50" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <button className="text-white/70 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" className="opacity-50" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};