import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MainTitle: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Auto-unlock on scroll or click
    const handleInteraction = () => setIsUnlocked(true);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      clearInterval(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 flex flex-col items-center justify-start pt-[15vh] z-50 pointer-events-none"
        >
          <motion.div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-white/90 tracking-wide drop-shadow-md">
              {formatDate(time)}
            </h2>
            <h1 className="text-8xl md:text-9xl font-bold text-white tracking-tighter drop-shadow-xl font-inter">
              {formatTime(time)}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 text-white/50 text-sm animate-pulse"
          >
            Tap or Scroll to Unlock
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
