
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  volume: 0.3
});

export const useSounds = () => useContext(SoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

// Sonidos suaves estilo iOS
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

// Pre-cargar los sonidos
const audioElements: Record<string, HTMLAudioElement> = {};

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);

  // Inicializar los sonidos sin autoplay
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio();
      audio.volume = volume;
      audio.src = url;
      audio.preload = 'auto';
      
      // No autoplay, solo preload
      audioElements[key] = audio;
    });
    
    setAudioLoaded(true);
  }, []);

  // Actualizar el volumen cuando cambie
  useEffect(() => {
    Object.values(audioElements).forEach(audio => {
      audio.volume = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  const playSound = (sound: string) => {
    if (!audioLoaded || isMuted) return;
    
    const audio = audioElements[sound];
    if (audio) {
      // Reset and play with error handling
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Sound play prevented: ", error);
        });
      }
    }
  };

  const stopSound = (sound: string) => {
    const audio = audioElements[sound];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        toggleMute,
        setVolume,
        isMuted,
        volume
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
