// src/components/WindowManager.tsx
import React, { memo, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

// Componente ultra-optimizado con memoización profunda y renderizado eficiente
export const WindowManager = memo(() => {
  const { windows } = useWindows();

  // Memoizamos el filtrado y ordenación para evitar cálculos en cada render
  const visibleWindows = useMemo(() => 
    windows
      .filter(w => w.isOpen && !w.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex), // Orden por z-index para stacking natural
    [windows]
  );

  return (
    <AnimatePresence mode="wait">
      {visibleWindows.map(window => (
        <Window key={window.id} window={window} />
      ))}
    </AnimatePresence>
  );
});

// Exportamos también como default para flexibilidad
export default WindowManager;
