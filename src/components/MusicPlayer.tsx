// src/components/MusicPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Iniciar muteado para autoplay
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ID del video de YouTube
  const videoId = "H5v5DJ7Bzq0";

  useEffect(() => {
    // Cargar API de YouTube
    if (!window.YT) {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://www.youtube.com/iframe_api';
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!window.YT || playerRef.current) return;
    
    // Crear contenedor oculto
    const playerContainer = document.createElement('div');
    playerContainer.id = 'youtube-player-container';
    Object.assign(playerContainer.style, {
      position: 'fixed',
      top: '-1000px',
      left: '-1000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      pointerEvents: 'none'
    });
    document.body.appendChild(playerContainer);
    
    playerRef.current = new window.YT.Player('youtube-player-container', {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        'autoplay': 1, // Intentar autoplay
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'playsinline': 1,
        'rel': 0,
        'showinfo': 0,
        'mute': 1 // Siempre iniciar muteado para autoplay
      },
      events: {
        'onReady': (event: any) => {
          setPlayerReady(true);
          event.target.setVolume(30);
          
          // Intentar reproducir inmediatamente
          const attemptPlay = () => {
            try {
              event.target.playVideo();
            } catch (error) {
              console.log("Error al iniciar reproducción:", error);
              // Reintentar en 1 segundo
              retryTimeoutRef.current = setTimeout(attemptPlay, 1000);
            }
          };
          
          attemptPlay();
        },
        'onStateChange': (event: any) => {
          if (event.data === 1) {
            setIsPlaying(true);
          } else if (event.data === 2) {
            setIsPlaying(false);
          }
          
          // Loop infinito
          if (event.data === 0) {
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
    } else {
      playerRef.current.playVideo();
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed top-4 right-4 z-50"
    >
      <motion.div
        className="flex items-center gap-2 p-2 rounded-full bg-black/20 backdrop-blur-sm cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
      >
        <div className="relative">
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" />
          )}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/40"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
        
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="p-1 rounded-full hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? (
            <VolumeX size={16} className="text-white" />
          ) : (
            <Volume2 size={16} className="text-white" />
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
