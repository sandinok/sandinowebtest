// src/components/DockIcon.tsx
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DockIconProps {
  icon: LucideIcon;
  label: string;
  gradient: string;
  onClick: () => void;
}

export const DockIcon: React.FC<DockIconProps> = ({
  icon: Icon,
  label,
  gradient,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-50, 50], [5, -5]);
  const rotateY = useTransform(mouseX, [-50, 50], [-5, 5]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: gradient,
          boxShadow: `
            0 12px 30px rgba(0, 0, 0, 0.4),
            0 6px 12px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.3 : 1,
          y: isHovered ? -15 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        {/* Superficie reflectiva */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.6) 0%, 
                transparent 30%,
                transparent 70%,
                rgba(255, 255, 255, 0.2) 100%
              )
            `,
          }}
        />
        
        {/* Icono con efectos de profundidad */}
        <motion.div
          style={{ 
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10"
        >
          <Icon 
            size={28} 
            className="text-white"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              transform: 'translateZ(10px)',
            }}
          />
        </motion.div>
        
        {/* Efecto de brillo dinámico */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.4, 0] : 0,
            background: [
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
            ],
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Glow alrededor del icono */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.4 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: gradient,
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      </motion.div>
      
      {/* Etiqueta con glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 10, 
          scale: isHovered ? 1 : 0.8 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
        }}
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div 
          className="px-3 py-2 text-xs text-white font-semibold rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(20, 20, 40, 0.75)',
            boxShadow: `
              0 8px 16px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {label}
          
          {/* Mini brillo en la etiqueta */}
          <div 
            className="absolute inset-0 rounded-xl opacity-20"
            style={{
              background: `
                linear-gradient(45deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.3) 50%, 
                  transparent 100%
                )
              `,
            }}
          />
        </div>
      </motion.div>
      
      {/* Reflejo del icono */}
      <motion.div
        className="absolute top-full left-0 right-0 h-16 opacity-20 pointer-events-none"
        style={{
          background: gradient,
          transform: 'scaleY(-0.6) translateY(4px)',
          filter: 'blur(1px)',
          borderRadius: '0 0 8px 8px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
        animate={{ 
          opacity: isHovered ? 0.25 : 0,
          y: isHovered ? 2 : 0,
        }}
      >
        <Icon 
          size={28} 
          className="text-white mt-4 mx-auto"
          style={{ 
            transform: 'scaleY(-1)',
            filter: 'blur(0.5px)',
          }}
        />
      </motion.div>
    </div>
  );
};
