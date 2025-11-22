import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface SoundContextType {
  playSound: (soundName: 'click' | 'open' | 'hover' | 'success') => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  // URLs de sonidos (puedes cambiarlos por tus archivos locales en /public)
  const soundUrls = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    open: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    hover: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  };

  // Inicializar AudioContext con interacción del usuario (Vital para evitar errores de navegador)
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        loadSounds();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const loadSounds = async () => {
      if (!audioContextRef.current) return;

      for (const [name, url] of Object.entries(soundUrls)) {
        try {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          buffersRef.current.set(name, audioBuffer);
        } catch (e) {
          console.warn(`Error loading sound ${name}:`, e);
        }
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playSound = (soundName: keyof typeof soundUrls) => {
    if (isMuted || !audioContextRef.current) return;

    const buffer = buffersRef.current.get(soundName);
    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;

      // Gain Node para controlar volumen
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0.15; // Volumen suave (15%)

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSounds must be used within a SoundProvider');
  return context;
};