
import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerEffectProps {
  className?: string;
  duration?: number;
  delay?: number;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ 
  className = "", 
  duration = 3,
  delay = 0 
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ 
        background: 'linear-gradient(45deg, transparent 0%, transparent 100%)'
      }}
      animate={{
        background: [
          'linear-gradient(45deg, transparent 0%, transparent 30%, rgba(255,255,255,0) 50%, transparent 70%, transparent 100%)',
          'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)',
          'linear-gradient(45deg, transparent 0%, transparent 30%, rgba(255,255,255,0) 50%, transparent 70%, transparent 100%)',
        ]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      style={{
        backgroundSize: '200% 200%',
        borderRadius: 'inherit'
      }}
    />
  );
};
