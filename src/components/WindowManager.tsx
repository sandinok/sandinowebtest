// src/components/WindowManager.tsx
import React, { memo, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

export const WindowManager = memo(() => {
  const { windows } = useWindows();

  const visibleWindows = useMemo(() => {
    // filtrar primero (isOpen y no minimizadas), luego ordenar por zIndex asc
    const filtered = windows.filter(w => w.isOpen && !w.isMinimized);
    // copia para sort in-place sin tocar estado original
    return [...filtered].sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);

  return (
    <AnimatePresence mode="popLayout">
      {visibleWindows.map(w => (
        <Window key={w.id} window={w} />
      ))}
    </AnimatePresence>
  );
});

export default WindowManager;
