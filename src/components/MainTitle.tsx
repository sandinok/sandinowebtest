import React from 'react';
import { motion } from "framer-motion";

export const MainTitle: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
      className="absolute top-[12%] left-0 right-0 text-center z-0 pointer-events-none"
    >
      <h1
        className="text-8xl md:text-[11rem] font-dancing leading-none"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #88ddff 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 30px rgba(136, 221, 255, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))',
        }}
      >
        Sandino
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-6 text-xl md:text-2xl text-white/90 font-inter tracking-[0.3em] uppercase"
        style={{
          textShadow: '0 2px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(136, 221, 255, 0.3)'
        }}
      >
        Digital Artist & Content Creator
      </motion.p>
    </motion.div>
  );
};
