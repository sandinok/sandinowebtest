import React from 'react';
import { motion } from "framer-motion";

export const MainTitle: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      className="absolute top-[15%] left-0 right-0 text-center z-0 pointer-events-none"
    >
      <h1
        className="text-7xl md:text-8xl font-dancing leading-none text-white/95"
        style={{
          textShadow: '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1)',
        }}
      >
        Sandino
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-4 text-base md:text-lg text-white/70 font-inter tracking-[0.25em] uppercase font-light"
      >
        Digital Artist & Content Creator
      </motion.p>
    </motion.div>
  );
};
