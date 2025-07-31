// src/components/LoadingScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  progress?: number; // Añadido para permitir control externo del progreso
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete,
  progress: externalProgress 
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [messages] = useState([
    "Inicializando experiencia...",
    "Cargando contenido creativo...",
    "Preparando efectos visuales...",
    "Casi listo...",
    "¡Todo listo!"
  ]);

  // Determinar el mensaje actual basado en el progreso
  const getCurrentMessage = useCallback((prog: number) => {
    const index = Math.min(Math.floor(prog / 25), messages.length - 1);
    return messages[index];
  }, [messages]);

  // Simulación de progreso optimizada
  const simulateProgress = useCallback(() => {
    let simulatedProgress = 0;
    
    const interval = setInterval(() => {
      // Incrementos más suaves y realistas
      const increment = Math.random() * 8 + 2;
      simulatedProgress = Math.min(simulatedProgress + increment, 100);
      setInternalProgress(simulatedProgress);
      
      if (simulatedProgress >= 100) {
        clearInterval(interval);
        // Pequeño retraso para mostrar 100% antes de desmontar
        setTimeout(() => {
          setIsMounted(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 400);
      }
    }, 250); // Intervalo más consistente

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  useEffect(() => {
    // Si se proporciona progreso externo, úsalo; si no, simula
    if (externalProgress !== undefined) {
      setInternalProgress(externalProgress);
      if (externalProgress >= 100) {
        setTimeout(() => {
          setIsMounted(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 400);
      }
    } else {
      const cleanup = simulateProgress();
      return cleanup;
    }
  }, [externalProgress, simulateProgress]);

  const progress = externalProgress !== undefined ? externalProgress : internalProgress;
  const currentMessage = getCurrentMessage(progress);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center z-50"
      >
        <div className="text-center w-full max-w-md px-6 relative">
          {/* Logo/Nombre con animación mejorada */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 font-serif tracking-wide mb-2"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Sandino
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-200 font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Digital Artist & Content Creator
            </motion.p>
          </motion.div>
          
          {/* Barra de progreso con efectos refinados */}
          <div className="mb-10 relative max-w-xs mx-auto">
            <motion.div
              className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                {/* Efecto de brillo animado en la barra */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
            
            {/* Indicador de porcentaje con animación suave */}
            <motion.div
              className="absolute -top-8 right-0 text-blue-300 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
          
          {/* Texto de carga con transiciones suaves */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="h-7 mb-14 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={Math.floor(progress / 25)} // Cambia el mensaje cada 25%
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-blue-300 text-base font-light tracking-wide px-4"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          {/* Efecto de partículas flotantes optimizadas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-blue-300/30 to-cyan-300/20"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: [null, -40 - Math.random() * 40, -80 - Math.random() * 40],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                  x: `+=${(Math.random() - 0.5) * 30}`
                }}
                transition={{ 
                  duration: 4 + Math.random() * 4,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
