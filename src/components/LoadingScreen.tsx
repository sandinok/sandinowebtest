// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Simular progreso de carga
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleAnimationComplete = () => {
    if (progress >= 100) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center z-50"
      >
        <div className="text-center w-full max-w-md px-4">
          {/* Logo/Nombre con efecto de entrada */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 font-serif tracking-wide">
              Sandino
            </h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-200 mt-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Digital Artist & Content Creator
            </motion.p>
          </motion.div>
          
          {/* Barra de progreso con efectos */}
          <div className="mb-10 relative">
            <motion.div
              className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            
            {/* Puntos animados en la barra */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.8 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Texto de carga con efecto de escritura */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="h-6"
          >
            <motion.p
              className="text-blue-300 text-sm md:text-base font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {progress < 30 && "Inicializando experiencia..."}
              {progress >= 30 && progress < 60 && "Cargando contenido creativo..."}
              {progress >= 60 && progress < 90 && "Preparando efectos visuales..."}
              {progress >= 90 && "¡Todo listo!"}
            </motion.p>
          </motion.div>
          
          {/* Efecto de partículas flotantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-300/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{ 
                  y: [null, -20, -40],
                  opacity: [0, 1, 0],
                  x: `+=${(Math.random() - 0.5) * 20}`
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
