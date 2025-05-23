
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Intentar reproducir automáticamente
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.4; // Set initial volume to 40%
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay bloqueado por el navegador:', error);
          setIsPlaying(false);
        }
      }
    };

    // Agregar event listener para interacción del usuario
    const handleUserInteraction = () => {
      attemptAutoplay();
      // No removemos los eventos para seguir intentando reproducir
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <>
      {/* Audio element invisible */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="https://dl.dropboxusercontent.com/s/tu405sbi48pzdzh/lofi-vibes-143175.mp3" type="audio/mpeg" />
        {/* Fallback */}
        <source src="https://www.soundjay.com/misc/sounds/magic-chime-02.mp3" type="audio/mpeg" />
      </audio>

      {/* Indicador visual mejorado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 1 : 0 }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
          whileHover={{ scale: 1.05 }}
          animate={{
            boxShadow: [
              '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Music size={16} className="text-blue-300" />
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-blue-300 to-purple-300 rounded-full"
                animate={{ 
                  height: [4, 12, 8, 10, 4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          <span className="text-xs text-blue-200 font-medium ml-1">Ambient Music</span>
        </motion.div>
      </motion.div>
    </>
  );
};
