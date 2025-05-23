
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
  volume: 0.5
});

export const useSounds = () => useContext(SoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

// Sonidos disponibles
const SOUNDS = {
  click1: 'https://assets.mixkit.co/sfx/preview/mixkit-classic-click-1117.mp3',
  click2: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
  click3: 'https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3',
  click4: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3',
  click5: 'https://assets.mixkit.co/sfx/preview/mixkit-light-button-2580.mp3',
  click6: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3',
  minimize: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3',
  maximize: 'https://assets.mixkit.co/sfx/preview/mixkit-futuristic-robotic-fast-sweep-171.mp3',
  close: 'https://assets.mixkit.co/sfx/preview/mixkit-pebbles-click-1128.mp3',
  background: 'https://www.youtube.com/watch?v=H5v5DJ7Bzq0'
};

// Pre-cargar los sonidos
const audioElements: Record<string, HTMLAudioElement> = {};

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);

  // Inicializar los sonidos
  useEffect(() => {
    // Crear elementos de audio para cada sonido
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio();
      audio.volume = volume;
      
      if (key === 'background') {
        audio.loop = true;
        audio.src = 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3';
        // Intentamos reproducir automáticamente
        if (!isMuted) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Autoplay prevented: ", error);
            });
          }
        }
      } else {
        audio.src = url;
      }
      
      audio.preload = 'auto';
      audioElements[key] = audio;
    });
    
    setAudioLoaded(true);
    
    // Limpieza
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
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
    
    Object.values(audioElements).forEach(audio => {
      audio.volume = !isMuted ? 0 : volume;
      
      if (audio === audioElements.background) {
        if (!isMuted) {
          audio.pause();
        } else {
          audio.play().catch(err => console.log("Play prevented: ", err));
        }
      }
    });
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
