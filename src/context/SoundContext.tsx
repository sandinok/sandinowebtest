
import React, { createContext, useContext, ReactNode } from 'react';

interface SoundContextType {
  playSound: (soundId: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const playSound = (soundId: string) => {
    // Crear contexto de audio único para cada sonido
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Diferentes frecuencias para cada botón del dock
    const frequencies: { [key: string]: number } = {
      click1: 800,
      click2: 900,
      click3: 1000,
      click4: 1100,
      click5: 1200,
      click6: 1300,
    };

    const frequency = frequencies[soundId] || 1000;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
