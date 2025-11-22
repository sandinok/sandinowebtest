import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Disc3, Minimize2, Maximize2, Music } from 'lucide-react';

export const RetroMediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // En producción, aquí usarías un <audio> real o la API de YouTube.
  // Simularemos la reproducción visualmente.

  return (
    <>
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="full-player"
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="
              relative w-80 p-4 rounded-3xl
              ios-liquid-glass border border-white/20
              flex flex-col gap-4 shadow-[0_0_40px_rgba(255,0,222,0.2)]
            "
          >
            {/* Header: Botón Minimizar */}
            <div className="flex justify-between items-center text-white/50">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#ff00de]">
                <Music size={12} /> City Pop Radio
              </div>
              <button 
                onClick={() => setIsMinimized(true)}
                className="hover:text-white transition-colors"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            {/* Diseño de Cassette Visual */}
            <div className="relative h-32 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center gap-6">
              {/* Rueda Izquierda */}
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="absolute w-full h-1 bg-white/20" />
                <div className="absolute w-1 h-full bg-white/20" />
              </motion.div>
              
              {/* Rueda Derecha */}
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="absolute w-full h-1 bg-white/20" />
                <div className="absolute w-1 h-full bg-white/20" />
              </motion.div>

              {/* Cinta en medio */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/5 rounded-b-xl border-t border-white/10" />
            </div>

            {/* Info Canción */}
            <div className="text-center">
              <h3 className="text-white font-bold text-lg neon-text truncate">Stay With Me</h3>
              <p className="text-white/60 text-sm">Miki Matsubara</p>
            </div>

            {/* Controles */}
            <div className="flex justify-center gap-6 items-center">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-[0_0_20px_white]"
              >
                {isPlaying ? <Pause fill="black" /> : <Play fill="black" className="ml-1" />}
              </button>
            </div>

            {/* Audio Oculto (Simulación con link directo o placeholder) */}
            {isPlaying && (
              <div className="absolute -z-10 opacity-0 pointer-events-none">
                 {/* Aquí iría el iframe de YouTube oculto si quisieras audio real sin backend, 
                     pero los navegadores bloquean autoplay oculto a veces. 
                     Para este demo visual, es una simulación. */}
              </div>
            )}
          </motion.div>
        ) : (
          /* Versión Minimizada (Icono Flotante giratorio) */
          <motion.button
            key="mini-player"
            layoutId="mini-player"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="
              w-14 h-14 rounded-full 
              ios-liquid-glass border border-white/30
              flex items-center justify-center
              shadow-[0_0_20px_#ff00de]
            "
          >
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Disc3 className="text-white" size={24} />
            </motion.div>
            {isPlaying && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#ff00de] rounded-full shadow-[0_0_10px_#ff00de]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};