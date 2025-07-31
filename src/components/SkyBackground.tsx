// src/components/SkyBackground.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Componente optimizado para estrellas
const StarsLayer = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 70,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 8,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, star.opacity, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
          }}
        />
      ))}
    </>
  );
});

// Componente optimizado para nebulosas
const NebulaLayer = React.memo(() => (
  <motion.div
    animate={{ 
      opacity: [0.08, 0.2, 0.08],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      opacity: { duration: 25, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 30, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(ellipse 600px 300px at 20% 15%, rgba(100, 200, 255, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse 400px 200px at 80% 60%, rgba(150, 100, 255, 0.12) 0%, transparent 70%),
        radial-gradient(ellipse 300px 150px at 50% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)
      `,
      filter: 'blur(50px)',
    }}
  />
));

// Componente optimizado para cometas
const CometLayer = React.memo(() => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  return (
    <>
      <motion.div
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={{ 
          x: windowWidth + 100, 
          y: -100, 
          opacity: [0, 0.7, 0] 
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          repeatDelay: 25,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.7), -20px 20px 40px rgba(255, 255, 255, 0.2)',
        }}
      />
      
      <motion.div
        initial={{ x: windowWidth + 100, y: 300, opacity: 0 }}
        animate={{ 
          x: -200, 
          y: 100, 
          opacity: [0, 0.6, 0] 
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          repeatDelay: 30, 
          delay: 4,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 15px rgba(100, 200, 255, 0.7), 20px 20px 40px rgba(100, 200, 255, 0.2)',
        }}
      />
    </>
  );
});

export const SkyBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fondo base con gradiente integrado */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2942&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-blue-700/10 to-emerald-500/8" />
      </div>
      
      {/* Capa de atmósfera dinámica */}
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 500px 250px at 30% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 400px 200px at 70% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Nebulosas optimizadas */}
      <NebulaLayer />
      
      {/* Estrellas optimizadas */}
      <StarsLayer />
      
      {/* Cometas optimizados */}
      <CometLayer />
      
      {/* Resplandor del horizonte */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.15), transparent)',
        }}
      />
    </div>
  );
});

// Exportación con nombre para evitar problemas de tree-shaking
export { SkyBackground as SkyBackgroundComponent };
