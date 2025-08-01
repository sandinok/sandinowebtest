// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Simulación de progreso con curva más natural y suave
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsMounted(false), 600); // Delay extendido para transición fluida
          return 100;
        }
        // Incrementos variables para sensación orgánica
        const increment = prev > 95 ? 0.3 : prev > 80 ? 0.8 : prev > 50 ? 1.5 : 2.5;
        return Math.min(prev + increment, 100);
      });
    }, 80); // Intervalo ajustado para animación más fluida

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-[#001133] via-[#002255] to-[#003366] flex items-center justify-center z-50 overflow-hidden"
    >
      {/* Panel central con glassmorphism: efecto de vidrio esmerilado líquido como en iOS/Figma */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
        style={{
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)', // Efecto líquido con sombras suaves
        }}
      >
        {/* Logo con animación fluida y gradiente dinámico */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <motion.h1 
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-100 to-emerald-200 tracking-wide mb-3"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: "300% 300%" }} // Gradiente más amplio para efecto líquido
          >
            Sandino
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            className="h-0.5 bg-gradient-to-r from-blue-300/50 to-emerald-300/50 mx-auto rounded-full"
            style={{ width: '60px' }}
          />
        </motion.div>
        
        {/* Barra de progreso con glassmorphism y brillo líquido */}
        <div className="mb-8 relative">
          <div className="h-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-300/70 via-cyan-200/70 to-emerald-300/70 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut"
              }}
            >
              {/* Brillo líquido animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
          
          {/* Porcentaje con efecto de aparición suave */}
          <motion.div
            className="absolute -top-8 right-0 text-cyan-200 text-sm font-medium tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 250, damping: 18 }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
        
        {/* Texto de carga con transiciones fluidas y glassmorphism sutil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="h-6 mb-10 text-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.floor(progress / 33)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-cyan-100/80 text-sm font-light tracking-wide bg-white/5 backdrop-blur-sm rounded-full px-4 py-1 inline-block"
            >
              {progress < 33 && "Iniciando viaje creativo..."}
              {progress >= 33 && progress < 66 && "Cargando inspiración..."}
              {progress >= 66 && "¡Bienvenido al universo Sandino!"}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Partículas flotantes con efecto líquido/glass: más suaves y etéreas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (  // Aumentado ligeramente para densidad equilibrada
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-blue-200/10 to-cyan-200/5 border border-white/5"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: [null, -40 - Math.random() * 40, -80 - Math.random() * 40],
                opacity: [0, 0.6, 0],
                scale: [0, 1.2, 0],
                x: `+=${(Math.random() - 0.5) * 30}`
              }}
              transition={{ 
                duration: 5 + Math.random() * 4,
                delay: Math.random() * 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                backdropFilter: 'blur(2px)', // Efecto glass sutil en partículas
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
