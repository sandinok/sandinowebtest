import React, { memo, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindows } from '../context/WindowContext';
import { Window } from './Window';
import { PortfolioContent, YouTubeContent, AboutContent, ContactContent, PlaceholderContent } from './AppContents';

export const WindowManager = memo(() => {
    const { windows, closeWindow } = useWindows();

    // Only show visible windows
    const visibleWindows = useMemo(() => {
        return windows
            .filter(w => w.isOpen && !w.isMinimized)
            .sort((a, b) => a.zIndex - b.zIndex);
    }, [windows]);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Escape to close focused window
            if (event.key === 'Escape' && visibleWindows.length > 0) {
                const topWindow = visibleWindows[visibleWindows.length - 1];
                closeWindow(topWindow.id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visibleWindows, closeWindow]);

    if (visibleWindows.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
            <AnimatePresence mode="popLayout">
                {visibleWindows.map((window) => (
                    <div key={window.id} className="pointer-events-auto">
                        <Window
                            id={window.id}
                            title={window.title}
                            zIndex={window.zIndex}
                            onFocus={() => {
                                // Window focusing is handled by WindowContext
                            }}
                        >
                            {window.id === 'portfolio' && <PortfolioContent />}
                            {window.id === 'youtube' && <YouTubeContent />}
                            {window.id === 'about' && <AboutContent />}
                            {window.id === 'contact' && <ContactContent />}
                            {['animations', 'inspiration'].includes(window.id) && (
                                <PlaceholderContent title={window.title} />
                            )}
                        </Window>
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
});

WindowManager.displayName = 'WindowManager';

export default WindowManager;
