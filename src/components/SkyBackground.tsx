// src/components/SkyBackground.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const SkyBackground = () => {
  // Generar estrellas de forma eficiente con useMemo
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 10,
      duration: 3 + Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fondo de cielo HD con gradiente sutil */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2942&q=80")',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-700/15 to-emerald-500/10" />
      </div>
      
      {/* Efecto de brillo atmosférico mejorado */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.03, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 700px 350px at 25% 15%, rgba(59, 130, 246, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 500px 250px at 75% 55%, rgba(99, 102, 241, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 350px 180px at 90% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 250px 150px at 15% 35%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Efecto de nebulosa sutil */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, 360]
        }}
        transition={{ 
          opacity: { duration: 30, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 120, repeat: Infinity, ease: "linear" }
        }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 50% 40%, rgba(100, 200, 255, 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 20% 80%, rgba(150, 100, 255, 0.08) 0%, transparent 70%)
          `,
          filter: 'blur(60px)',
        }}
      />
      
      {/* Estrellas optimizadas con memoización */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, star.opacity, 0],
              scale: [0, star.size / 2, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.5)',
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </div>
      
      {/* Cometas optimizados con variantes */}
      <motion.div
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={{ 
          x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1000, 
          y: -100, 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatDelay: 20,
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), -30px 30px 60px rgba(255, 255, 255, 0.3)',
          filter: 'blur(0.5px)',
        }}
      />
      
      <motion.div
        initial={{ x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1000, y: 300, opacity: 0 }}
        animate={{ 
          x: -200, 
          y: 100, 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatDelay: 25, 
          delay: 5,
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(100, 200, 255, 0.8), 25px 25px 50px rgba(100, 200, 255, 0.3)',
          filter: 'blur(0.5px)',
        }}
      />
      
      {/* Efecto de resplandor del horizonte */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), transparent)',
        }}
      />
    </div>
  );
};
