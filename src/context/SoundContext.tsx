// src/context/SoundContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

type SoundContextType = {
  playSound: (sound: string) => void;
  stopSound: (sound: string) => void;
  stopAllSounds: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  volume: number;
  isInitialized: boolean;
  preloadSounds: () => void;
};

const SoundContext = createContext<SoundContextType>({
  playSound: () => {},
  stopSound: () => {},
  stopAllSounds: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  isMuted: false,
  volume: 0.2,
  isInitialized: false,
  preloadSounds: () => {}
});

export const useSounds = () => useContext(SoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

type ActiveTone = {
  osc: OscillatorNode;
  gain: GainNode;
  stopAt: number;
};

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.2);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeRefs = useRef<Map<string, ActiveTone>>(new Map());

  // Lazily create or resume the AudioContext
  const ensureCtx = useCallback(async () => {
    if (!audioCtxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
      // master gain for overall control + headroom
      const g = audioCtxRef.current.createGain();
      g.gain.value = 0.9;
      g.connect(audioCtxRef.current.destination);
      masterGainRef.current = g;
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const envelope = (gain: GainNode, ctx: AudioContext, durMs: number, vol: number) => {
    const now = ctx.currentTime;
    const dur = Math.max(0.06, durMs / 1000);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + Math.min(0.02, dur * 0.2)); // soft attack
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * 0.001), now + dur); // smooth release
  };

  // Heaven-like soft chord/tones per action (WebAudio, no assets)
  // Arrays = play quick airy chord; single number = tone
  const BANK: Record<string, number[] | number> = {
    dock: [261.63, 329.63, 392.0],      // Cmaj triad
    click1: [261.63, 329.63, 392.0],
    click2: [293.66, 369.99, 440.0],    // D F# A
    click3: [246.94, 329.63, 392.0],    // B♭ feel
    click4: [277.18, 349.23, 415.30],
    click5: [311.13, 392.00, 466.16],
    click6: [233.08, 311.13, 392.00],
    minimize: [392.0, 329.63, 261.63],  // gentle down
    maximize: [261.63, 329.63, 392.0],  // gentle up
    close: [329.63, 293.66, 246.94],    // soft resolve
  };

  const DURATIONS: Record<string, number> = {
    dock: 120,
    click1: 110,
    click2: 120,
    click3: 110,
    click4: 120,
    click5: 110,
    click6: 120,
    minimize: 140,
    maximize: 150,
    close: 140,
  };

  const playSound = useCallback(async (sound: string) => {
    if (isMuted) return;
    const ctx = await ensureCtx();
    if (!ctx) return;

    const freqsRaw = BANK[sound] ?? 880;
    const freqs = Array.isArray(freqsRaw) ? freqsRaw : [freqsRaw];
    const dur = DURATIONS[sound] ?? 120;

    // Stop previous tone for this key
    const existing = activeRefs.current.get(sound);
    if (existing) {
      try { existing.osc.stop(); } catch {}
      existing.gain.disconnect();
      activeRefs.current.delete(sound);
    }

    const groupGain = ctx.createGain();
    groupGain.gain.value = 0;
    groupGain.connect(masterGainRef.current ?? ctx.destination);

    // Build a soft airy chord with a faint shimmer (octave) at very low level
   freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 1 / Math.max(3, freqs.length + 1); // balance voices
      osc.connect(g);
      g.connect(groupGain);
      osc.start();
      const stopAt = ctx.currentTime + Math.max(0.06, dur / 1000) + 0.02;
      osc.stop(stopAt);
    });
    // shimmer voice (very soft, one octave up)
    const shimmer = ctx.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.value = (Array.isArray(freqsRaw) ? freqs[0] : freqsRaw) * 2;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.08; // very subtle
    shimmer.connect(shimmerGain);
    shimmerGain.connect(groupGain);
    shimmer.start();
    shimmer.stop(ctx.currentTime + Math.max(0.06, dur / 1000) + 0.02);

    // Envelope over the group
    envelope(groupGain, ctx, dur, volume);

    // Track one node for cleanup
    const dummyOsc = ctx.createOscillator();
    dummyOsc.connect(groupGain);
    const stopAt = ctx.currentTime + Math.max(0.06, dur / 1000) + 0.02;
    dummyOsc.start();
    dummyOsc.stop(stopAt);
    activeRefs.current.set(sound, { osc: dummyOsc, gain: groupGain, stopAt });
    dummyOsc.onended = () => {
      try { groupGain.disconnect(); } catch {}
      activeRefs.current.delete(sound);
    };
  }, [ensureCtx, isMuted, volume]);

  const stopSound = useCallback((sound: string) => {
    const t = activeRefs.current.get(sound);
    if (!t) return;
    try { t.osc.stop(); } catch {}
    try { t.gain.disconnect(); } catch {}
    activeRefs.current.delete(sound);
  }, []);

  const stopAllSounds = useCallback(() => {
    activeRefs.current.forEach(({ osc, gain }) => {
      try { osc.stop(); } catch {}
      try { gain.disconnect(); } catch {}
    });
    activeRefs.current.clear();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleSetVolume = useCallback((newVolume: number) => {
    const v = Math.max(0, Math.min(1, newVolume));
    setVolume(v);
    const ctx = audioCtxRef.current;
    if (ctx && masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(Math.min(1, v + 0.1), ctx.currentTime, 0.02);
    }
  }, []);

  // Initialize on first interaction to unlock audio on iOS/Safari
  useEffect(() => {
    const activate = async () => {
      if (!isInitialized) {
        await ensureCtx();
        setIsInitialized(true);
      }
    };
    const events: Array<keyof DocumentEventMap> = ['click', 'keydown', 'touchstart'];
    events.forEach(e => document.addEventListener(e, activate, { once: true, passive: true as any }));
    return () => events.forEach(e => document.removeEventListener(e, activate));
  }, [ensureCtx, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
      masterGainRef.current = null;
    };
  }, [stopAllSounds]);

  const preloadSounds = useCallback(() => {
    // No-op with WebAudio tones; kept to satisfy API
    if (!isInitialized) setIsInitialized(true);
  }, [isInitialized]);

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        stopAllSounds,
        toggleMute,
        setVolume: handleSetVolume,
        isMuted,
        volume,
        isInitialized,
        preloadSounds
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
