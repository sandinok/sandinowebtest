// src/components/SkyBackground.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Componente híbrido para estrellas: combina realismo con animaciones suaves y parallax balanceado
const StarsLayer = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({  // Balance: 120 estrellas para densidad realista sin sobrecarga
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 75,  // Cobertura equilibrada del cielo
      size: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.65 + 0.35,
      delay: Math.random() * 9,
      duration: 2.5 + Math.random() * 3.5,
      layer: Math.floor(Math.random() * 3) + 1,  // Capas para parallax sutil
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
            y: [0, star.layer * 4]  // Movimiento vertical suave para profundidad
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
            boxShadow: `0 0 ${star.size * 2.5}px rgba(255, 255, 255, ${star.opacity * 0.8})`,  // Brillo realista y balanceado
          }}
        />
      ))}
    </>
  );
});

// Componente híbrido para nebulosas: gradientes realistas con animación etérea y blur optimizado
const NebulaLayer = React.memo(() => (
  <motion.div
    animate={{ 
      opacity: [0.09, 0.22, 0.09],
      scale: [1, 1.04, 1],
      rotate: [0, 0.5, 0]  // Rotación mínima para naturalidad
    }}
    transition={{ 
      opacity: { duration: 22, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 28, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 32, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(ellipse 650px 325px at 22% 18%, rgba(100, 200, 255, 0.16) 0%, transparent 72%),
        radial-gradient(ellipse 450px 225px at 78% 58%, rgba(150, 100, 255, 0.13) 0%, transparent 72%),
        radial-gradient(ellipse 350px 175px at 48% 78%, rgba(16, 185, 129, 0.11) 0%, transparent 72%)
      `,
      filter: 'blur(55px)',  // Blur equilibrado para realismo suave
    }}
  />
));

// Componente híbrido para cometas/meteoros: trayectorias realistas con colas y variedad balanceada
const CometLayer = React.memo(() => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  return (
    <>
      <motion.div
        initial={{ x: -120, y: windowHeight * 0.15, opacity: 0 }}
        animate={{ 
          x: windowWidth + 120, 
          y: -windowHeight * 0.05, 
          opacity: [0, 0.75, 0] 
        }}
        transition={{ 
          duration: 6.5, 
          repeat: Infinity, 
          repeatDelay: 22,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          boxShadow: '0 0 18px rgba(255, 255, 255, 0.75), -25px 25px 45px rgba(255, 255, 255, 0.25)',  // Cola realista
        }}
      />
      
      <motion.div
        initial={{ x: windowWidth + 120, y: windowHeight * 0.35, opacity: 0 }}
        animate={{ 
          x: -220, 
          y: windowHeight * 0.05, 
          opacity: [0, 0.65, 0] 
        }}
        transition={{ 
          duration: 8.5, 
          repeat: Infinity, 
          repeatDelay: 28, 
          delay: 4.5,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 18px rgba(100, 200, 255, 0.75), 25px 25px 45px rgba(100, 200, 255, 0.22)',  // Cola en dirección opuesta
        }}
      />
      
      <motion.div
        initial={{ x: windowWidth * 0.4, y: -80, opacity: 0 }}
        animate={{ 
          x: windowWidth * 0.6, 
          y: windowHeight + 80, 
          opacity: [0, 0.55, 0] 
        }}
        transition={{ 
          duration: 9.5, 
          repeat: Infinity, 
          repeatDelay: 32,
          delay: 9,
          ease: "linear"
        }}
        className="absolute w-1 h-1 bg-yellow-100 rounded-full"
        style={{
          boxShadow: '0 0 12px rgba(255, 255, 200, 0.65), 0 35px 50px rgba(255, 255, 200, 0.18)',  // Cola vertical balanceada
        }}
      />
    </>
  );
});

// Componente híbrido para olas inferiores: etéreo y realista con animación suave
const WavesLayer = React.memo(() => (
  <motion.div
    animate={{ y: [0, -4, 0] }}  // Movimiento equilibrado
    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-0 left-0 right-0 h-1/4 overflow-hidden"
    style={{
      background: 'linear-gradient(to top, rgba(0, 150, 200, 0.35), transparent 70%)',
      maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDBDNCAwIDggOCA4MCAwQzEyIDAgMTYgMCAyMCA4QzI0IDAgMjggMCAzMiA4QzM2IDAgNDAgMCA0NCA4QzQ4IDAgNTIgMCA1NiA4QzYwIDAgNjQgMCA2OCA4QzcyIDAgNzYgMCA4MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InRyYW5zcGFyZW50Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmUpIi8+PC9zdmc+")',  // Máscara SVG refinada para olas más realistas
    }}
  >
    <motion.div
      animate={{ x: [0, -80, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
      style={{
        background: 'repeating-linear-gradient(to right, transparent 0%, rgba(0, 150, 200, 0.18) 50%, transparent 100%)',
        backgroundSize: '180% 100%',  // Balance para movimiento fluido
      }}
    />
  </motion.div>
));

export const SkyBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fondo base híbrido: imagen realista de Unsplash con gradiente balanceado */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2942&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-700/15 to-emerald-500/10" />  {/* Gradiente ajustado para realismo y suavidad */}
      </div>
      
      {/* Capa de atmósfera dinámica: balanceada para profundidad sin sobrecarga */}
      <motion.div
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 550px 275px at 32% 22%, rgba(59, 130, 246, 0.22) 0%, transparent 72%),
            radial-gradient(ellipse 450px 225px at 68% 48%, rgba(99, 102, 241, 0.18) 0%, transparent 72%)
          `
        }}
      />
      
      {/* Nebulosas híbridas */}
      <NebulaLayer />
      
      {/* Estrellas híbridas */}
      <StarsLayer />
      
      {/* Cometas/meteoros híbridos */}
      <CometLayer />
      
      {/* Olas inferiores híbridas */}
      <WavesLayer />
      
      {/* Resplandor del horizonte balanceado */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.18), transparent)',
        }}
      />
    </div>
  );
});

// Exportación con nombre para evitar problemas de tree-shaking
export { SkyBackground as SkyBackgroundComponent };
