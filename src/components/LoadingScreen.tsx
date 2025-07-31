// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulación de progreso suave y natural
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Incrementos variables para simulación realista
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center z-50"
    >
      <div className="text-center w-full max-w-xs px-4">
        {/* Logo con animación sutil */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut"
          }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300 tracking-wider">
            Sandino
          </h1>
        </motion.div>
        
        {/* Barra de progreso minimalista */}
        <div className="mb-8 relative">
          <motion.div
            className="h-0.5 bg-white/20 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut"
              }}
            />
          </motion.div>
        </div>
        
        {/* Porcentaje con animación suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.p 
            key={Math.floor(progress)}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-blue-300 text-sm font-light tracking-widest"
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
        
        {/* Partículas sutiles flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{ 
                y: [null, -30, -60],
                opacity: [0, 0.5, 0],
                x: `+=${(Math.random() - 0.5) * 20}`
              }}
              transition={{ 
                duration: 3 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
