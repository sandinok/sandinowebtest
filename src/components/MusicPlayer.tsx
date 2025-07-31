// src/components/MusicPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // URL de música de dominio público (reemplazar con tu música)
  const musicUrl = "https://www.soundjay.com/misc/sounds/magic-chime-02.wav"; // Placeholder

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration || 0);
    };

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };
    
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleLoadedData);

    // Intentar autoplay con políticas modernas
    const attemptPlay = () => {
      if (audio.readyState >= 2) {
        audio.volume = volume;
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          // Silenciosamente fallar si autoplay está bloqueado
        });
      } else {
        setTimeout(attemptPlay, 500);
      }
    };

    // Iniciar carga y posible reproducción
    setTimeout(attemptPlay, 1000);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleLoadedData);
    };
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || !isLoaded) return;

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

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
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
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.25) 0%, 
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
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
          onClick={() => setIsExpanded(!isExpanded)}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-3 p-4">
            {/* Visualizer Icon */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-2 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                <Music size={18} className="text-emerald-100" />
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
            
            {/* Content Area */}
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="compact"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 min-w-[120px]"
                >
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
                  
                  {/* Status Text */}
                  <span className="text-xs text-emerald-100 font-medium truncate">
                    {isLoaded ? (isPlaying ? 'Reproduciendo' : 'Pausado') : 'Cargando...'}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3 min-w-[240px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Track Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Frutiger Aero</p>
                      <p className="text-xs text-emerald-200/80">Música de fondo</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-emerald-400"
                          animate={isPlaying ? { 
                            opacity: [0.4, 1, 0.4],
                          } : { opacity: 0.4 }}
                          transition={{
                            duration: 1.5,
                            repeat: isPlaying ? Infinity : 0,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={togglePlay}
                      disabled={!isLoaded}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {isPlaying ? (
                        <Pause size={16} className="text-white" />
                      ) : (
                        <Play size={16} className="text-white ml-0.5" />
                      )}
                    </motion.button>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    
                    {/* Mute Button */}
                    <motion.button
                      onClick={toggleMute}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {isMuted ? (
                        <VolumeX size={14} className="text-white" />
                      ) : (
                        <Volume2 size={14} className="text-white" />
                      )}
                    </motion.button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Volume2 size={12} className="text-emerald-200 flex-shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1.5 bg-white/20 rounded-full outline-none appearance-none slider"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                  </div>
                  
                  {/* Time Display */}
                  <div className="flex items-center justify-between text-xs text-emerald-200/80 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
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
