
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';

export const WindowManager = () => {
  const { windows } = useWindows();

  return (
    <AnimatePresence>
      {windows
        .filter(window => window.isOpen && !window.isMinimized)
        .map(window => (
          <Window key={window.id} window={window} />
        ))}
    </AnimatePresence>
  );
};
