// src/pages/Index.tsx
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SkyBackground } from '../components/SkyBackground';
import { MainTitle } from '../components/MainTitle';
import { GlassDock } from '../components/GlassDock';
import { WindowManager } from '../components/WindowManager';
import { MusicPlayer } from '../components/MusicPlayer';
import { LoadingScreen } from '../components/LoadingScreen';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';

// Optional fallback while Suspense resolves any lazy components (kept minimal)
const Fallback: React.FC = () => <div className="fixed inset-0" aria-hidden />;

const Index: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate controlled loading to show the loading screen briefly, then release UI.
  const simulateLoading = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 12 + Math.random() * 14; // faster ramp
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // small grace to ensure first paints are ready
        setTimeout(() => setIsLoaded(true), 200);
      }
      setLoadingProgress(progress);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = simulateLoading();

    // Optionally warm up non-critical chunks in background (commented; enable if needed)
    // const warmup = async () => {
    //   await Promise.allSettled([
    //     import('../components/WindowManager'),
    //     import('../components/MusicPlayer'),
    //   ]);
    // };
    // warmup();

    return cleanup;
  }, [simulateLoading]);

  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-emerald-900">
          <AnimatePresence mode="wait">
            {!isLoaded ? (
              <LoadingScreen key="loading" progress={loadingProgress} />
            ) : (
              <div key="main" className="relative min-h-screen">
                {/* Background (WebGL) */}
                <SkyBackground />

                {/* Particles (Canvas2D), visually balanced for sky-dawn */}
                <ParticleSystem />

                {/* Foreground UI */}
                <Suspense fallback={<Fallback />}>
                  <MainTitle />
                  <GlassDock />
                  <WindowManager />
                  <MusicPlayer />
                </Suspense>
              </div>
            )}
          </AnimatePresence>
        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;
