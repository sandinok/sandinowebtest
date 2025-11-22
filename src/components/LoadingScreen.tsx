import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

type Props = {
  onDone?: () => void;
};

export const LoadingScreen: React.FC<Props> = ({ onDone }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Física de resorte para la barra (se siente orgánica)
  const progress = useSpring(0, { stiffness: 40, damping: 15 });
  const width = useTransform(progress, (v) => `${v}%`);
  const opacity = useTransform(progress, [0, 10], [0, 1]);

  useEffect(() => {
    // Secuencia de carga simulada
    const sequence = async () => {
      progress.set(20);
      await new Promise(r => setTimeout(r, 400));
      progress.set(45);
      await new Promise(r => setTimeout(r, 600));
      progress.set(80);
      await new Promise(r => setTimeout(r, 400));
      progress.set(100);
      await new Promise(r => setTimeout(r, 500));

      setIsVisible(false);
      // Esperar a que termine la animación de salida antes de desmontar App
      setTimeout(() => {
        onDone?.();
      }, 600);
    };

    sequence();
  }, [progress, onDone]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Fondo Ambiental */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,rgba(0,0,0,0)_60%)]" />

          <div className="relative z-10 w-64 flex flex-col items-center gap-8">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold tracking-[0.2em] text-white/90"
            >
              SANDINO
            </motion.h1>

            {/* Barra de progreso iOS */}
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                style={{ width }}
              />
            </div>

            <motion.p style={{ opacity }} className="text-xs text-white/40 font-medium tracking-widest uppercase">
              Loading Environment
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
