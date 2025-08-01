// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Simulación de progreso ultra suave con curva exponencial para realismo
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsMounted(false), 800); // Delay extendido para fade-out elegante
          return 100;
        }
        // Incrementos dinámicos: rápidos al inicio, lentos al final para tensión dramática
        const increment = prev < 20 ? 3 : prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return Math.min(prev + increment * (1 + Math.random() * 0.2), 100); // Variabilidad ligera para naturalidad
      });
    }, 60); // Intervalo más corto para fluidez máxima

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-[#001133] via-[#002255] to-[#003366] flex items-center justify-center z-50 overflow-hidden"
    >
      <div className="text-center w-full max-w-md px-6 relative">
        {/* Logo mejorado: tipografía elegante, animación de entrada con glow etéreo */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 120, damping: 15 }}
          className="mb-16"
        >
          <motion.h1 
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-100 to-emerald-200 tracking-widest mb-4"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              textShadow: ["0 0 10px rgba(255,255,255,0.3)", "0 0 20px rgba(255,255,255,0.5)", "0 0 10px rgba(255,255,255,0.3)"]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: "250% 250%" }}
          >
            Sandino
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-300/60 via-cyan-200/60 to-emerald-300/60 mx-auto rounded-full shadow-lg shadow-cyan-300/30"
            style={{ width: '80px' }}
          />
        </motion.div>
        
        {/* Barra de progreso ultra refinada: con sombra glow, bordes suaves y brillo dinámico */}
        <div className="mb-10 relative">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner shadow-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 rounded-full relative shadow-md shadow-cyan-300/40"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              {/* Brillo mejorado: múltiple capas para efecto etéreo */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"
                animate={{
                  x: ['-150%', '150%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/30 to-transparent rounded-full"
                animate={{
                  x: ['150%', '-150%'],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />
            </motion.div>
          </div>
          
          {/* Porcentaje con animación spring y glow sutil */}
          <motion.div
            className="absolute -top-9 right-0 text-cyan-100 text-base font-medium tracking-widest"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 12 }}
            style={{ textShadow: '0 0 8px rgba(0,255,255,0.4)' }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
        
        {/* Texto de carga con transiciones elegantes y sombra glow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          className="h-7 mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.floor(progress / 33)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-cyan-100 text-base font-light tracking-widest"
              style={{ textShadow: '0 0 6px rgba(0,255,255,0.3)' }}
            >
              {progress < 33 && "Despertando la creatividad..."}
              {progress >= 33 && progress < 66 && "Construyendo mundos digitales..."}
              {progress >= 66 && "¡Entrando al universo Sandino!"}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Partículas flotantes enormemente mejoradas: más tipos, movimientos etéreos, glow y variedad (inspirado en el tema estelar) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => {  // Aumentado para inmersión, pero optimizado
            const type = ['star', 'note', 'leaf', 'bubble'][Math.floor(Math.random() * 4)];
            const size = Math.random() * 6 + 3;
            const color = type === 'star' ? 'white' : type === 'note' ? 'rgba(255,220,100,0.4)' : type === 'leaf' ? 'rgba(100,255,150,0.3)' : 'rgba(150,200,255,0.3)';
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: [null, -50 - Math.random() * 50, -100 - Math.random() * 50],
                  opacity: [0, 0.7, 0],
                  scale: [0, 1.5, 0],
                  rotate: (Math.random() - 0.5) * 360,
                  x: `+=${(Math.random() - 0.5) * 40}`
                }}
                transition={{ 
                  duration: 6 + Math.random() * 5,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  boxShadow: `0 0 ${size * 2}px ${color}`,
                  filter: 'blur(1px)', // Toque etéreo
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
