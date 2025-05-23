
import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SkyBackground } from '../components/SkyBackground';
import { ParticleSystem } from '../components/ParticleSystem';
import { WaveSystem } from '../components/WaveSystem';
import { MainTitle } from '../components/MainTitle';
import { GlassDock } from '../components/GlassDock';
import { WindowManager } from '../components/WindowManager';
import { MusicPlayer } from '../components/MusicPlayer';
import { LoadingScreen } from '../components/LoadingScreen';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time for heavy assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            {!isLoaded ? (
              <LoadingScreen key="loading" />
            ) : (
              <div key="main" className="relative min-h-screen">
                {/* Sky background */}
                <SkyBackground />
                
                {/* Multi-layer particle system */}
                <ParticleSystem />
                
                {/* Main title */}
                <MainTitle />
                
                {/* Main dock */}
                <GlassDock />
                
                {/* 3D wave system */}
                <WaveSystem />
                
                {/* Window manager */}
                <WindowManager />
                
                {/* Automatic music player */}
                <MusicPlayer />
              </div>
            )}
          </AnimatePresence>
        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;
