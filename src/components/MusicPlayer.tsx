// src/components/MusicPlayer.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

/*
Lazy-load strategy + Focus Ducking:
- No third-party scripts are loaded at mount. The YouTube Iframe API is only fetched on first user intent (click).
- Player is created on demand in an offscreen 1x1 container.
- Ducking: when the tab/window loses focus or the document gets hidden, volume ramps down to 20%.
  When focus/visibility returns, it ramps back to the base volume. Smooth fade 400ms.
- Proper cleanup on unmount.
*/

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer: React.FC = () => {
  const [apiReady, setApiReady] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const playerRef = useRef<any>(null);
  const containerIdRef = useRef<string>('youtube-player-container');

  // Volume management for ducking
  const baseVolumeRef = useRef<number>(30);   // normal volume when focused (0..100)
  const duckVolumeRef = useRef<number>(6);    // ~20% of base (auto-updated on ready)
  const rampRafRef = useRef<number | null>(null);

  const videoId = 'H5v5DJ7Bzq0';

  const loadApi = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return true;
    }
    return new Promise<boolean>((resolve) => {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]') as HTMLScriptElement | null;
      if (existing) {
        const checkReady = () => {
          if (window.YT && window.YT.Player) {
            setApiReady(true);
            resolve(true);
          } else {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
        resolve(true);
      };
    });
  }, []);

  const rampVolume = useCallback((to: number, ms = 400) => {
    if (!playerRef.current || typeof playerRef.current.getVolume !== 'function') return;
    try {
      const start = playerRef.current.getVolume() ?? baseVolumeRef.current;
      const startTime = performance.now();
      if (rampRafRef.current) cancelAnimationFrame(rampRafRef.current);

      const step = (now: number) => {
        const p = Math.min(1, (now - startTime) / ms);
        const v = Math.round(start + (to - start) * p);
        try {
          playerRef.current.setVolume(v);
        } catch {}
        if (p < 1) {
          rampRafRef.current = requestAnimationFrame(step);
        }
      };
      rampRafRef.current = requestAnimationFrame(step);
    } catch {}
  }, []);

  const ensurePlayer = useCallback(async () => {
    if (playerRef.current) return true;
    const ok = await loadApi();
    if (!ok || !window.YT) return false;

    // Create offscreen container
    if (!document.getElementById(containerIdRef.current)) {
      const div = document.createElement('div');
      div.id = containerIdRef.current;
      Object.assign(div.style, {
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        pointerEvents: 'none',
      });
      document.body.appendChild(div);
    }

    playerRef.current = new window.YT.Player(containerIdRef.current, {
      height: '1',
      width: '1',
      videoId,
      playerVars: {
        autoplay: 1, // attempt autoplay (muted) so it starts instantly
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        mute: 1, // keep muted to satisfy autoplay policies
      },
      events: {
        onReady: (event: any) => {
          setPlayerReady(true);
          try {
            baseVolumeRef.current = 30;
            duckVolumeRef.current = Math.max(0, Math.round(baseVolumeRef.current * 0.2));
            event.target.setVolume(baseVolumeRef.current);
            event.target.playVideo(); // start immediately (muted autoplay)
            setIsPlaying(true);
          } catch {}
        },
        onStateChange: (event: any) => {
          // 1 = playing, 2 = paused, 0 = ended
          if (event.data === 1) setIsPlaying(true);
          else if (event.data === 2) setIsPlaying(false);
          else if (event.data === 0) {
            // Do not loop; keep stopped
            setIsPlaying(false);
          }
        },
      },
    });
    return true;
  }, [loadApi, videoId]);

  const togglePlay = useCallback(async () => {
    const ok = await ensurePlayer();
    if (!ok || !playerRef.current) return;

    if (isPlaying) {
      try { playerRef.current.pauseVideo(); } catch {}
    } else {
      try { playerRef.current.playVideo(); } catch {}
    }
  }, [ensurePlayer, isPlaying]);

  // Ensure API + player are created as soon as possible (for instant autoplay)
  useEffect(() => {
    (async () => {
      try {
        await loadApi();
        await ensurePlayer();
      } catch {}
    })();
  }, [loadApi, ensurePlayer]);

  const toggleMute = useCallback(async () => {
    const ok = await ensurePlayer();
    if (!ok || !playerRef.current || !playerReady) return;

    if (isMuted) {
      try { playerRef.current.unMute(); } catch {}
      setIsMuted(false);
    } else {
      try { playerRef.current.mute(); } catch {}
      setIsMuted(true);
    }
  }, [ensurePlayer, isMuted, playerReady]);

  // Fade-in from muted to base volume when the LoadingScreen finishes
  useEffect(() => {
    const onAppLoaded = () => {
      if (!playerRef.current || !playerReady) return;
      try {
        // Unmute and ramp up smoothly to base volume
        playerRef.current.unMute?.();
        setIsMuted(false);
        rampVolume(baseVolumeRef.current, 700);
      } catch {}
    };
    window.addEventListener('app-loading-done', onAppLoaded as any);
    return () => window.removeEventListener('app-loading-done', onAppLoaded as any);
  }, [playerReady, rampVolume]);

  // Focus/visibility ducking
  useEffect(() => {
    const onVisibility = () => {
      if (!playerRef.current || !playerReady) return;
      if (document.visibilityState === 'hidden') {
        rampVolume(duckVolumeRef.current, 400);
      } else {
        rampVolume(baseVolumeRef.current, 400);
      }
    };
    const onBlur = () => {
      if (!playerRef.current || !playerReady) return;
      rampVolume(duckVolumeRef.current, 400);
    };
    const onFocus = () => {
      if (!playerRef.current || !playerReady) return;
      rampVolume(baseVolumeRef.current, 400);
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      if (rampRafRef.current) cancelAnimationFrame(rampRafRef.current);
    };
  }, [playerReady, rampVolume]);

  useEffect(() => {
    return () => {
      try {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      } catch {}
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      className="fixed top-4 right-4 z-50"
    >
      <motion.div
        className="flex items-center gap-2 p-2 rounded-full bg-black/20 backdrop-blur-sm cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        <div className="relative">
          {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/40"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
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
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
