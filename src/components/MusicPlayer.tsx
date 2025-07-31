// src/components/MusicPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Intentar cargar YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  // ID del video de YouTube
  const videoId = "H5v5DJ7Bzq0";

  // Cargar API de YouTube si no está disponible
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!window.YT || playerRef.current) return;
    
    // Crear contenedor oculto para el reproductor
    const playerContainer = document.createElement('div');
    playerContainer.id = 'youtube-player-container';
    playerContainer.style.position = 'absolute';
    playerContainer.style.top = '-1000px';
    playerContainer.style.left = '-1000px';
    playerContainer.style.width = '1px';
    playerContainer.style.height = '1px';
    playerContainer.style.overflow = 'hidden';
    document.body.appendChild(playerContainer);
    
    playerRef.current = new window.YT.Player('youtube-player-container', {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        'autoplay': 0,
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'playsinline': 1,
        'rel': 0,
        'showinfo': 0,
        'mute': 1 // Iniciar muteado
      },
      events: {
        'onReady': (event: any) => {
          setPlayerReady(true);
          event.target.setVolume(volume * 100);
          // Intentar autoplay con mute
          event.target.playVideo().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            console.log("Autoplay bloqueado. Haz clic en el reproductor para iniciar.");
          });
        },
        'onStateChange': (event: any) => {
          // 1 = playing, 2 = paused
          if (event.data === 1) {
            setIsPlaying(true);
          } else if (event.data === 2) {
            setIsPlaying(false);
          }
          
          // Loop infinito
          if (event.data === 0) { // Video terminado
            event.target.playVideo();
          }
        }
      }
    });
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(newVolume * 100);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  return (
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
      className="fixed top-5 right-5 z-50"
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
  );
};
