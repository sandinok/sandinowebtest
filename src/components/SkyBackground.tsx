
import React from 'react';
import { motion } from 'framer-motion';

export const SkyBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* HD Sky Background image */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3880&q=80")',
          backgroundSize: 'cover',
          opacity: 0.9
        }}
      />
      
      {/* Gradient overlay to enhance stars visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-emerald-900/40" />
      
      {/* Animated starry layer */}
      <motion.div
        animate={{ 
          x: [-20, 20, -20],
          opacity: [0.4, 0.5, 0.4]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 800px 400px at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
                     radial-gradient(ellipse 600px 300px at 70% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 70%),
                     radial-gradient(ellipse 400px 200px at 90% 80%, rgba(139, 92, 246, 0.25) 0%, transparent 70%)`
        }}
      />
      
      {/* Enhanced stars with motion */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, Math.random() * 0.7 + 0.3, 0],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5)',
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </div>
      
      {/* Enhanced comets */}
      <motion.div
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={{ x: window.innerWidth + 100, y: -100, opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatDelay: 15 }}
        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 0, 0.8), -20px 20px 40px rgba(255, 255, 0, 0.3)',
        }}
      />
      
      <motion.div
        initial={{ x: window.innerWidth + 100, y: 300, opacity: 0 }}
        animate={{ x: -200, y: 100, opacity: [0, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 20, delay: 5 }}
        className="absolute w-2 h-2 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(100, 200, 255, 0.8), 20px 20px 40px rgba(100, 200, 255, 0.3)',
        }}
      />
    </div>
  );
};
