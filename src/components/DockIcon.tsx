
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
        scale: 1.2,
        rotateY: 15,
        z: 40,
      }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer perspective-1000"
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center transform-style-3d"
        style={{
          background: gradient,
          boxShadow: `
            0 10px 25px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
          transform: 'translateZ(0px)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{
          boxShadow: `
            0 15px 35px rgba(0, 0, 0, 0.6),
            0 0 25px rgba(255, 255, 255, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.6)
          `,
          transform: 'translateZ(30px)',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        <Icon 
          size={30} 
          className="text-white drop-shadow-lg"
          style={{ 
            filter: 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5))',
            transform: 'translateZ(10px)',
          }}
        />
        
        {/* Efecto de brillo animado mejorado */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ background: 'linear-gradient(45deg, transparent 0%, transparent 100%)' }}
          whileHover={{
            background: [
              'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
            ],
          }}
          style={{ backgroundSize: '200% 200%', backgroundPosition: '0% 0%' }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
      
      {/* Etiqueta mejorada */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div 
          className="px-3 py-1.5 text-xs text-white font-semibold rounded-lg"
          style={{
            background: 'rgba(20, 20, 40, 0.6)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
};
