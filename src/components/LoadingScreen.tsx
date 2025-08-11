// src/components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  maxDurationMs?: number;
  onDone?: () => void;
};

export const LoadingScreen: React.FC<Props> = ({ maxDurationMs = 800, onDone }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / maxDurationMs);
      setProgress(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setVisible(false);
        try { window.dispatchEvent(new CustomEvent('app-loading-done')); } catch {}
        onDone?.();
      }
    };
    raf = requestAnimationFrame(step);

    const dismiss = () => {
      setVisible(false);
      try { window.dispatchEvent(new CustomEvent('app-loading-done')); } catch {}
      onDone?.();
    };
    const handlers: Array<keyof WindowEventMap> = ['pointerdown', 'keydown'];
    handlers.forEach((ev) => window.addEventListener(ev, dismiss, { once: true }));
    return () => {
      if (raf) cancelAnimationFrame(raf);
      handlers.forEach((ev) => window.removeEventListener(ev, dismiss));
    };
  }, [maxDurationMs, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center bg-gradient-to-br from-[#001133] via-[#002255] to-[#003366]"
          aria-hidden
        >
          <div className="w-full max-w-lg px-8 text-center">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-50 to-emerald-100 tracking-[0.2em] mb-6"
              style={{ backgroundSize: '300% 300%' }}
            >
              Sandino
            </motion.h1>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-200 via-cyan-100 to-emerald-200 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <div className="mt-3 text-cyan-50/90 text-sm font-medium">{progress}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
