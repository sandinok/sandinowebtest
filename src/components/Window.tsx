// src/components/Window.tsx
import React, { useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

// Contenido de las ventanas memoizado para evitar renders innecesarios
const WindowContent = memo(({ id }: { id: string }) => {
  const contentMap: { [key: string]: JSX.Element } = useMemo(() => ({
    portfolio: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Mi Portfolio</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="bg-gradient-to-br from-blue-400/90 to-purple-500/90 h-32 rounded-lg flex items-center justify-center text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              Proyecto {i}
            </div>
          ))}
        </div>
      </div>
    ),
    youtube: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Canal de YouTube</h2>
        <div className="aspect-video bg-gradient-to-br from-red-500/20 to-red-700/30 rounded-lg flex items-center justify-center mb-4 border border-red-500/30">
          <div className="text-gray-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/50 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span>Reproductor de YouTube</span>
          </div>
        </div>
        <p className="text-gray-200">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
      </div>
    ),
    animations: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Animaciones</h2>
        <p className="text-gray-200 mb-4">Explora mis trabajos de animación digital.</p>
        <div className="grid grid-cols-1 gap-4">
          {['purple', 'blue'].map((color, i) => (
            <div 
              key={i}
              className={`bg-gradient-to-r from-${color}-400/80 to-${color === 'purple' ? 'pink' : 'cyan'}-400/80 h-24 rounded-lg flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]`}
            >
              Animación {i + 1}
            </div>
          ))}
        </div>
      </div>
    ),
    inspiration: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Inspiración</h2>
        <p className="text-gray-200 mb-4">Fuentes de inspiración para mis obras.</p>
        <div className="space-y-3">
          {[
            { title: 'Naturaleza', desc: 'Los paisajes dominicanos inspiran mis colores', color: 'green' },
            { title: 'Tecnología', desc: 'La fusión entre lo digital y lo tradicional', color: 'blue' }
          ].map((item, i) => (
            <div 
              key={i}
              className={`border-l-4 border-${item.color}-500/90 pl-4 backdrop-blur-sm bg-${item.color}-500/20 p-3 rounded-r-lg transition-all duration-300 hover:bg-${item.color}-500/30`}
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    about: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Sobre Mí</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              S
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-200 mb-4">
              Soy Sandino, un artista digital y creador de contenido de República Dominicana. 
              Me especializo en crear experiencias visuales inmersivas que combinan arte tradicional con tecnología moderna.
            </p>
            <p className="text-gray-200">
              Mi pasión es llevar la creatividad dominicana al mundo digital, inspirando a otros artistas locales.
            </p>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Contacto</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Tu nombre" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="tu@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Mensaje</label>
            <textarea 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg h-24 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Tu mensaje aquí..."
            ></textarea>
          </div>
          <motion.button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all backdrop-blur-sm w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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

  // Memoizar estilos para evitar recálculos
  const windowStyles = useMemo(() => ({
    zIndex: window.zIndex,
    width: window.isMaximized ? '100vw' : window.size.width,
    height: window.isMaximized ? '100vh' : window.size.height,
    left: window.isMaximized ? 0 : window.position.x,
    top: window.isMaximized ? 0 : window.position.y,
  }), [window.isMaximized, window.position, window.size, window.zIndex]);

  // Memoizar configuración de resizable
  const resizeConfig = useMemo(() => ({
    enable: {
      top: !window.isMaximized,
      right: !window.isMaximized,
      bottom: !window.isMaximized,
      left: !window.isMaximized,
      topRight: !window.isMaximized,
      bottomRight: !window.isMaximized,
      bottomLeft: !window.isMaximized,
      topLeft: !window.isMaximized
    },
    minWidth: 300,
    minHeight: 200,
    size: window.isMaximized ? 
      { width: '100%', height: '100%' } : 
      { width: window.size.width, height: window.size.height }
  }), [window.isMaximized, window.size]);

  if (window.isMinimized) {
    return null;
  }

  return (
    <AnimatePresence>
      <Draggable
        handle=".window-header"
        position={window.isMaximized ? { x: 0, y: 0 } : window.position}
        onStop={(e, data) => {
          if (!window.isMaximized) {
            updateWindowPosition(window.id, { x: data.x, y: data.y });
          }
        }}
        disabled={window.isMaximized}
        nodeRef={nodeRef}
        cancel=".no-drag"
      >
        <motion.div
          ref={nodeRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            mass: 0.5
          }}
          className="fixed"
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
            className="transform-style-3d"
            minWidth={resizeConfig.minWidth}
            minHeight={resizeConfig.minHeight}
            handleClasses={{
              bottomRight: 'no-drag'
            }}
          >
            <div 
              className="rounded-xl h-full flex flex-col overflow-hidden transform-style-3d backface-hidden transition-all duration-200"
              style={{
                background: 'rgba(20, 20, 40, 0.45)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: `
                  0 15px 35px -5px rgba(0, 0, 0, 0.35),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.08)
                `,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transform: 'translateZ(0)'
              }}
            >
              {/* Header optimizado */}
              <div className="window-header px-4 py-3 flex items-center justify-between cursor-move border-b border-white/10 bg-gradient-to-r from-black/25 to-black/15 backdrop-blur-sm">
                <motion.h3 
                  className="font-semibold text-white text-sm truncate max-w-[160px]"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {window.title}
                </motion.h3>
                <div className="flex gap-2">
                  {[
                    { action: () => minimizeWindow(window.id), icon: Minus, color: 'yellow', label: 'Minimizar' },
                    { action: () => maximizeWindow(window.id), icon: Square, color: 'green', label: 'Maximizar' },
                    { action: () => closeWindow(window.id), icon: X, color: 'red', label: 'Cerrar' }
                  ].map((btn, i) => (
                    <motion.button
                      key={i}
                      onClick={btn.action}
                      className={`w-7 h-7 ${btn.color === 'red' ? 'bg-red-500/90 hover:bg-red-600' : btn.color === 'yellow' ? 'bg-yellow-500/90 hover:bg-yellow-600' : 'bg-green-500/90 hover:bg-green-600'} rounded-full flex items-center justify-center transition-colors`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={btn.label}
                    >
                      <btn.icon size={14} className={`${btn.color === 'red' ? 'text-red-900' : btn.color === 'yellow' ? 'text-yellow-900' : 'text-green-900'}`} />
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Content con scroll optimizado */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <WindowContent id={window.id} />
              </div>
            </div>
          </Resizable>
        </motion.div>
      </Draggable>
    </AnimatePresence>
  );
});

// Estilos CSS para scrollbar personalizado (agregar al CSS global)
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
*/
