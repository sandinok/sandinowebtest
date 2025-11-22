import React from 'react';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';
import { AnimatePresence } from 'framer-motion';

// NOTA: Usamos 'export const' explícitamente
export const WindowManager: React.FC = () => {
  const { windows } = useWindows();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {windows.map((win) => (
          win.isOpen && !win.isMinimized && (
            <Window key={win.id} {...win} />
          )
        ))}
      </AnimatePresence>
    </div>
  );
};