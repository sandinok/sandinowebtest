// src/components/Window.tsx
import React, { useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

// Contenido de las ventanas memoizado y optimizado con lazy loading para rendimiento
const WindowContent = memo(({ id }: { id: string }) => {
  const contentMap: { [key: string]: JSX.Element } = useMemo(() => ({
    portfolio: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Mi Portfolio</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              className="bg-gradient-to-br from-blue-400/80 to-purple-500/80 h-32 rounded-xl flex items-center justify-center text-white font-semibold backdrop-blur-md transition-all duration-300"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
          className="aspect-video bg-gradient-to-br from-red-500/25 to-red-700/35 rounded-xl flex items-center justify-center border border-red-500/25 backdrop-blur-md"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-gray-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/60 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span>Reproductor de YouTube</span>
          </div>
        </motion.div>
        <p className="text-gray-200">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
      </div>
    ),
    animations: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Animaciones</h2>
        <p className="text-gray-200">Explora mis trabajos de animación digital.</p>
        <div className="grid grid-cols-1 gap-4">
          {['purple', 'blue'].map((color, i) => (
            <motion.div 
              key={i}
              className={`bg-gradient-to-r from-${color}-400/80 to-${color === 'purple' ? 'pink' : 'cyan'}-400/80 h-24 rounded-xl flex items-center justify-center text-white backdrop-blur-md transition-all duration-300`}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
        <p className="text-gray-200">Fuentes de inspiración para mis obras.</p>
        <div className="space-y-3">
          {[
            { title: 'Naturaleza', desc: 'Los paisajes dominicanos inspiran mis colores', color: 'green' },
            { title: 'Tecnología', desc: 'La fusión entre lo digital y lo tradicional', color: 'blue' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className={`border-l-4 border-${item.color}-500/90 pl-4 backdrop-blur-md bg-${item.color}-500/25 p-3 rounded-r-lg transition-all duration-300`}
              whileHover={{ x: 4, backgroundColor: `rgba(0,255,0,0.3)` }} // Ajuste dinámico para color
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.desc}</p>
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
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              S
            </div>
          </motion.div>
          <div className="md:w-2/3 text-gray-200 space-y-4">
            <p>
              Soy Sandino, un artista digital y creador de contenido de República Dominicana. 
              Me especializo en crear experiencias visuales inmersivas que combinan arte tradicional con tecnología moderna.
            </p>
            <p>
              Mi pasión es llevar la creatividad dominicana al mundo digital, inspirando a otros artistas locales.
            </p>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Contacto</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" 
              placeholder="Tu nombre" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" 
              placeholder="tu@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Mensaje</label>
            <textarea 
              className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white rounded-lg h-24 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" 
              placeholder="Tu mensaje aquí..."
            ></textarea>
          </div>
          <motion.button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg w-full backdrop-blur-md transition-all duration-200"
            whileHover={{ scale: 1.03, backgroundPosition: "right center" }}
            whileTap={{ scale: 0.97 }}
            style={{ backgroundSize: "200% auto" }}
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

  // Memoizar estilos con optimización para fluidez
  const windowStyles = useMemo(() => ({
    zIndex: window.zIndex,
    width: window.isMaximized ? '100vw' : `${window.size.width}px`,
    height: window.isMaximized ? '100vh' : `${window.size.height}px`,
    left: window.isMaximized ? 0 : window.position.x,
    top: window.isMaximized ? 0 : window.position.y,
  }), [window.isMaximized, window.position.x, window.position.y, window.size.width, window.size.height, window.zIndex]);

  // Memoizar config de resizable para evitar re-renders
  const resizeConfig = useMemo(() => ({
    enable: window.isMaximized ? false : {
      top: true, right: true, bottom: true, left: true,
      topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
    },
    minWidth: 320,
    minHeight: 240,
  }), [window.isMaximized]);

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
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
          className="fixed rounded-2xl overflow-hidden"
          style={windowStyles}
          onClick={() => bringToFront(window.id)}
        >
          <Resizable
            ref={resizableRef}
            size={{ width: '100%', height: '100%' }}
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
          >
            <div 
              className="h-full flex flex-col overflow-hidden"
              style={{
                background: 'rgba(20, 20, 40, 0.4)',
                backdropFilter: 'blur(24px) saturate(200%)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 0 rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              {/* Header fluido con gradiente animado */}
              <div className="window-header px-4 py-3 flex items-center justify-between cursor-move border-b border-white/8 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-md">
                <motion.h3 
                  className="font-semibold text-white text-sm truncate max-w-[200px]"
                  whileHover={{ x: 3, color: "#cyan" }}
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${btn.color === 'red' ? 'bg-red-500/80' : btn.color === 'yellow' ? 'bg-yellow-500/80' : 'bg-green-500/80'}`}
                      whileHover={{ scale: 1.15, boxShadow: `0 0 8px ${btn.color}-300/50` }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={btn.label}
                    >
                      <btn.icon size={14} className={`text-${btn.color}-900`} />
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Contenido con scroll ultra fluido */}
              <div className="flex-1 overflow-auto custom-scrollbar p-2">
                <WindowContent id={window.id} />
              </div>
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
