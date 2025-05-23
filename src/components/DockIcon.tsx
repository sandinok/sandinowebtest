
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DockIconProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
}

export const DockIcon: React.FC<DockIconProps> = ({
  icon: Icon,
  label,
  color,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.15,
        rotateY: 15,
        z: 20,
      }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color.replace('from-', '').replace('to-', ', ')})`,
          boxShadow: `
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
        }}
        whileHover={{
          boxShadow: `
            0 15px 35px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
        }}
      >
        <Icon 
          size={28} 
          className="text-white drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
        />
        
        {/* Efecto de brillo animado */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ background: 'linear-gradient(45deg, transparent 0%, transparent 100%)' }}
          whileHover={{
            background: [
              'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, transparent 100%)',
            ],
          }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
      
      {/* Etiqueta */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div 
          className="px-2 py-1 text-xs text-white font-semibold rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
};
