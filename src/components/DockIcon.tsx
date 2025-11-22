import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DockIconProps {
  icon: LucideIcon;
  label: string;
  gradient: string;
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
  const ref = useRef<HTMLButtonElement>(null);

  // Físicas de resorte Apple (Springs)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Rotación sutil 3D
  const rotateX = useTransform(y, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12]);
  
  // Brillo dinámico que sigue al mouse
  const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calcular posición relativa del mouse (-0.5 a 0.5)
    const mouseXFromCenter = (e.clientX - rect.left) / width - 0.5;
    const mouseYFromCenter = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(mouseXFromCenter);
    mouseY.set(mouseYFromCenter);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative group flex flex-col items-center justify-end">
      {/* Tooltip estilo iOS */}
      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 pointer-events-none z-50">
        <div className="px-3 py-1.5 text-xs font-medium text-white/90 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl">
          {label}
        </div>
      </div>

      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.2, y: -15 }} // Magnificación estilo Mac
        whileTap={{ scale: 0.95 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] focus:outline-none perspective-1000"
      >
        {/* 1. Fondo del Icono (Gradiente) */}
        <div 
          className="absolute inset-0 rounded-[1.2rem] overflow-hidden shadow-lg"
          style={{ background: gradient }}
        >
          {/* Capa de ruido/textura sutil */}
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
        </div>

        {/* 2. Brillo Especular Dinámico (Sigue al mouse) */}
        <motion.div 
          className="absolute inset-0 rounded-[1.2rem] bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ 
            background: useTransform(
              [shineX, shineY],
              ([sx, sy]) => `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.4) 0%, transparent 60%)`
            )
          }}
        />

        {/* 3. Icono Flotante (Profundidad) */}
        <div 
          className="relative z-10 w-full h-full flex items-center justify-center text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
          style={{ transform: "translateZ(20px)" }}
        >
          <Icon size={30} strokeWidth={2} />
        </div>

        {/* 4. Reflejo superior fijo (Estilo Glass) */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[1.2rem] pointer-events-none" />
      </motion.button>

      {/* Indicador de App Abierta */}
      {isOpen && (
        <motion.div 
          layoutId="active-dot"
          className="absolute -bottom-2 w-1.5 h-1.5 bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      )}
    </div>
  );
};