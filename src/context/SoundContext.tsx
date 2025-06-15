
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type SoundContextType = {
  playSound: (sound: string) => void;
  stopSound: (sound: string) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  volume: number;
};

const SoundContext = createContext<SoundContextType>({
  playSound: () => {},
  stopSound: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  isMuted: false,
  volume: 0.2
});

export const useSounds = () => useContext(SoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

// Sonidos iOS optimizados (URLs de ejemplo - reemplazar con sonidos reales)
const SOUNDS = {
  click1: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  click2: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
  click3: 'https://www.soundjay.com/misc/sounds/water-drop-2.wav',
  click4: 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav',
  click5: 'https://www.soundjay.com/misc/sounds/pop-1.wav',
  click6: 'https://www.soundjay.com/misc/sounds/interface-1.wav',
  minimize: 'https://www.soundjay.com/misc/sounds/whoosh-1.wav',
  maximize: 'https://www.soundjay.com/misc/sounds/swoosh-1.wav',
  close: 'https://www.soundjay.com/misc/sounds/soft-click-1.wav',
};

// Cache de audio optimizado
const audioCache = new Map<string, HTMLAudioElement>();

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.2);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Inicializar sonidos de forma lazy
  const initializeAudio = useCallback(() => {
    if (isInitialized) return;

    Object.entries(SOUNDS).forEach(([key, url]) => {
      if (!audioCache.has(key)) {
        const audio = new Audio();
        audio.volume = volume;
        audio.src = url;
        audio.preload = 'auto';
        
        // Configurar para evitar loops
        audio.loop = false;
        audio.addEventListener('ended', () => {
          audio.currentTime = 0;
        });

        audioCache.set(key, audio);
      }
    });
    
    setIsInitialized(true);
  }, [volume, isInitialized]);

  // Actualizar volumen de todos los sonidos
  useEffect(() => {
    audioCache.forEach(audio => {
      audio.volume = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  const playSound = useCallback((sound: string) => {
    if (!isInitialized) {
      initializeAudio();
    }

    if (isMuted) return;
    
    const audio = audioCache.get(sound);
    if (audio && audio.readyState >= 2) {
      // Detener sonido anterior si está reproduciéndose
      if (!audio.paused) {
        audio.currentTime = 0;
      }
      
      // Reproducir con manejo de errores
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Sound play prevented:", error.message);
        });
      }
    }
  }, [isMuted, isInitialized, initializeAudio]);

  const stopSound = useCallback((sound: string) => {
    const audio = audioCache.get(sound);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleSetVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  // Inicializar en primer click del usuario
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initializeAudio]);

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        toggleMute,
        setVolume: handleSetVolume,
        isMuted,
        volume
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
