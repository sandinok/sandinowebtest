
import React from 'react';
import { motion } from 'framer-motion';

export const SkyBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Cielo base con gradiente realista */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-emerald-900" />
      
      {/* Capas de nubes animadas */}
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 800px 400px at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
                       radial-gradient(ellipse 600px 300px at 70% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 70%),
                       radial-gradient(ellipse 400px 200px at 90% 80%, rgba(139, 92, 246, 0.25) 0%, transparent 70%)`
        }}
      />
      
      {/* Estrellas brillantes */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>
      
      {/* Cometas ocasionales */}
      <motion.div
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={{ x: window.innerWidth + 100, y: -100, opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatDelay: 15 }}
        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 0, 0.8), -20px 20px 40px rgba(255, 255, 0, 0.3)',
        }}
      />
    </div>
  );
};
