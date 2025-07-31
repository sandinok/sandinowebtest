// src/components/MusicPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Usar un proxy para evitar restricciones de CORS
  const musicUrl = "https://cors-anywhere.herokuapp.com/https://www.youtube.com/watch?v=H5v5DJ7Bzq0";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setupAudio = () => {
      audio.volume = volume;
      
      // Intentar autoplay con políticas modernas
      const attemptPlay = () => {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Silenciosamente fallar si autoplay está bloqueado
            console.log("Autoplay bloqueado, haz clic en el reproductor para iniciar");
          });
      };

      // Iniciar carga y posible reproducción
      setTimeout(attemptPlay, 1000);
    };

    // Setup inicial
    setupAudio();

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Playback failed:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src={musicUrl} type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Music Player Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          delay: 2.5,
          duration: 0.7,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.div 
          className="relative overflow-hidden rounded-2xl cursor-pointer backdrop-blur-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          whileHover={{ 
            y: -2,
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `
          }}
          onClick={togglePlay}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-3 p-3">
            {/* Visualizer Icon */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-2 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                {isPlaying ? (
                  <Pause size={16} className="text-emerald-100" />
                ) : (
                  <Play size={16} className="text-emerald-100 ml-0.5" />
                )}
              </div>
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
            
            {/* Audio Visualizer */}
            <div className="flex gap-1 items-end h-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-emerald-300 to-cyan-300"
                  animate={isPlaying ? { 
                    height: [4, 12, 6, 10, 4],
                  } : { height: 4 }}
                  transition={{
                    duration: 1.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted ? (
                  <VolumeX size={14} className="text-white" />
                ) : (
                  <Volume2 size={14} className="text-white" />
                )}
              </motion.button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                className="w-16 h-1.5 bg-white/20 rounded-full outline-none appearance-none slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>

          {/* Glass Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.3) 30%, 
                  transparent 70%
                )
              `,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Custom Styles for Slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};
