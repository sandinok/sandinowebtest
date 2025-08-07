// src/components/Window.tsx
import React, { useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

type WindowModel = {
  id: string;
  title: string;
  isMaximized: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
};

interface WindowProps {
  window: WindowModel;
}

const SectionTitle = memo(({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-white">{children}</h2>
));
SectionTitle.displayName = 'SectionTitle';

const WindowContent = memo(({ id }: { id: string }) => {
  switch (id) {
    case 'portfolio':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Mi Portfolio</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gradient-to-br from-blue-400/70 to-purple-500/70 h-32 rounded-xl flex items-center justify-center text-white font-semibold backdrop-blur-md hover:scale-[1.01] transition-transform">
                Proyecto {i}
              </div>
            ))}
          </div>
        </div>
      );
    case 'youtube':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Canal de YouTube</SectionTitle>
          <div className="aspect-video bg-gradient-to-br from-red-500/25 to-red-700/35 rounded-xl flex items-center justify-center border border-red-500/25 shadow-[0_8px_20px_rgba(239,68,68,0.08)]">
            <div className="text-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-500/60 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
              <span className="text-lg">Reproductor de YouTube</span>
            </div>
          </div>
          <p className="text-gray-100">Aquí encontrarás mis videos y tutoriales sobre arte digital y creación de contenido.</p>
        </div>
      );
    case 'animations':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Animaciones</SectionTitle>
          <p className="text-gray-100 mb-2">Explora mis trabajos de animación digital.</p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-purple-400/70 to-pink-400/70 h-24 rounded-xl flex items-center justify-center text-white backdrop-blur-md hover:scale-[1.01] transition-transform">Animación 1</div>
            <div className="bg-gradient-to-r from-blue-400/70 to-cyan-400/70 h-24 rounded-xl flex items-center justify-center text-white backdrop-blur-md hover:scale-[1.01] transition-transform">Animación 2</div>
          </div>
        </div>
      );
    case 'inspiration':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Inspiración</SectionTitle>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500/80 pl-4 backdrop-blur-md bg-green-500/15 p-4 rounded-r-xl hover:bg-green-500/25 transition-colors">
              <h3 className="font-semibold text-white">Naturaleza</h3>
              <p className="text-sm text-gray-100">Los paisajes dominicanos inspiran mis colores.</p>
            </div>
            <div className="border-l-4 border-blue-500/80 pl-4 backdrop-blur-md bg-blue-500/15 p-4 rounded-r-xl hover:bg-blue-500/25 transition-colors">
              <h3 className="font-semibold text-white">Tecnología</h3>
              <p className="text-sm text-gray-100">La fusión entre lo digital y lo tradicional.</p>
            </div>
          </div>
        </div>
      );
    case 'about':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Sobre Mí</SectionTitle>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-[0_12px_30px_rgba(139,92,246,0.18)]">
                S
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <p className="text-gray-100">Soy Sandino, artista digital y creador de contenido de República Dominicana.</p>
              <p className="text-gray-100">Creo experiencias visuales inmersivas que combinan arte y tecnología.</p>
            </div>
          </div>
        </div>
      );
    case 'contact':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Contacto</SectionTitle>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Nombre</label>
              <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Mensaje</label>
              <textarea className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl h-32 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" placeholder="Tu mensaje aquí..." />
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 w-full shadow-md hover:shadow-lg">
              Enviar Mensaje
            </button>
          </div>
        </div>
      );
    default:
      return <div className="p-6 text-white">Contenido no encontrado</div>;
  }
});
WindowContent.displayName = 'WindowContent';

