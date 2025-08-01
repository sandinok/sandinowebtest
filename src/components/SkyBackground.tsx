// src/components/SkyBackground.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Componente optimizado para estrellas con mejoras: más capas, parallax sutil y brillo variable
const StarsLayer = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 80, // Extendido para cubrir más del cielo
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.4,
      delay: Math.random() * 10,
      duration: 3 + Math.random() * 4,
      layer: Math.floor(Math.random() * 3) + 1, // Capas para parallax
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
            y: [0, star.layer * 5] // Movimiento sutil vertical para parallax
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
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, ${star.opacity})`, // Brillo ajustable
          }}
        />
      ))}
    </>
  );
});

// Componente optimizado para nebulosas con colores más etéreos y degradados suaves
const NebulaLayer = React.memo(() => (
  <motion.div
    animate={{ 
      opacity: [0.1, 0.25, 0.1],
      scale: [1, 1.03, 1],
      rotate: [0, 1, 0] // Rotación sutil para movimiento etéreo
    }}
    transition={{ 
      opacity: { duration: 20, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 30, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(ellipse 700px 350px at 25% 20%, rgba(100, 200, 255, 0.18) 0%, transparent 75%),
        radial-gradient(ellipse 500px 250px at 75% 55%, rgba(150, 100, 255, 0.15) 0%, transparent 75%),
        radial-gradient(ellipse 400px 200px at 45% 75%, rgba(16, 185, 129, 0.12) 0%, transparent 75%)
      `,
      filter: 'blur(60px)', // Blur aumentado para suavidad
    }}
  />
));

// Componente optimizado para cometas/meteoros con trayectorias variables y colas mejoradas
const CometLayer = React.memo(() => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  return (
    <>
      <motion.div
        initial={{ x: -150, y: windowHeight * 0.2, opacity: 0 }}
        animate={{ 
          x: windowWidth + 150, 
          y: -windowHeight * 0.1, 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          repeatDelay: 20,
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), -30px 30px 50px rgba(255, 255, 255, 0.3)', // Cola extendida
        }}
      />
      
      <motion.div
        initial={{ x: windowWidth + 150, y: windowHeight * 0.4, opacity: 0 }}
        animate={{ 
          x: -250, 
          y: windowHeight * 0.1, 
          opacity: [0, 0.7, 0] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatDelay: 25, 
          delay: 5,
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-blue-200 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(100, 200, 255, 0.8), 30px 30px 50px rgba(100, 200, 255, 0.25)', // Cola en dirección opuesta
        }}
      />
      
      {/* Cometa adicional para más dinamismo */}
      <motion.div
        initial={{ x: windowWidth * 0.3, y: -100, opacity: 0 }}
        animate={{ 
          x: windowWidth * 0.7, 
          y: windowHeight + 100, 
          opacity: [0, 0.6, 0] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatDelay: 35,
          delay: 10,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full"
        style={{
          boxShadow: '0 0 15px rgba(255, 255, 200, 0.7), 0 40px 60px rgba(255, 255, 200, 0.2)', // Cola vertical
        }}
      />
    </>
  );
});

// Nuevo componente para olas inferiores etéreas
const WavesLayer = React.memo(() => (
  <motion.div
    animate={{ y: [0, -5, 0] }} // Movimiento sutil de olas
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden"
    style={{
      background: 'linear-gradient(to top, rgba(0, 150, 200, 0.4), transparent 80%)',
      maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwQzUgMCAxMCAxMCAxNSAwQzIwIDAgMjUgMCAzMCAxMEMzNSAwIDQwIDAgNDUgMEM1MCAwIDU1IDAgNjAgMTBDNjUgMCA3MCAwIDc1IDBDODAgMCA4NSAwIDkwIDBDOTUgMCAxMDAgMCAxMDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ0cmFuc3BhcmVudCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==")', // Máscara SVG simple para olas
    }}
  >
    <motion.div
      animate={{ x: [0, -100, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
      style={{
        background: 'repeating-linear-gradient(to right, transparent 0%, rgba(0, 150, 200, 0.2) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  </motion.div>
));

export const SkyBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fondo base con gradiente mejorado para azul oscuro a verde-azulado */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2942&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#001133] via-[#002255] to-[#003366]/80" /> {/* Gradiente ajustado */}
      </div>
      
      {/* Capa de atmósfera dinámica con más profundidad */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 300px at 35% 25%, rgba(59, 130, 246, 0.25) 0%, transparent 75%),
            radial-gradient(ellipse 500px 250px at 65% 45%, rgba(99, 102, 241, 0.2) 0%, transparent 75%)
          `
        }}
      />
      
      {/* Nebulosas optimizadas */}
      <NebulaLayer />
      
      {/* Estrellas optimizadas */}
      <StarsLayer />
      
      {/* Cometas/meteoros optimizados */}
      <CometLayer />
      
      {/* Nueva capa de olas inferiores */}
      <WavesLayer />
      
      {/* Resplandor del horizonte mejorado */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), transparent)',
          boxShadow: '0 -20px 40px rgba(16, 185, 129, 0.1)',
        }}
      />
    </div>
  );
});

// Exportación con nombre para evitar problemas de tree-shaking
export { SkyBackground as SkyBackgroundComponent };
