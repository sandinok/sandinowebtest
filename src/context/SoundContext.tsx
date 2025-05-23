
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
    
    // Variaciones para cada sonido
    const soundVariations: { [key: string]: Array<{ frequency: number; type: OscillatorType; duration: number }> } = {
      click1: [
        { frequency: 800, type: 'sine', duration: 0.2 },
        { frequency: 850, type: 'triangle', duration: 0.3 },
        { frequency: 780, type: 'sine', duration: 0.25 }
      ],
      click2: [
        { frequency: 900, type: 'sine', duration: 0.15 },
        { frequency: 920, type: 'triangle', duration: 0.2 },
        { frequency: 880, type: 'sine', duration: 0.25 }
      ],
      click3: [
        { frequency: 1000, type: 'sine', duration: 0.2 },
        { frequency: 1020, type: 'triangle', duration: 0.15 },
        { frequency: 980, type: 'sine', duration: 0.25 }
      ],
      click4: [
        { frequency: 1100, type: 'triangle', duration: 0.2 },
        { frequency: 1150, type: 'sine', duration: 0.15 },
        { frequency: 1080, type: 'triangle', duration: 0.25 }
      ],
      click5: [
        { frequency: 1200, type: 'sine', duration: 0.15 },
        { frequency: 1230, type: 'triangle', duration: 0.2 },
        { frequency: 1180, type: 'sine', duration: 0.25 }
      ],
      click6: [
        { frequency: 1300, type: 'triangle', duration: 0.2 },
        { frequency: 1320, type: 'sine', duration: 0.15 },
        { frequency: 1280, type: 'triangle', duration: 0.25 }
      ],
    };
    
    // Seleccionar aleatoriamente una variación del sonido
    const variations = soundVariations[soundId] || [{ frequency: 1000, type: 'sine', duration: 0.2 }];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(variation.frequency, audioContext.currentTime);
    oscillator.type = variation.type;
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + variation.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + variation.duration);
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
