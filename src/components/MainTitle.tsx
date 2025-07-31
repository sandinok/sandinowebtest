// src/components/MainTitle.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const MainTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 text-center z-30 px-4"
    >
      <div className="relative inline-block">
        {/* Efecto de brillo trasero */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-70 blur-xl"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(99, 179, 237, 0.4), transparent)',
              'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(129, 140, 248, 0.5), transparent)',
              'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(99, 179, 237, 0.4), transparent)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.h1
          className="text-7xl sm:text-8xl md:text-9xl font-bold text-white mb-4 relative select-none z-10"
          style={{
            fontFamily: "'Dancing Script', cursive",
            filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5))',
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* Efecto de gradiente animado en el texto */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-200 to-emerald-300">
            Sandino
          </span>
        </motion.h1>
      </div>
      
      {/* Línea decorativa */}
      <motion.div
        className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto mb-6 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 128, opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          delay: 1.5,
          type: "spring",
          stiffness: 100
        }}
        className="text-xl md:text-2xl text-white font-light tracking-wider px-4"
        style={{
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        }}
      >
        Digital Artist & Content Creator
      </motion.p>
      
      {/* Efecto de partículas sutiles */}
      <div className="absolute inset-x-0 top-full h-32 overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/40 rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`,
              y: 0,
              opacity: 0
            }}
            animate={{ 
              y: [0, -30, -60],
              opacity: [0, 1, 0],
              x: `+=${(Math.random() - 0.5) * 20}`
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
