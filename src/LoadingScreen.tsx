import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

type Props = {
  onDone?: () => void;
};

export const LoadingScreen: React.FC<Props> = ({ onDone }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Spring physics para una barra de carga orgánica (no lineal)
  const progress = useSpring(0, { stiffness: 50, damping: 15, mass: 1 });
  const width = useTransform(progress, (v) => `${v}%`);
  const opacity = useTransform(progress, [0, 20], [0, 1]);

  useEffect(() => {
    // Simulación de carga no-lineal (más realista)
    const timeouts = [
      setTimeout(() => progress.set(30), 200),
      setTimeout(() => progress.set(65), 800),
      setTimeout(() => progress.set(85), 1400),
      setTimeout(() => progress.set(100), 1800),
      setTimeout(() => {
        setIsVisible(false);
        window.dispatchEvent(new CustomEvent('app-loading-done'));
        onDone?.();
      }, 2400),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [progress, onDone]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
        >
          {/* Fondo ambiental sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />

          <div className="relative z-10 flex flex-col items-center w-full max-w-[280px]">
            {/* Logo o Título con efecto Liquid */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl font-bold tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Sandino
            </motion.h1>

            {/* Barra de carga estilo iOS */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                style={{ width }}
              />
            </div>

            {/* Texto de estado */}
            <motion.div 
              style={{ opacity }}
              className="mt-4 text-xs font-medium text-white/40 tracking-widest uppercase"
            >
              Loading Experience
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
