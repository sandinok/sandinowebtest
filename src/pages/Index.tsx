// src/pages/Index.tsx
import React, { useEffect, useState, useCallback } from 'react';
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
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simular carga real de recursos
  const simulateLoading = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 300);
      }
      setLoadingProgress(progress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Iniciar simulación de carga
    const cleanup = simulateLoading();
    
    // Pre-cargar componentes pesados
    const preloadComponents = async () => {
      // Aquí podrías precargar assets críticos
      // await Promise.all([
      //   import('../components/WaveSystem'),
      //   import('../components/ParticleSystem')
      // ]);
    };
    
    preloadComponents().catch(console.error);
    
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
                {/* Sky background - capa más baja */}
                <SkyBackground />
                
                {/* Efecto de olas 3D - detrás de todo excepto fondo */}
                <WaveSystem />
                
                {/* Sistema de partículas - capa media */}
                <ParticleSystem />
                
                {/* Título principal - capa superior */}
                <MainTitle />
                
                {/* Dock de aplicaciones - capa superior */}
                <GlassDock />
                
                {/* Gestor de ventanas - capa superior */}
                <WindowManager />
                
                {/* Reproductor de música - capa flotante */}
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
