
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundProviderProps {
  children: ReactNode;
}

interface SoundContextProps {
  playSound: (id: string) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
  volume: number;
  sounds: Record<string, HTMLAudioElement>;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSounds must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    const soundMap: Record<string, HTMLAudioElement> = {
      click1: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
      click2: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'),
      click3: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
      click4: new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'),
      click5: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'),
      click6: new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3'),
      ambient: new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b4fca89d.mp3?filename=ambient-piano-logo-165357.mp3'),
    };

    // Pre-load all sounds
    Object.values(soundMap).forEach(audio => {
      audio.load();
      audio.volume = volume;
    });

    setSounds(soundMap);

    // Set up ambient music
    soundMap.ambient.loop = true;
    soundMap.ambient.volume = 0.3;

    // Auto-play ambient music on user interaction
    const handleFirstInteraction = () => {
      soundMap.ambient.play().catch(err => console.log('Audio autoplay failed:', err));
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      Object.values(soundMap).forEach(audio => audio.pause());
    };
  }, []);

  const playSound = (id: string) => {
    if (sounds[id] && !isMuted) {
      // Clone the sound to allow for rapid succession
      const soundClone = sounds[id].cloneNode(true) as HTMLAudioElement;
      soundClone.volume = volume;
      soundClone.play();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    // Update volume for all sounds
    Object.values(sounds).forEach(audio => {
      audio.volume = audio === sounds.ambient ? clampedVolume * 0.6 : clampedVolume;
    });
  };

  const mute = () => {
    setIsMuted(true);
    Object.values(sounds).forEach(audio => {
      audio.muted = true;
    });
  };

  const unmute = () => {
    setIsMuted(false);
    Object.values(sounds).forEach(audio => {
      audio.muted = false;
    });
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        setVolume,
        mute,
        unmute,
        isMuted,
        volume,
        sounds
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
