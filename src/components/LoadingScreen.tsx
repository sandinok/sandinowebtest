// src/components/LoadingScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  // Simulación de progreso más realista
  const simulateProgress = useCallback(() => {
    let simulatedProgress = 0;
    const increments = [10, 15, 20, 25, 30]; // Incrementos variados
    
    const interval = setInterval(() => {
      // Incremento variable para simular etapas de carga
      const increment = increments[Math.floor(Math.random() * increments.length)];
      simulatedProgress = Math.min(simulatedProgress + increment, 100);
      setProgress(simulatedProgress);
      
      if (simulatedProgress >= 100) {
        clearInterval(interval);
        // Retraso breve antes de completar para que se vea el 100%
        setTimeout(() => {
          setIsMounted(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 300);
      }
    }, 300); // Intervalo más consistente

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  useEffect(() => {
    const cleanup = simulateProgress();
    return cleanup;
  }, [simulateProgress]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center z-50"
      >
        <div className="text-center w-full max-w-md px-4 relative">
          {/* Logo/Nombre con efecto de entrada mejorado */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.7,
              delay: 0.1,
              ease: "easeOut"
            }}
            className="mb-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 font-serif tracking-wide">
              Sandino
            </h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-200 mt-3 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Digital Artist & Content Creator
            </motion.p>
          </motion.div>
          
          {/* Barra de progreso con efectos refinados */}
          <div className="mb-8 relative">
            <motion.div
              className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut"
                }}
              />
              
              {/* Efecto de brillo en la barra */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Indicador de porcentaje */}
            <motion.div
              className="absolute -top-7 right-0 text-blue-300 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
          
          {/* Texto de carga con transiciones suaves */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="h-6 mb-12"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={Math.floor(progress / 25)} // Cambia el mensaje cada 25%
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-blue-300 text-sm md:text-base font-light"
              >
                {progress < 25 && "Inicializando experiencia..."}
                {progress >= 25 && progress < 50 && "Cargando contenido creativo..."}
                {progress >= 50 && progress < 75 && "Preparando efectos visuales..."}
                {progress >= 75 && progress < 100 && "Casi listo..."}
                {progress >= 100 && "¡Todo listo!"}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          {/* Efecto de partículas flotantes optimizadas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-300/20 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{ 
                  y: [null, -30, -60],
                  opacity: [0, 0.7, 0],
                  x: `+=${(Math.random() - 0.5) * 30}`
                }}
                transition={{ 
                  duration: 4 + Math.random() * 3,
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
