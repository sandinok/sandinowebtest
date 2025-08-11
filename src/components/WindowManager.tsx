// src/components/WindowManager.tsx
import React, { memo, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

// Taskbar component para mostrar ventanas minimizadas
const Taskbar = memo(() => {
  const { windows, restoreWindow } = useWindows();
  
  const minimizedWindows = useMemo(() => 
    windows.filter(w => w.isOpen && w.isMinimized),
    [windows]
  );

  if (minimizedWindows.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-[10000]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="flex flex-wrap gap-2 px-4 py-3 rounded-2xl"
        style={{
          background: `
            linear-gradient(135deg,
              rgba(0,0,0,0.22) 0%,
              rgba(0,0,0,0.14) 55%,
              rgba(0,0,0,0.18) 100%
            )
          `,
          backdropFilter: 'blur(18px) saturate(1.35) brightness(1.06)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.35) brightness(1.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 14px 28px -10px rgba(0,0,0,0.28),
            0 0 0 1px rgba(255,255,255,0.05)
          `,
        }}
      >
        <AnimatePresence>
          {minimizedWindows.map((window, index) => (
            <motion.button
              key={window.id}
              className="relative group px-4 py-2 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 220, damping: 24, delay: index * 0.04 }
              }}
              exit={{ opacity: 0, y: 10 }}
              whileHover={{
                scale: 1.03,
                y: -1,
                backgroundColor: 'rgba(255, 255, 255, 0.10)',
                borderColor: 'rgba(255, 255, 255, 0.18)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => restoreWindow(window.id)}
            >
              <span className="text-white text-sm font-medium">
                {window.title}
              </span>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// Performance monitoring hook para debug
const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Log performance warnings solo en desarrollo
        if (process.env.NODE_ENV === 'development' && fps < 30) {
          console.warn(`Low FPS detected: ${fps}fps`);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);
};

// Window ordering hook para z-index optimization
const useWindowOrdering = (windows: any[]) => {
  return useMemo(() => {
    const visibleWindows = windows.filter(w => w.isOpen && !w.isMinimized);
    
    // Sort by zIndex pero mantenemos referencia estable para evitar re-renders
    return [...visibleWindows].sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);
};

// Main WindowManager component
export const WindowManager = memo(() => {
  const { windows } = useWindows();
  
  // Performance monitoring en desarrollo
  usePerformanceMonitor();
  
  // Optimized window ordering
  const orderedWindows = useWindowOrdering(windows);
  
  // Memoized visible windows count para estadísticas
  const windowStats = useMemo(() => ({
    total: windows.length,
    open: windows.filter(w => w.isOpen).length,
    minimized: windows.filter(w => w.isMinimized).length,
    maximized: windows.filter(w => w.isMaximized).length,
    visible: orderedWindows.length
  }), [windows, orderedWindows.length]);

  // Layout optimization basado en número de ventanas
  const layoutConfig = useMemo(() => {
    const visibleCount = windowStats.visible;

    // Más suave y eficiente con muchas ventanas
    return {
      animationQuality: visibleCount > 2 ? 'reduced' : 'high',
      blurIntensity: visibleCount > 3 ? 'low' : 'high',
      enableParallax: visibleCount <= 2,
      enableReflections: visibleCount <= 3,
    } as const;
  }, [windowStats.visible]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevenir shortcuts cuando hay inputs focuseados
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Alt + Tab functionality (simplified)
      if (event.altKey && event.key === 'Tab') {
        event.preventDefault();
        // TODO: Implement window cycling
      }

      // Escape to close focused window
      if (event.key === 'Escape' && orderedWindows.length > 0) {
        const topWindow = orderedWindows[orderedWindows.length - 1];
        // TODO: Close top window
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderedWindows]);

  // Performance optimization: solo renderizar si hay cambios significativos
  const shouldRender = useMemo(() => {
    return orderedWindows.length > 0 || windows.some(w => w.isMinimized);
  }, [orderedWindows.length, windows]);

  if (!shouldRender) return null;

  // Container variants para animaciones coordinadas
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  return (
    <>
      {/* Windows Container */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ zIndex: 100 }}
      >
        <AnimatePresence mode="popLayout">
          {orderedWindows.map((window) => (
            <motion.div
              key={window.id}
              className="pointer-events-auto"
              layout={layoutConfig.animationQuality === 'high'}
              layoutId={`window-${window.id}`}
            >
              <Window 
                window={window} 
                layoutConfig={layoutConfig}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Taskbar for minimized windows */}
      <AnimatePresence>
        <Taskbar />
      </AnimatePresence>
    </>
  );
});

// Export default
export default WindowManager;
