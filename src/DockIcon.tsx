import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DockIconProps {
  icon: LucideIcon;
  label: string;
  gradient: string; // Espera formato CSS "linear-gradient(...)"
  onClick: () => void;
  isOpen?: boolean;
}

export const DockIcon: React.FC<DockIconProps> = ({
  icon: Icon,
  label,
  gradient,
  onClick,
  isOpen
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Físicas de mouse para el efecto Tilt (Paralaje)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs suaves para el movimiento
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transformaciones de rotación sutiles
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - (rect.left + width / 2);
    const mouseYFromCenter = e.clientY - (rect.top + height / 2);
    
    // Normalizamos valores entre -0.5 y 0.5
    mouseX.set(mouseXFromCenter / width);
    mouseY.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip Flotante (Solo visible en hover) */}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="px-3 py-1.5 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl">
          {label}
        </div>
      </div>

      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.15, y: -10 }}
        whileTap={{ scale: 0.9 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] focus:outline-none"
      >
        {/* 1. Sombra Ambiental (Glow detrás del icono) */}
        <div 
          className="absolute inset-2 rounded-[1rem] opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
          style={{ background: gradient }}
        />

        {/* 2. Estructura Principal de Cristal */}
        <div className="absolute inset-0 rounded-[1.2rem] ios-liquid-glass overflow-hidden border border-white/20">
          {/* Gradiente de fondo sutil */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-40"
            style={{ background: gradient }}
          />
          
          {/* Efecto de brillo líquido animado */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* 3. El Icono (Flotando en 3D) */}
        <div 
          className="relative z-10 w-full h-full flex items-center justify-center text-white drop-shadow-md"
          style={{ transform: 'translateZ(20px)' }}
        >
          <Icon size={28} strokeWidth={2} className="group-hover:text-white transition-colors" />
        </div>

        {/* 4. Reflejo especular superior (Toque Apple) */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[1.2rem] pointer-events-none" />
      </motion.button>

      {/* Indicador de App Abierta (Punto) */}
      {isOpen && (
        <motion.div 
          layoutId="active-dot"
          className="absolute -bottom-2 w-1.5 h-1.5 bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      )}
    </div>
  );
};
