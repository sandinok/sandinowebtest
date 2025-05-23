
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

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

export const Window: React.FC<WindowProps> = ({ window }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, bringToFront, updateWindowPosition, updateWindowSize } = useWindows();
  const nodeRef = useRef(null);

  const getWindowContent = (id: string) => {
    const contentMap: { [key: string]: JSX.Element } = {
      portfolio: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Mi Portfolio</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-400/90 to-purple-500/90 h-32 rounded-lg flex items-center justify-center text-white font-semibold backdrop-blur-sm">
              Proyecto 1
            </div>
            <div className="bg-gradient-to-br from-green-400/90 to-blue-500/90 h-32 rounded-lg flex items-center justify-center text-white font-semibold backdrop-blur-sm">
              Proyecto 2
            </div>
            <div className="bg-gradient-to-br from-pink-400/90 to-red-500/90 h-32 rounded-lg flex items-center justify-center text-white font-semibold backdrop-blur-sm">
              Proyecto 3
            </div>
            <div className="bg-gradient-to-br from-yellow-400/90 to-orange-500/90 h-32 rounded-lg flex items-center justify-center text-white font-semibold backdrop-blur-sm">
              Proyecto 4
            </div>
          </div>
        </div>
      ),
      youtube: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Canal de YouTube</h2>
          <div className="aspect-video bg-gray-800/60 rounded-lg flex items-center justify-center mb-4">
            <div className="text-gray-200">Video Preview</div>
          </div>
          <p className="text-gray-200">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
        </div>
      ),
      animations: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Animaciones</h2>
          <p className="text-gray-200 mb-4">Explora mis trabajos de animación digital.</p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-purple-400/80 to-pink-400/80 h-24 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
              Animación 1
            </div>
            <div className="bg-gradient-to-r from-blue-400/80 to-cyan-400/80 h-24 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
              Animación 2
            </div>
          </div>
        </div>
      ),
      inspiration: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Inspiración</h2>
          <p className="text-gray-200 mb-4">Fuentes de inspiración para mis obras.</p>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500/90 pl-4 backdrop-blur-sm bg-green-500/20 p-2 rounded-r-lg">
              <h3 className="font-semibold text-white">Naturaleza</h3>
              <p className="text-sm text-gray-200">Los paisajes dominicanos inspiran mis colores</p>
            </div>
            <div className="border-l-4 border-blue-500/90 pl-4 backdrop-blur-sm bg-blue-500/20 p-2 rounded-r-lg">
              <h3 className="font-semibold text-white">Tecnología</h3>
              <p className="text-sm text-gray-200">La fusión entre lo digital y lo tradicional</p>
            </div>
          </div>
        </div>
      ),
      about: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Sobre Mí</h2>
          <p className="text-gray-200 mb-4">
            Soy Sandino, un artista digital y creador de contenido de República Dominicana. 
            Me especializo en crear experiencias visuales inmersivas que combinan arte tradicional con tecnología moderna.
          </p>
          <p className="text-gray-200">
            Mi pasión es llevar la creatividad dominicana al mundo digital, inspirando a otros artistas locales.
          </p>
        </div>
      ),
      contact: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 bg-white/15 border border-white/30 text-white rounded-lg backdrop-blur-sm" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Mensaje</label>
              <textarea className="w-full px-3 py-2 bg-white/15 border border-white/30 text-white rounded-lg h-24 backdrop-blur-sm" placeholder="Tu mensaje aquí..."></textarea>
            </div>
            <button className="bg-blue-500/90 text-white px-4 py-2 rounded-lg hover:bg-blue-600/90 transition-colors backdrop-blur-sm">
              Enviar
            </button>
          </div>
        </div>
      ),
    };

    return contentMap[id] || <div className="p-6 text-white">Contenido no encontrado</div>;
  };

  if (window.isMinimized) {
    return null;
  }

  return (
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
    >
      <motion.div
        ref={nodeRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25 
        }}
        className="fixed"
        style={{ 
          zIndex: window.zIndex,
          width: window.isMaximized ? '100vw' : 'auto',
          height: window.isMaximized ? '100vh' : 'auto',
          left: window.isMaximized ? 0 : window.position.x,
          top: window.isMaximized ? 0 : window.position.y,
        }}
        onClick={() => bringToFront(window.id)}
      >
        <Resizable
          size={window.isMaximized ? 
            { width: '100%', height: '100%' } : 
            { width: window.size.width, height: window.size.height }
          }
          onResizeStop={(e, direction, ref, d) => {
            if (!window.isMaximized) {
              updateWindowSize(window.id, { 
                width: window.size.width + d.width, 
                height: window.size.height + d.height 
              });
            }
          }}
          enable={{
            top: !window.isMaximized,
            right: !window.isMaximized,
            bottom: !window.isMaximized,
            left: !window.isMaximized,
            topRight: !window.isMaximized,
            bottomRight: !window.isMaximized,
            bottomLeft: !window.isMaximized,
            topLeft: !window.isMaximized
          }}
          className="transform-style-3d"
          minWidth={300}
          minHeight={200}
        >
          <div 
            className="rounded-xl h-full flex flex-col overflow-hidden transform-style-3d backface-hidden"
            style={{
              background: 'rgba(20, 20, 40, 0.4)',
              backdropFilter: 'blur(25px) saturate(180%)',
              boxShadow: `
                0 15px 30px -5px rgba(0, 0, 0, 0.4),
                0 10px 15px -5px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
              `,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              transform: 'translateZ(0)'
            }}
          >
            {/* Header */}
            <div className="window-header px-4 py-3 flex items-center justify-between cursor-move border-b border-white/15 bg-gradient-to-r from-black/20 to-black/10">
              <motion.h3 
                className="font-semibold text-white"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {window.title}
              </motion.h3>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => minimizeWindow(window.id)}
                  className="w-3 h-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={8} className="text-yellow-700" />
                </motion.button>
                <motion.button
                  onClick={() => maximizeWindow(window.id)}
                  className="w-3 h-3 bg-green-400 rounded-full hover:bg-green-500 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Square size={8} className="text-green-700" />
                </motion.button>
                <motion.button
                  onClick={() => closeWindow(window.id)}
                  className="w-3 h-3 bg-red-400 rounded-full hover:bg-red-500 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={8} className="text-red-700" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {getWindowContent(window.id)}
            </div>
          </div>
        </Resizable>
      </motion.div>
    </Draggable>
  );
};
