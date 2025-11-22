import React from 'react';
import { motion } from 'framer-motion';

export const SkyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#000510]">
      {/* Mesh Gradient Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-purple-900/40 blur-[120px]"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-blue-900/30 blur-[100px]"
      />

      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[20%] w-[90vw] h-[90vw] rounded-full bg-emerald-900/20 blur-[130px]"
      />

      {/* Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};
