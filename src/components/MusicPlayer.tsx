
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

  // URL de la música convertida (necesitarás convertir el video de YouTube a MP3)
  const musicUrl = "https://www.soundjay.com/misc/sounds/magic-chime-02.wav"; // Placeholder - reemplazar con tu música

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
    };

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      // Auto-replay para loop
      setTimeout(() => {
        audio.play().then(() => setIsPlaying(true)).catch(console.log);
      }, 1000);
    };
    
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleLoadedData);

    // Auto-start con delay para mejor UX
    setTimeout(() => {
      if (isLoaded && audio.readyState >= 3) {
        audio.play().then(() => setIsPlaying(true)).catch(console.log);
      }
    }, 3000);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleLoadedData);
    };
  }, [isLoaded]);

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
      console.log('Play prevented:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
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
        Your browser does not support the audio element.
      </audio>

      {/* Compact Music Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.div 
          className="relative overflow-hidden rounded-2xl cursor-pointer backdrop-blur-md"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(30px) saturate(200%)',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: `
              0 16px 50px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          layout
        >
          <div className="flex items-center gap-3 p-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Music size={20} className="text-emerald-100" />
              {isPlaying && (
                <motion.div
                  className="absolute -inset-1 bg-emerald-400/30 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="compact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-emerald-300 to-cyan-300 rounded-full"
                        animate={isPlaying ? { 
                          height: [4, 16, 8, 12, 4],
                        } : { height: 4 }}
                        transition={{
                          duration: 1.8,
                          repeat: isPlaying ? Infinity : 0,
                          delay: i * 0.15,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-emerald-100 font-medium">
                    {isLoaded ? (isPlaying ? 'Playing' : 'Paused') : 'Loading...'}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-3 min-w-[250px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Frutiger Aero</p>
                      <p className="text-xs text-emerald-200">Background Music</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={togglePlay}
                      disabled={!isLoaded}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </motion.button>
                    
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    
                    <motion.button
                      onClick={toggleMute}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 size={12} className="text-emerald-200" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1 bg-white/20 rounded-full outline-none slider"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-emerald-200">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Glass reflection */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.2) 30%, 
                  transparent 70%
                )
              `,
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
};
