import React from 'react';
// Asegúrate de que esta ruta sea exacta. Si Context está con mayúscula en tu carpeta, cámbialo aquí.
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';
import { AnimatePresence } from 'framer-motion';

// IMPORTANTE: export const
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