
import React from 'react';
import { motion } from 'framer-motion';

export const SkyBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* HD Sky Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2942&q=80")',
          backgroundSize: 'cover',
        }}
      />
      
      {/* Multiple gradient overlays for better depth effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-700/20 to-emerald-500/20" />
      
      {/* Enhanced atmospheric glow */}
      <motion.div
        animate={{ 
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse 600px 300px at 70% 60%, rgba(99, 102, 241, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 400px 200px at 90% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 300px 200px at 10% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Enhanced stars with motion */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              scale: [0, Math.random() * 0.7 + 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5)',
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </div>
      
      {/* Enhanced comets */}
      <motion.div
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={{ x: window.innerWidth + 100, y: -100, opacity: [0, 0.8, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatDelay: 15 }}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), -30px 30px 60px rgba(255, 255, 255, 0.3)',
        }}
      />
      
      <motion.div
        initial={{ x: window.innerWidth + 100, y: 300, opacity: 0 }}
        animate={{ x: -200, y: 100, opacity: [0, 0.8, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 20, delay: 5 }}
        className="absolute w-2 h-2 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(100, 200, 255, 0.8), 25px 25px 50px rgba(100, 200, 255, 0.3)',
        }}
      />
    </div>
  );
};
