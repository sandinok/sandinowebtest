// src/components/WindowManager.tsx
import React, { memo, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

export const WindowManager = memo(() => {
  const { windows } = useWindows();
  const visible = useMemo(() => {
    const arr = windows.filter(w => w.isOpen && !w.isMinimized);
    return [...arr].sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);

  return (
    <AnimatePresence mode="popLayout">
      {visible.map(w => (
        <Window key={w.id} window={w} />
      ))}
    </AnimatePresence>
  );
});

export default WindowManager;
