
import React from 'react';
import { motion } from 'framer-motion';

export const MainTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center z-30"
    >
      <motion.h1
        className="text-8xl md:text-9xl font-bold text-white mb-4 select-none"
        style={{
          fontFamily: "'Dancing Script', cursive",
          textShadow: `
            0 0 20px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(99, 179, 237, 0.6),
            0 0 60px rgba(129, 140, 248, 0.4)
          `,
          filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.4))',
        }}
        animate={{
          textShadow: [
            '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(99, 179, 237, 0.6), 0 0 60px rgba(129, 140, 248, 0.4)',
            '0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(99, 179, 237, 0.75), 0 0 80px rgba(129, 140, 248, 0.6)',
            '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(99, 179, 237, 0.6), 0 0 60px rgba(129, 140, 248, 0.4)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Sandino
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-2xl md:text-3xl text-white font-medium tracking-wider"
        style={{
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
        }}
      >
        Digital Artist & Content Creator
      </motion.p>
    </motion.div>
  );
};
