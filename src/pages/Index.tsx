
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
    // Simular tiempo de carga para assets pesados
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
                {/* Fondo del cielo */}
                <SkyBackground />
                
                {/* Sistema de partículas multicapa */}
                <ParticleSystem />
                
                {/* Título principal */}
                <MainTitle />
                
                {/* Dock principal */}
                <GlassDock />
                
                {/* Sistema de olas 3D */}
                <WaveSystem />
                
                {/* Gestor de ventanas */}
                <WindowManager />
                
                {/* Reproductor de música automático */}
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
