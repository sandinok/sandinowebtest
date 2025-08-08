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
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[10000]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="flex gap-3 px-6 py-4 rounded-2xl backdrop-blur-3xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(0, 0, 0, 0.25) 0%,
              rgba(0, 0, 0, 0.15) 50%,
              rgba(0, 0, 0, 0.2) 100%
            )
          `,
          backdropFilter: 'blur(40px) saturate(1.5) brightness(1.1)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.5) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05),
            0 20px 40px -10px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05)
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
              initial={{ scale: 0, opacity: 0, x: -20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                x: 0,
                transition: { delay: index * 0.05 }
              }}
              exit={{ scale: 0, opacity: 0, x: 20 }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
    
    return {
      // Reduce animation complexity con muchas ventanas
      animationQuality: visibleCount > 3 ? 'reduced' : 'high',
      // Adjust blur intensity basado en performance
      blurIntensity: visibleCount > 5 ? 'low' : 'high',
      // Enable/disable certain effects
      enableParallax: visibleCount <= 2,
      enableReflections: visibleCount <= 4
    };
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

      {/* Development stats overlay */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed top-4 right-4 bg-black/50 backdrop-blur-md text-white p-3 rounded-lg text-xs font-mono z-[10001]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div>Windows: {windowStats.visible}/{windowStats.total}</div>
          <div>Minimized: {windowStats.minimized}</div>
          <div>Quality: {layoutConfig.animationQuality}</div>
        </motion.div>
      )}
    </>
  );
});

// Export default
export default WindowManager;
