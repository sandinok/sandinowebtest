import React from 'react';
import { motion } from 'framer-motion';
// Importaciones nombradas (aseguran que coincidan con los exports)
import { GlassDock } from '../components/GlassDock';
import { OceanBackground } from '../components/OceanBackground';
import { WindowManager } from '../components/WindowManager';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';
import { MainTitle } from '../components/MainTitle';
import { MusicPlayer } from '../components/MusicPlayer';

const Index = () => {
  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen w-full overflow-hidden selection:bg-white/20">

          <OceanBackground />

          <main className="relative z-10 h-screen w-screen overflow-hidden">
            <MainTitle />

            <div className="absolute top-8 right-8 z-0 hidden md:block">
              <MusicPlayer />
            </div>

            <WindowManager />
          </main>

          <GlassDock />

        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;