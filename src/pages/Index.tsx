import React from 'react';
// Importamos los componentes con sus NUEVOS nombres
import { GlassDock } from '../components/GlassDock';
import { CityBackground } from '../components/CityBackground';
import { WindowManager } from '../components/WindowManager';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';
import { MainTitle } from '../components/MainTitle';
import { RetroMediaPlayer } from '../components/RetroMediaPlayer';

const Index = () => {
  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen w-full overflow-hidden selection:bg-[#ff00de]/30">

          {/* Fondo de Ciudad Synthwave */}
          <CityBackground />

          <main className="relative z-10 h-screen w-screen overflow-hidden">
            <MainTitle />

            {/* Reproductor Flotante (Arriba Derecha) */}
            <div className="absolute top-6 right-6 z-50">
              <RetroMediaPlayer />
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