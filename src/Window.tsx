// src/components/Window.tsx
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import type { WindowModel } from '../context/WindowContext';
import { useSounds } from '../context/SoundContext';

type LayoutConfig = {
  animationQuality: 'high' | 'reduced';
  blurIntensity: 'low' | 'high';
  enableParallax?: boolean;
  enableReflections?: boolean;
};

interface WindowProps {
  window: WindowModel;
  layoutConfig?: LayoutConfig;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const WindowHeader: React.FC<{
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}> = ({ title, onMinimize, onMaximize, onClose }) => {
  const { playSound } = useSounds();
  return (
    <div
      className="h-10 flex items-center justify-between px-3 select-none"
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2">
        {/* Invertir orden: Cerrar (rojo), Maximizar (verde), Minimizar (amarillo) */}
        <button
          aria-label="Cerrar ventana"
          onClick={() => { playSound('close'); onClose(); }}
          className="w-3.5 h-3.5 rounded-full bg-red-500/90 hover:bg-red-400 active:scale-95"
        />
        <button
          aria-label="Maximizar ventana"
          onClick={() => { playSound('maximize'); onMaximize(); }}
          className="w-3.5 h-3.5 rounded-full bg-green-500/90 hover:bg-green-400 active:scale-95"
        />
        <button
          aria-label="Minimizar ventana"
          onClick={() => { playSound('minimize'); onMinimize(); }}
          className="w-3.5 h-3.5 rounded-full bg-yellow-400/90 hover:bg-yellow-300 active:scale-95"
        />
      </div>
      <div className="text-xs font-semibold tracking-wide text-white/90">{title}</div>
      <div className="w-14" />
    </div>
  );
};

const Card: React.FC<{ title: string; body: string; color: string }> = ({ title, body, color }) => (
  <div
    className="rounded-2xl p-4 mb-4"
    style={{
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 10px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}
  >
    <div className="text-white text-base font-semibold mb-1" style={{ borderLeft: `4px solid ${color}`, paddingLeft: 8 }}>
      {title}
    </div>
    <div className="text-white/80 text-sm">{body}</div>
  </div>
);

const WindowContent = memo(({ id }: { id: string }) => {
  const content = useMemo(() => {
    switch (id) {
      case 'inspiration':
        return (
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Inspiración</h2>
            <Card
              title="Naturaleza"
              body="Los paisajes dominicanos inspiran mis colores."
              color="#16a34a"
            />
            <Card
              title="Tecnología"
              body="La fusión entre lo digital y lo tradicional."
              color="#2563eb"
            />
          </div>
        );
      case 'portfolio':
        return (
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Mi Portfolio</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl flex items-center justify-center text-white/90"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.18) 50%, rgba(236,72,153,0.18) 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 24px rgba(0,0,0,0.22)',
                  }}
                >
                  Proyecto {i}
                </div>
              ))}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="p-6 text-white/90">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Sobre Mí</h2>
            <p className="mb-3">
              Soy Sandino, un artista digital y creador de contenido de República Dominicana.
            </p>
            <p>
              Creo experiencias visuales inmersivas que combinan arte y tecnología moderna.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Contacto</h2>
            <div className="space-y-4">
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none" placeholder="Tu nombre completo" />
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none" placeholder="tu@email.com" />
              <textarea className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none h-28 resize-none" placeholder="Cuéntame sobre tu proyecto..." />
              <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600">Enviar Mensaje</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 flex items-center justify-center">
            <p className="text-white/70">Contenido no encontrado</p>
          </div>
        );
    }
  }, [id]);

  return content;
});

export const Window: React.FC<WindowProps> = memo(({ window, layoutConfig }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, bringToFront, updateWindowPosition } = useWindows();
  const [dragging, setDragging] = useState(false);

  // Motion for position
  const x = useMotionValue(window.position.x);
  const y = useMotionValue(window.position.y);

  // Sync with context updates
  useEffect(() => {
    x.set(window.position.x);
    y.set(window.position.y);
  }, [window.position.x, window.position.y, x, y]);

  const onDragStart = useCallback(() => {
    if (window.isMaximized) return;
    setDragging(true);
    bringToFront(window.id);
  }, [window.isMaximized, window.id, bringToFront]);

  const onDragEnd = useCallback(
    (_: any, info: { offset: { x: number; y: number } }) => {
      setDragging(false);
      if (window.isMaximized) return;
      const vw = typeof window !== 'undefined' ? globalThis.window.innerWidth : 1920;
      const vh = typeof window !== 'undefined' ? globalThis.window.innerHeight : 1080;
      const nx = clamp(window.position.x + info.offset.x, 0, Math.max(0, vw - window.size.width));
      const ny = clamp(window.position.y + info.offset.y, 0, Math.max(0, vh - window.size.height));
      updateWindowPosition(window.id, { x: nx, y: ny });
    },
    [updateWindowPosition, window]
  );

  if (window.isMinimized || !window.isOpen) return null;

  const heavyBlur = (layoutConfig?.blurIntensity ?? 'high') === 'high';
  const highAnim = (layoutConfig?.animationQuality ?? 'high') === 'high';

  const containerStyle: React.CSSProperties = {
    zIndex: window.zIndex,
    width: window.isMaximized ? '100vw' : window.size.width,
    height: window.isMaximized ? '100vh' : window.size.height,
    borderRadius: window.isMaximized ? 0 : 18,
    overflow: 'hidden',
    pointerEvents: 'auto',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: '0 18px 36px -12px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06)',
    backdropFilter: `blur(${heavyBlur ? 20 : 12}px) saturate(${heavyBlur ? 140 : 120}%)`,
    WebkitBackdropFilter: `blur(${heavyBlur ? 20 : 12}px) saturate(${heavyBlur ? 140 : 120}%)`,
  };

  return (
    <motion.div
      className="window-frame fixed pointer-events-auto"
      style={{
        x: window.isMaximized ? 0 : x,
        y: window.isMaximized ? 0 : y,
        ...containerStyle,
      }}
      data-state={dragging ? 'dragging' : 'idle'}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -30 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.8 }}
      onPointerDown={() => bringToFront(window.id)}
      drag={!window.isMaximized}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <WindowHeader
        title={window.title}
        onMinimize={() => minimizeWindow(window.id)}
        onMaximize={() => maximizeWindow(window.id)}
        onClose={() => closeWindow(window.id)}
      />
      <div className="w-full h-[calc(100%-40px)] overflow-auto">
        <WindowContent id={window.id} />
      </div>
    </motion.div>
  );
});

export default Window;