export const Window = memo(({ window }: WindowProps) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
  } = useWindows();

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const resizableRef = useRef<any>(null);

  // Para suavidad: no muevas left/top/width/height mientras arrastras.
  // Posiciona con transform (translate3d) durante drag/resize; sólo commit al soltar.
  const frameStyles = useMemo<React.CSSProperties>(() => {
    const isMax = window.isMaximized;
    const w = isMax ? window.innerWidth : window.size.width;
    const h = isMax ? window.innerHeight : window.size.height;
    const x = isMax ? 0 : window.position.x;
    const y = isMax ? 0 : window.position.y;
    return {
      zIndex: window.zIndex,
      width: w,
      height: h,
      transform: `translate3d(${x}px, ${y}px, 0)`,
      position: 'fixed',
      left: 0,
      top: 0,
      willChange: 'transform',
    };
  }, [window.isMaximized, window.position.x, window.position.y, window.size.width, window.size.height, window.zIndex]);

  const resizeConfig = useMemo(() => {
    return {
      enable: window.isMaximized
        ? false
        : {
            top: true, right: true, bottom: true, left: true,
            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
          },
      minWidth: 360,
      minHeight: 260,
      size: { width: window.size.width, height: window.size.height },
    };
  }, [window.isMaximized, window.size.width, window.size.height]);

  const onStartDrag = useCallback(() => {
    if (nodeRef.current) {
      nodeRef.current.dataset.state = 'dragging';
      nodeRef.current.style.transition = 'none';
      nodeRef.current.style.boxShadow = '0 8px 18px rgba(0,0,0,0.28)'; // sombra más ligera
    }
  }, []);

  const onStopDrag = useCallback((_e: any, data: any) => {
    updateWindowPosition(window.id, { x: data.x, y: data.y });
    if (nodeRef.current) {
      nodeRef.current.dataset.state = 'idle';
      nodeRef.current.style.transition = 'transform 0.18s ease-out';
      nodeRef.current.style.boxShadow = '0 18px 36px -12px rgba(0,0,0,0.38)';
    }
  }, [updateWindowPosition, window.id]);

  const onResizeStart = useCallback(() => {
    if (nodeRef.current) {
      nodeRef.current.dataset.state = 'resizing';
      nodeRef.current.style.transition = 'none';
      nodeRef.current.style.boxShadow = '0 8px 18px rgba(0,0,0,0.28)';
    }
  }, []);

  const onResizeStop = useCallback((_e: any, _dir: any, _ref: HTMLElement, d: { width: number; height: number }) => {
    updateWindowSize(window.id, { width: window.size.width + d.width, height: window.size.height + d.height });
    if (nodeRef.current) {
      nodeRef.current.dataset.state = 'idle';
      nodeRef.current.style.transition = 'transform 0.18s ease-out';
      nodeRef.current.style.boxShadow = '0 18px 36px -12px rgba(0,0,0,0.38)';
    }
  }, [updateWindowSize, window.id, window.size.width, window.size.height]);

  if (window.isMinimized) return null;

  return (
    <AnimatePresence>
      <Draggable
        handle=".window-header"
        position={window.isMaximized ? { x: 0, y: 0 } : window.position}
        onStart={onStartDrag}
        onStop={onStopDrag}
        disabled={window.isMaximized}
        nodeRef={nodeRef}
        cancel=".no-drag, input, textarea, button, select, [role='button']"
      >
        <motion.div
          ref={nodeRef}
          data-state="idle"
          initial={{ scale: 0.97, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 48 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24, mass: 0.8 }}
          className="rounded-2xl overflow-hidden"
          style={frameStyles}
          onMouseDown={() => bringToFront(window.id)}
        >
          <Resizable
            ref={resizableRef}
            size={resizeConfig.size}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
            enable={resizeConfig.enable as any}
            minWidth={resizeConfig.minWidth}
            minHeight={resizeConfig.minHeight}
            className="h-full flex flex-col bg-[rgba(18,18,32,0.52)] backdrop-blur-2xl border border-white/14"
            handleStyles={{
              bottomRight: { cursor: 'nwse-resize' },
              bottomLeft: { cursor: 'nesw-resize' },
              topRight: { cursor: 'nesw-resize' },
              topLeft: { cursor: 'nwse-resize' },
              left: { cursor: 'ew-resize' },
              right: { cursor: 'ew-resize' },
              top: { cursor: 'ns-resize' },
              bottom: { cursor: 'ns-resize' },
            } as any}
            style={{
              // durante drag/resize removemos transiciones
              transition: (nodeRef.current?.dataset.state === 'idle') ? 'box-shadow 0.2s ease' : 'none',
            }}
          >
            {/* Header */}
            <div className="window-header px-4 py-2.5 flex items-center justify-between cursor-move bg-gradient-to-r from-black/24 to-black/14 border-b border-white/10 select-none">
              <h3 className="font-semibold text-white text-sm md:text-base truncate max-w-[240px] pr-2">
                {window.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => minimizeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-yellow-400/85 hover:bg-yellow-400 transition-colors"
                  aria-label="Minimizar"
                >
                  <Minus size={12} className="text-yellow-900" />
                </button>
                <button
                  onClick={() => maximizeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-green-400/85 hover:bg-green-400 transition-colors"
                  aria-label="Maximizar"
                >
                  <Square size={12} className="text-green-900" />
                </button>
                <button
                  onClick={() => closeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-red-400/90 hover:bg-red-500 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={12} className="text-red-950" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto custom-scrollbar p-2 will-change-scroll">
              <WindowContent id={window.id} />
            </div>
          </Resizable>
        </motion.div>
      </Draggable>
    </AnimatePresence>
  );
});
Window.displayName = 'Window';
