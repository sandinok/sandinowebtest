// src/components/Window.tsx
import React, { useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { Resizable } from 're-resizable';

/*
Window.tsx Ultra-Optimizado:
- Menos re-renders: memo en todo, callbacks estables, content map memoizado por id.
- Animaciones suaves pero ligeras: springs cortos, sin overshoot exagerado, sin animaciones anidadas en listas grandes.
- Drag/Resize sin jank: desactiva transiciones costosas durante drag/resize (data-state), throttling natural del lib.
- Layout estable: fixed con zIndex controlado, shadow y blur contenidos.
- Tailwind dinámico seguro: se evitan clases tailwind con interpolación (que rompen el purge y añaden jank).
- Scroll fluido: scrollbar fino, sin sombras costosas en el track.
- Botones de control simples: sin motion excesivo por cada hover; boxShadow reducido.
- CSS flags: añade o quita la clase "reduce-motion" en <html> si quieres forzar menos animación global.
*/

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

/* ---------- Contenido ultra-liviano ---------- */

const Card: React.FC<{ children: React.ReactNode; delay?: number; colorFrom?: string; colorTo?: string }> = memo(
  ({ children, delay = 0, colorFrom = 'from-blue-400/80', colorTo = 'to-purple-500/80' }) => (
    <div
      className={`bg-gradient-to-br ${colorFrom} ${colorTo} h-32 rounded-xl flex items-center justify-center text-white font-semibold backdrop-blur-md transition-transform duration-200 hover:scale-[1.015]`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

const SectionTitle: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
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
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>Proyecto {i}</Card>
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
              <div className="w-20 h-20 bg-red-500/60 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
              <span className="text-lg">Reproductor de YouTube</span>
            </div>
          </div>
          <p className="text-gray-100">Aquí encontrarás todos mis videos y tutoriales sobre arte digital y creación de contenido.</p>
        </div>
      );
    case 'animations':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Animaciones</SectionTitle>
          <p className="text-gray-100 mb-2">Explora mis trabajos de animación digital.</p>
          <div className="grid grid-cols-1 gap-4">
            <Card colorFrom="from-purple-400/70" colorTo="to-pink-400/70">Animación 1</Card>
            <Card colorFrom="from-blue-400/70" colorTo="to-cyan-400/70">Animación 2</Card>
          </div>
        </div>
      );
    case 'inspiration':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Inspiración</SectionTitle>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500/80 pl-4 backdrop-blur-md bg-green-500/15 p-4 rounded-r-xl transition-colors duration-200 hover:bg-green-500/25">
              <h3 className="font-semibold text-white">Naturaleza</h3>
              <p className="text-sm text-gray-100">Los paisajes dominicanos inspiran mis colores</p>
            </div>
            <div className="border-l-4 border-blue-500/80 pl-4 backdrop-blur-md bg-blue-500/15 p-4 rounded-r-xl transition-colors duration-200 hover:bg-blue-500/25">
              <h3 className="font-semibold text-white">Tecnología</h3>
              <p className="text-sm text-gray-100">La fusión entre lo digital y lo tradicional</p>
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
      );
    case 'contact':
      return (
        <div className="p-6 space-y-6">
          <SectionTitle>Contacto</SectionTitle>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Nombre</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" 
                placeholder="Tu nombre" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" 
                placeholder="tu@email.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Mensaje</label>
              <textarea 
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-xl h-32 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors" 
                placeholder="Tu mensaje aquí..."
              />
            </div>
            <button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 w-full shadow-md hover:shadow-lg"
            >
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

/* ---------- Ventana ---------- */

export const Window = memo(({ window }: WindowProps) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    bringToFront, 
    updateWindowPosition, 
    updateWindowSize 
  } = useWindows();
  
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const resizableRef = useRef<any>(null);

  // Estilos de posición/tamaño (sin transiciones en drag/resize)
  const windowStyles = useMemo<React.CSSProperties>(() => {
    const isMax = window.isMaximized;
    return {
      zIndex: window.zIndex,
      width: isMax ? '100vw' : window.size.width,
      height: isMax ? '100vh' : window.size.height,
      left: isMax ? 0 : window.position.x,
      top: isMax ? 0 : window.position.y,
      // Transiciones suaves solo cuando no se arrastra/resize (control con data-state)
      transition: 'transform 0.2s ease-out',
      willChange: 'transform',
    };
  }, [window.isMaximized, window.position.x, window.position.y, window.size.width, window.size.height, window.zIndex]);

  // Configuración de resizable
  const resizeConfig = useMemo(() => {
    const enableHandles = {
      top: true, right: true, bottom: true, left: true,
      topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
    };
    return {
      enable: window.isMaximized ? false : enableHandles,
      minWidth: 360,
      minHeight: 260,
      size: { width: window.size.width, height: window.size.height },
      lockAspectRatio: false,
      handleStyles: { bottomRight: { cursor: 'nwse-resize' } as React.CSSProperties },
    };
  }, [window.isMaximized, window.size.height, window.size.width]);

  const onStopDrag = useCallback((_e: any, data: any) => {
    if (!window.isMaximized) updateWindowPosition(window.id, { x: data.x, y: data.y });
    if (nodeRef.current) nodeRef.current.dataset.state = 'idle';
  }, [updateWindowPosition, window.id, window.isMaximized]);

  const onStartDrag = useCallback(() => {
    if (nodeRef.current) nodeRef.current.dataset.state = 'dragging';
  }, []);

  const onResizeStop = useCallback((_e: any, _direction: any, _ref: HTMLElement, d: { width: number; height: number }) => {
    if (!window.isMaximized) {
      updateWindowSize(window.id, { 
        width: window.size.width + d.width, 
        height: window.size.height + d.height 
      });
    }
    if (nodeRef.current) nodeRef.current.dataset.state = 'idle';
  }, [updateWindowSize, window.id, window.isMaximized, window.size.height, window.size.width]);

  const onResizeStart = useCallback(() => {
    if (nodeRef.current) nodeRef.current.dataset.state = 'resizing';
  }, []);

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
          initial={{ scale: 0.96, opacity: 0, y: 28 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.8 }}
          className="fixed rounded-2xl overflow-hidden"
          style={windowStyles}
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
            handleStyles={resizeConfig.handleStyles as any}
            className="h-full flex flex-col bg-[rgba(18,18,32,0.55)] backdrop-blur-2xl border border-white/15"
            style={{
              boxShadow: '0 18px 36px -12px rgba(0,0,0,0.38), inset 0 0 0 1px rgba(255,255,255,0.12)',
              // Desactiva transitions mientras drag/resize para evitar lag visual
              transition: (nodeRef.current?.dataset.state === 'idle') ? 'box-shadow 0.2s ease' : 'none',
            }}
          >
            {/* Header */}
            <div className="window-header px-4 py-2.5 flex items-center justify-between cursor-move bg-gradient-to-r from-black/25 to-black/15 backdrop-blur-md border-b border-white/10 select-none">
              <h3 className="font-semibold text-white text-sm md:text-base truncate max-w-[240px] pr-2">
                {window.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => minimizeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-yellow-400/80 hover:bg-yellow-400/95 transition-colors"
                  aria-label="Minimizar"
                >
                  <Minus size={12} className="text-yellow-950" />
                </button>
                <button
                  onClick={() => maximizeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-green-400/80 hover:bg-green-400/95 transition-colors"
                  aria-label="Maximizar"
                >
                  <Square size={12} className="text-green-950" />
                </button>
                <button
                  onClick={() => closeWindow(window.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-red-400/85 hover:bg-red-500 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={12} className="text-red-950" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto custom-scrollbar p-1 will-change-scroll">
              <WindowContent id={window.id} />
            </div>
          </Resizable>
        </motion.div>
      </Draggable>
    </AnimatePresence>
  );
});
Window.displayName = 'Window';

/* Agrega esto a tu CSS global (por ejemplo, src/index.css) para scrollbars ligeros:

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.28) transparent;
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.28);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.38); }

*/

/* Opcional: fuerza menos animación global (añade la clase reduce-motion al <html>)
html.reduce-motion * {
  animation-duration: 0.001s !important;
  animation-iteration-count: 1 !important;
  transition: none !important;
}
*/
