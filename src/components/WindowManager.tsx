// src/components/WindowManager.tsx
import React, { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

// Memoizamos el componente para evitar renders innecesarios
export const WindowManager = memo(() => {
  const { windows } = useWindows();

  // Filtramos y ordenamos las ventanas por z-index para una renderización eficiente
  const visibleWindows = windows
    .filter(window => window.isOpen && !window.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex); // Renderizar en orden de z-index

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
