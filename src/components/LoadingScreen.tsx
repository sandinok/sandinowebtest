// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Simulación de progreso hiperrealista con curva bezier-like para máxima suavidad
    let startTime = Date.now();
    const duration = 5000; // Duración total aproximada de 5s para carga simulada
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Curva bezier cúbica para aceleración inicial y desaceleración final
      const eased = t * t * (3 - 2 * t); // Ease-in-out suave
      const newProgress = eased * 100;
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setIsMounted(false), 1000); // Delay premium para inmersión
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-[#001133] via-[#002255] to-[#003366] flex items-center justify-center z-50 overflow-hidden"
    >
      <div className="text-center w-full max-w-lg px-8 relative">
        {/* Logo épico: con animación de revelado por capas y glow pulsante */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 100, damping: 14 }}
          className="mb-20"
        >
          <motion.h1 
            className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-50 to-emerald-100 tracking-[0.2em] mb-5"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              textShadow: ["0 0 12px rgba(255,255,255,0.4)", "0 0 24px rgba(255,255,255,0.6)", "0 0 12px rgba(255,255,255,0.4)"]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: "300% 300%" }}
          >
            Sandino
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="h-1.5 bg-gradient-to-r from-blue-200/70 via-cyan-100/70 to-emerald-200/70 mx-auto rounded-full shadow-xl shadow-cyan-100/40"
            style={{ width: '100px' }}
          />
        </motion.div>
        
        {/* Barra de progreso suprema: con multi-glow, partículas internas y bordes dinámicos */}
        <div className="mb-12 relative">
          <div className="h-3 bg-white/8 rounded-full overflow-hidden shadow-lg shadow-white/10 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-200 via-cyan-100 to-emerald-200 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              {/* Multi-brillos para efecto hipnótico */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/40 to-transparent rounded-full"
                animate={{
                  x: ['200%', '-200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              {/* Partículas internas en la barra para dinamismo */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 bottom-0 w-1 bg-white/50 rounded-full"
                  style={{ left: `${Math.random() * 100}%` }}
                  animate={{ opacity: [0.2, 0.8, 0.2], scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Porcentaje premium: con bounce y glow variable */}
          <motion.div
            className="absolute -top-10 right-0 text-cyan-50 text-lg font-medium tracking-[0.15em]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 150, damping: 10 }}
            style={{ textShadow: `0 0 ${8 + Math.sin(Date.now() / 1000) * 4}px rgba(0,255,255,0.5)` }} // Glow pulsante
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
        
        {/* Texto de carga élite: con fade cruzado y efectos de sombra dinámica */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: "easeOut" }}
          className="h-8 mb-20"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.floor(progress / 33)}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="text-cyan-50 text-lg font-light tracking-[0.1em]"
              style={{ textShadow: '0 0 8px rgba(0,255,255,0.4)' }}
            >
              {progress < 33 && "Encendiendo la inspiración..."}
              {progress >= 33 && progress < 66 && "Forjando conexiones creativas..."}
              {progress >= 66 && "¡Despegue inminente al mundo Sandino!"}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Partículas flotantes maestras: variedad enriquecida, movimientos orgánicos, interacciones y glow premium */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => {  // Aumentado para atmósfera inmersiva
            const type = ['star', 'note', 'leaf', 'bubble', 'meteor'][Math.floor(Math.random() * 5)];
            const size = Math.random() * 7 + 4;
            const color = {
              star: 'white',
              note: 'rgba(255,220,100,0.5)',
              leaf: 'rgba(100,255,150,0.4)',
              bubble: 'rgba(150,200,255,0.4)',
              meteor: 'rgba(255,255,200,0.6)'
            }[type];
            const isMeteor = type === 'meteor';
            return (
              <motion.div
                key={i}
                className={`absolute ${isMeteor ? 'w-2 h-2' : 'rounded-full'}`}
                initial={{ 
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  y: isMeteor ? -50 : Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: isMeteor ? window.innerHeight + 50 : [-50 - Math.random() * 60, -120 - Math.random() * 60],
                  x: isMeteor ? (Math.random() - 0.5) * 200 : `+=${(Math.random() - 0.5) * 50}`,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.8, 0],
                  rotate: isMeteor ? 0 : (Math.random() - 0.5) * 720
                }}
                transition={{ 
                  duration: isMeteor ? 2 + Math.random() * 1 : 7 + Math.random() * 6,
                  delay: Math.random() * 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: isMeteor ? "linear" : "easeInOut"
                }}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  boxShadow: `0 0 ${size * 3}px ${color}, inset 0 0 ${size / 2}px rgba(255,255,255,0.3)`,
                  filter: 'blur(1.5px)',
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
