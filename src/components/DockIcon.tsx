
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DockIconProps {
  icon: LucideIcon;
  label: string;
  color: string;
  gradient: string;
  onClick: () => void;
}

export const DockIcon: React.FC<DockIconProps> = ({
  icon: Icon,
  label,
  color,
  gradient,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.25,
        rotateY: 10,
        z: 50,
      }}
      whileTap={{ 
        scale: 0.95,
        rotateY: 0,
        transition: { duration: 0.1 }
      }}
      className="relative group cursor-pointer perspective-1000"
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center transform-style-3d overflow-hidden"
        style={{
          background: gradient,
          boxShadow: `
            0 12px 24px rgba(0, 0, 0, 0.4),
            0 6px 12px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          transform: 'translateZ(0px)',
        }}
        whileHover={{
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          transform: 'translateZ(20px)',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        {/* Superficie reflectiva */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.4) 0%, 
                transparent 30%,
                transparent 70%,
                rgba(255, 255, 255, 0.2) 100%
              )
            `,
          }}
        />
        
        {/* Icono con efectos de profundidad */}
        <motion.div
          whileHover={{ 
            scale: 1.1,
            rotateY: 5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Icon 
            size={28} 
            className="text-white relative z-10"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              transform: 'translateZ(5px)',
            }}
          />
        </motion.div>
        
        {/* Efecto de brillo dinámico */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          whileHover={{
            opacity: [0, 0.3, 0],
            background: [
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
            ],
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Partículas de interacción */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          whileHover={{
            boxShadow: [
              '0 0 0 0 rgba(255, 255, 255, 0)',
              '0 0 0 8px rgba(255, 255, 255, 0.1)',
              '0 0 0 16px rgba(255, 255, 255, 0)',
            ]
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
      
      {/* Etiqueta con glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          delay: 0.1 
        }}
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div 
          className="px-3 py-2 text-xs text-white font-semibold rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(20, 20, 40, 0.7)',
            boxShadow: `
              0 8px 16px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1),
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
                  rgba(255, 255, 255, 0.2) 50%, 
                  transparent 100%
                )
              `,
            }}
          />
        </div>
      </motion.div>
      
      {/* Reflejo del icono */}
      <motion.div
        className="absolute top-full left-0 right-0 h-16 opacity-30 pointer-events-none"
        style={{
          background: gradient,
          transform: 'scaleY(-0.6) translateY(4px)',
          filter: 'blur(1px)',
          borderRadius: '0 0 8px 8px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3 }}
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
    </motion.div>
  );
};
