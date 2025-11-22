import React from 'react';
import { motion } from 'framer-motion';
import { GlassDock } from '../components/GlassDock';
import { OceanBackground } from '../components/OceanBackground';
import { WindowManager } from '../components/WindowManager';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';

const Index = () => {
  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen w-full overflow-hidden selection:bg-white/20">

          {/* 1. Fondo 3D Optimizado */}
          <OceanBackground />

          {/* 2. Contenido Principal (Gestor de Ventanas) */}
          <main className="relative z-10 h-screen w-screen overflow-hidden">
            <WindowManager />

            {/* Título Principal (Opcional, si quieres que desaparezca al abrir ventanas) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1 }}
              className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none"
            >
              <h1 className="text-white/30 text-sm font-light tracking-[0.5em] uppercase backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
                Sandino OS v2.0
              </h1>
            </motion.div>
          </main>

          {/* 3. Dock Flotante (Siempre visible encima) */}
          <GlassDock />

        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;
