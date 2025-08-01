// src/components/Window.tsx
import React, { useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

// Contenido de las ventanas ultra-memoizado con optimizaciones para renders mínimos
const WindowContent = memo(({ id }: { id: string }) => {
  const contentMap: { [key: string]: JSX.Element } = useMemo(() => ({
    portfolio: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Mi Portfolio</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-br from-blue-400/80 to-purple-500/80 h-32 rounded-xl flex items-center justify-center text-white font-semibold backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/20"
            >
              Proyecto {i}
            </motion.div>
          ))}
        </div>
      </div>
    ),
    youtube: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Canal de YouTube</h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="aspect-video bg-gradient-to-br from-red-500/25 to-red-700/35 rounded-xl flex items-center justify-center border border-red-500/25 shadow-lg shadow-red-500/10"
        >
          <div className="text-gray-100 flex flex-col items-center">
            <motion.div 
              className="w-20 h-20 bg-red-500/60 rounded-full flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </motion.div>
            <span className="text-lg">Reproductor de YouTube</span>
          </div>
        </motion.div>
        <p className="text-gray-100">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
      </div>
    ),
    animations: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Animaciones</h2>
        <p className="text-gray-100 mb-4">Explora mis trabajos de animación digital.</p>
        <div className="grid grid-cols-1 gap-4">
          {['purple', 'blue'].map((color, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`bg-gradient-to-r from-${color}-400/70 to-${color === 'purple' ? 'pink' : 'cyan'}-400/70 h-24 rounded-xl flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-${color}-500/20`}
            >
              Animación {i + 1}
            </motion.div>
          ))}
        </div>
      </div>
    ),
    inspiration: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Inspiración</h2>
        <p className="text-gray-100 mb-4">Fuentes de inspiración para mis obras.</p>
        <div className="space-y-4">
          {[
            { title: 'Naturaleza', desc: 'Los paisajes dominicanos inspiran mis colores', color: 'green' },
            { title: 'Tecnología', desc: 'La fusión entre lo digital y lo tradicional', color: 'blue' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className={`border-l-4 border-${item.color}-500/80 pl-4 backdrop-blur-md bg-${item.color}-500/15 p-4 rounded-r-xl transition-all duration-300 hover:bg-${item.color}-500/25 hover:shadow-md hover:shadow-${item.color}-500/15`}
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-100">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    about: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Sobre Mí</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div 
            className="md:w-1/3 flex justify-center"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-purple-500/20">
              S
            </div>
          </motion.div>
          <div className="md:w-2/3 space-y-4">
            <p className="text-gray-100">
              Soy Sandino, un artista digital y creador de contenido de República Dominicana. 
              Me especializo en crear experiencias visuales inmersivas que combinan arte tradicional con tecnología moderna.
            </p>
            <p className="text-gray-100">
              Mi pasión es llevar la creatividad dominicana al mundo digital, inspirando a otros artistas locales.
            </p>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Contacto</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Nombre</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300" 
              placeholder="Tu nombre" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300" 
              placeholder="tu@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Mensaje</label>
            <textarea 
              className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl h-32 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300" 
              placeholder="Tu mensaje aquí..."
            ></textarea>
          </div>
          <motion.button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 backdrop-blur-md w-full shadow-md hover:shadow-lg hover:shadow-purple-500/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Enviar Mensaje
          </motion.button>
        </div>
      </div>
    ),
  }), []);

  return contentMap[id] || <div className="p-6 text-white">Contenido no encontrado</div>;
});

interface WindowProps {
  window: {
    id: string;
    title: string;
    isMaximized: boolean;
    isMinimized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
  };
}

export const Window = memo(({ window }: WindowProps) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    bringToFront, 
    updateWindowPosition, 
    updateWindowSize 
  } = useWindows();
  
  const nodeRef = useRef(null);
  const resizableRef = useRef(null);

  // Estilos memoizados con transiciones suaves
  const windowStyles = useMemo(() => ({
    zIndex: window.zIndex,
    width: window.isMaximized ? '100vw' : window.size.width,
    height: window.isMaximized ? '100vh' : window.size.height,
    left: window.isMaximized ? 0 : window.position.x,
    top: window.isMaximized ? 0 : window.position.y,
    transition: 'width 0.3s ease-out, height 0.3s ease-out, left 0.3s ease-out, top 0.3s ease-out',
  }), [window.isMaximized, window.position, window.size, window.zIndex]);

  // Configuración de resizable optimizada
  const resizeConfig = useMemo(() => ({
    enable: !window.isMaximized ? {
      top: true, right: true, bottom: true, left: true,
      topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
    } : false,
    minWidth: 320,
    minHeight: 240,
    size: { width: window.size.width, height: window.size.height }
  }), [window.isMaximized, window.size]);

  if (window.isMinimized) return null;

  return (
    <AnimatePresence>
      <Draggable
        handle=".window-header"
        position={window.isMaximized ? { x: 0, y: 0 } : window.position}
        onStop={(e, data) => !window.isMaximized && updateWindowPosition(window.id, { x: data.x, y: data.y })}
        disabled={window.isMaximized}
        nodeRef={nodeRef}
        cancel=".no-drag"
      >
        <motion.div
          ref={nodeRef}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 100 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            mass: 0.8
          }}
          className="fixed rounded-2xl overflow-hidden shadow-2xl"
          style={windowStyles}
          onClick={() => bringToFront(window.id)}
        >
          <Resizable
            ref={resizableRef}
            size={resizeConfig.size}
            onResizeStop={(e, direction, ref, d) => {
              if (!window.isMaximized) {
                updateWindowSize(window.id, { 
                  width: window.size.width + d.width, 
                  height: window.size.height + d.height 
                });
              }
            }}
            enable={resizeConfig.enable}
            minWidth={resizeConfig.minWidth}
            minHeight={resizeConfig.minHeight}
            handleClasses={{ bottomRight: 'no-drag' }}
            className="h-full flex flex-col bg-[rgba(20,20,40,0.5)] backdrop-blur-2xl border border-white/20"
            style={{
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.15)',
            }}
          >
            {/* Header fluido con hover effects */}
            <div className="window-header px-5 py-3 flex items-center justify-between cursor-move bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-md border-b border-white/15">
              <motion.h3 
                className="font-semibold text-white text-base truncate max-w-[200px]"
                whileHover={{ x: 3, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                {window.title}
              </motion.h3>
              <div className="flex gap-3">
                {[
                  { action: () => minimizeWindow(window.id), icon: Minus, color: 'yellow', label: 'Minimizar' },
                  { action: () => maximizeWindow(window.id), icon: Square, color: 'green', label: 'Maximizar' },
                  { action: () => closeWindow(window.id), icon: X, color: 'red', label: 'Cerrar' }
                ].map((btn, i) => (
                  <motion.button
                    key={i}
                    onClick={btn.action}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${btn.color}-500/80 hover:${btn.color}-600/90`}
                    whileHover={{ scale: 1.15, boxShadow: `0 0 8px ${btn.color}-500/50` }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={btn.label}
                  >
                    <btn.icon size={12} className={`text-${btn.color}-900`} />
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Contenido con scroll ultra-fluido */}
            <div className="flex-1 overflow-auto custom-scrollbar p-1">
              <WindowContent id={window.id} />
            </div>
          </Resizable>
        </motion.div>
      </Draggable>
    </AnimatePresence>
  );
});

// Estilos CSS optimizados para scrollbar (agregar al CSS global para rendimiento)
/*
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) rgba(255,255,255,0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);
  border-radius: 3px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.35);
}
*/
