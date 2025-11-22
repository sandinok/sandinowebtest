import React from 'react';
import { motion } from "framer-motion";

export const MainTitle: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute top-[15%] left-0 right-0 text-center z-0 pointer-events-none"
    >
      <h1 className="text-8xl md:text-9xl text-white font-dancing drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        Sandino
      </h1>
      <p className="mt-4 text-lg md:text-xl text-white/80 font-inter tracking-widest uppercase">
        Digital Artist & Content Creator
      </p>
    </motion.div>
  );
};
