import React from 'react';
import { GlassDock } from '../components/GlassDock';
import { Background } from '../components/Background'; // Nombre genérico
import { WindowManager } from '../components/WindowManager';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';
import { MainTitle } from '../components/MainTitle';

const Index = () => {
  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen w-full overflow-hidden">
          
          {/* Fondo Genérico */}
          <Background />

          <main className="relative z-10 h-screen w-screen overflow-hidden">
            <MainTitle />
            <WindowManager />
          </main>

          <GlassDock />

        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;