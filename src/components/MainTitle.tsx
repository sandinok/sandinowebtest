import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../context/WindowContext';

export const MainTitle: React.FC = () => {
  const { windows } = useWindows();
  const hasOpenWindows = windows.some(w => w.isOpen && !w.isMinimized);

  return (
    <motion.div
      className="absolute top-1/4 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: hasOpenWindows ? 0 : 1,
        y: hasOpenWindows ? -50 : 0,
        scale: hasOpenWindows ? 0.9 : 1
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
        Sandino
      </h1>
      <p className="mt-4 text-lg md:text-xl text-white/60 font-light tracking-[0.3em] uppercase">
        Digital Experience
      </p>
    </motion.div>
  );
};