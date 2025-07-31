// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Simulación de progreso con curva natural
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Pequeño delay para mostrar 100%
          setTimeout(() => setIsMounted(false), 500);
          return 100;
        }
        // Incrementos más pequeños al final para suavidad
        const increment = prev > 90 ? 0.5 : prev > 70 ? 1 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center z-50 overflow-hidden"
    >
      <div className="text-center w-full max-w-xs px-4 relative">
        {/* Logo con microanimaciones */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut"
          }}
          className="mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 tracking-wider mb-2"
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
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto rounded-full"
          />
        </motion.div>
        
        {/* Barra de progreso con efectos refinados */}
        <div className="mb-8 relative">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {/* Efecto de brillo animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
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
          </div>
          
          {/* Indicador de porcentaje con microanimación */}
          <motion.div
            className="absolute -top-7 right-0 text-blue-300 text-sm font-medium tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
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
              key={Math.floor(progress / 33)} // Cambia cada 33%
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-blue-300 text-sm font-light tracking-wide"
            >
              {progress < 33 && "Preparando experiencia..."}
              {progress >= 33 && progress < 66 && "Cargando contenido..."}
              {progress >= 66 && "¡Casi listo!"}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Efecto de partículas flotantes sutiles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-blue-300/20 to-cyan-300/10"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: [null, -30 - Math.random() * 30, -60 - Math.random() * 30],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
                x: `+=${(Math.random() - 0.5) * 20}`
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
