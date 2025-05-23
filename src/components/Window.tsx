
import React from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';

interface WindowProps {
  window: {
    id: string;
    title: string;
    isMaximized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
  };
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, bringToFront, updateWindowPosition } = useWindows();

  const getWindowContent = (id: string) => {
    const contentMap: { [key: string]: JSX.Element } = {
      portfolio: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mi Portfolio</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              Proyecto 1
            </div>
            <div className="bg-gradient-to-br from-green-400 to-blue-500 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              Proyecto 2
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-red-500 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              Proyecto 3
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              Proyecto 4
            </div>
          </div>
        </div>
      ),
      youtube: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Canal de YouTube</h2>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <div className="text-gray-500">Video Preview</div>
          </div>
          <p className="text-gray-600">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
        </div>
      ),
      animations: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Animaciones</h2>
          <p className="text-gray-600 mb-4">Explora mis trabajos de animación digital.</p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-24 rounded-lg flex items-center justify-center text-white">
              Animación 1
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-24 rounded-lg flex items-center justify-center text-white">
              Animación 2
            </div>
          </div>
        </div>
      ),
      inspiration: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Inspiración</h2>
          <p className="text-gray-600 mb-4">Fuentes de inspiración para mis obras.</p>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Naturaleza</h3>
              <p className="text-sm text-gray-600">Los paisajes dominicanos inspiran mis colores</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Tecnología</h3>
              <p className="text-sm text-gray-600">La fusión entre lo digital y lo tradicional</p>
            </div>
          </div>
        </div>
      ),
      about: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Sobre Mí</h2>
          <p className="text-gray-600 mb-4">
            Soy Sandino, un artista digital y creador de contenido de República Dominicana. 
            Me especializo en crear experiencias visuales inmersivas que combinan arte tradicional con tecnología moderna.
          </p>
          <p className="text-gray-600">
            Mi pasión es llevar la creatividad dominicana al mundo digital, inspirando a otros artistas locales.
          </p>
        </div>
      ),
      contact: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24" placeholder="Tu mensaje aquí..."></textarea>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Enviar
            </button>
          </div>
        </div>
      ),
    };

    return contentMap[id] || <div className="p-6">Contenido no encontrado</div>;
  };

  return (
    <Draggable
      handle=".window-header"
      position={window.position}
      onStop={(e, data) => updateWindowPosition(window.id, { x: data.x, y: data.y })}
      disabled={window.isMaximized}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed"
        style={{ 
          zIndex: window.zIndex,
          width: window.isMaximized ? '100vw' : window.size.width,
          height: window.isMaximized ? '100vh' : window.size.height,
          left: window.isMaximized ? 0 : window.position.x,
          top: window.isMaximized ? 0 : window.position.y,
        }}
        onClick={() => bringToFront(window.id)}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="window-header bg-gray-100 px-4 py-3 flex items-center justify-between border-b cursor-move">
            <h3 className="font-semibold text-gray-800">{window.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => minimizeWindow(window.id)}
                className="w-3 h-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"
              >
                <Minus size={8} className="text-yellow-700 m-auto" />
              </button>
              <button
                onClick={() => maximizeWindow(window.id)}
                className="w-3 h-3 bg-green-400 rounded-full hover:bg-green-500 transition-colors"
              >
                <Square size={8} className="text-green-700 m-auto" />
              </button>
              <button
                onClick={() => closeWindow(window.id)}
                className="w-3 h-3 bg-red-400 rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={8} className="text-red-700 m-auto" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {getWindowContent(window.id)}
          </div>
        </div>
      </motion.div>
    </Draggable>
  );
};
