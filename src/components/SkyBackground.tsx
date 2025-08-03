// src/components/SkyBackground.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Componente mejorado para estrellas: combinando realismo con animaciones suaves y parallax balanceado
const StarsLayer = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 80,  // Mayor cobertura del cielo
      size: Math.random() * 2 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 10,
      duration: 3 + Math.random() * 4,
      layer: Math.floor(Math.random() * 3) + 1,  // Capas para parallax sutil
      twinkle: Math.random() > 0.7,  // Algunas estrellas parpadean
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: star.twinkle 
              ? [0, star.opacity, star.opacity * 0.3, star.opacity, 0] 
              : [0, star.opacity, 0],
            y: [0, star.layer * 5],  // Movimiento vertical para profundidad
            scale: star.twinkle ? [1, 1.2, 1] : 1
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
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, ${star.opacity * 0.9})`,
          }}
        />
      ))}
    </>
  );
});

// Componente mejorado para nebulosas: gradientes más vibrantes con animación etérea
const NebulaLayer = React.memo(() => (
  <motion.div
    animate={{ 
      opacity: [0.12, 0.25, 0.12],
      scale: [1, 1.05, 1],
      rotate: [0, 1, -0.5, 0]  // Rotación suave para naturalidad
    }}
    transition={{ 
      opacity: { duration: 24, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 30, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 35, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(ellipse 700px 350px at 20% 15%, rgba(100, 200, 255, 0.2) 0%, transparent 75%),
        radial-gradient(ellipse 500px 250px at 80% 60%, rgba(180, 100, 255, 0.15) 0%, transparent 75%),
        radial-gradient(ellipse 400px 200px at 45% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 75%)
      `,
      filter: 'blur(60px)',
    }}
  />
));

// Componente mejorado para cometas/meteoros: trayectorias más dinámicas con colas más largas
const CometLayer = React.memo(() => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  return (
    <>
      <motion.div
        initial={{ x: -150, y: windowHeight * 0.1, opacity: 0 }}
        animate={{ 
          x: windowWidth + 150, 
          y: -windowHeight * 0.1, 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          repeatDelay: 24,
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), -30px 30px 60px rgba(255, 255, 255, 0.3)',
        }}
      />
      
      <motion.div
        initial={{ x: windowWidth + 150, y: windowHeight * 0.3, opacity: 0 }}
        animate={{ 
          x: -250, 
          y: windowHeight * 0.1, 
          opacity: [0, 0.7, 0] 
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          repeatDelay: 30, 
          delay: 5,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(100, 200, 255, 0.8), 30px 30px 60px rgba(100, 200, 255, 0.25)',
        }}
      />
      
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
          boxShadow: '0 0 15px rgba(255, 255, 200, 0.7), 0 40px 60px rgba(255, 255, 200, 0.2)',
        }}
      />
    </>
  );
});

// Nuevo componente para burbujas: flotando suavemente con diferentes tamaños y transparencias
const BubblesLayer = React.memo(() => {
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 5,
      opacity: Math.random() * 0.4 + 0.1,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      wobble: Math.random() * 10 - 5,
    }));
  }, []);

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={`bubble-${bubble.id}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ 
            y: "-20%", 
            opacity: [0, bubble.opacity, bubble.opacity, 0],
            x: [0, bubble.wobble, -bubble.wobble, 0]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut"
          }}
          className="absolute rounded-full border border-white/20"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1))',
          }}
        />
      ))}
    </>
  );
});

// Nuevo componente para hojas verdes: cayendo suavemente con rotación
const LeavesLayer = React.memo(() => {
  const leaves = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 10,
      opacity: Math.random() * 0.6 + 0.2,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 15,
      rotation: Math.random() * 360,
      sway: Math.random() * 30 - 15,
    }));
  }, []);

  return (
    <>
      {leaves.map((leaf) => (
        <motion.div
          key={`leaf-${leaf.id}`}
          initial={{ y: "-10%", opacity: 0, rotate: 0 }}
          animate={{ 
            y: "110%", 
            opacity: [0, leaf.opacity, leaf.opacity, 0],
            rotate: [0, leaf.rotation, leaf.rotation * 2],
            x: [0, leaf.sway, -leaf.sway, leaf.sway * 2]
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            opacity: leaf.opacity,
          }}
        >
          <svg viewBox="0 0 24 24" fill="rgba(16, 185, 129, 0.8)">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
});

// Nuevo componente para notas musicales: flotando y girando suavemente
const MusicNotesLayer = React.memo(() => {
  const notes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 70 + 10,
      size: Math.random() * 15 + 10,
      opacity: Math.random() * 0.5 + 0.2,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 5,
      type: Math.floor(Math.random() * 3), // 0: nota simple, 1: corchea, 2: negra
    }));
  }, []);

  const renderNote = (type: number, size: number, opacity: number) => {
    const color = `rgba(255, 255, 255, ${opacity})`;
    
    if (type === 0) {
      // Nota simple
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill={color} />
        </svg>
      );
    } else if (type === 1) {
      // Corchea
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill={color} />
        </svg>
      );
    } else {
      // Negra
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill={color} />
          <circle cx="10" cy="17" r="2" fill={color} />
        </svg>
      );
    }
  };

  return (
    <>
      {notes.map((note) => (
        <motion.div
          key={`note-${note.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, note.opacity, note.opacity, 0],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: note.duration,
            repeat: Infinity,
            delay: note.delay,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
          }}
        >
          {renderNote(note.type, note.size, note.opacity)}
        </motion.div>
      ))}
    </>
  );
});

// Componente mejorado para olas inferiores: más etéreo y realista con animación suave
const WavesLayer = React.memo(() => (
  <motion.div
    animate={{ y: [0, -6, 0] }}  // Movimiento más pronunciado
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden"
    style={{
      background: 'linear-gradient(to top, rgba(0, 150, 200, 0.4), transparent 70%)',
      maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDBDNCAwIDggOCA4MCAwQzEyIDAgMTYgMCAyMCA4QzI0IDAgMjggMCAzMiA4QzM2IDAgNDAgMCA0NCA4QzQ4IDAgNTIgMCA1NiA4QzYwIDAgNjQgMCA2OCA4QzcyIDAgNzYgMCA4MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InRyYW5zcGFyZW50Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmUpIi8+PC9zdmc+")',
    }}
  >
    <motion.div
      animate={{ x: [0, -80, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
      style={{
        background: 'repeating-linear-gradient(to right, transparent 0%, rgba(0, 150, 200, 0.2) 50%, transparent 100%)',
        backgroundSize: '180% 100%',
      }}
    />
  </motion.div>
));

export const SkyBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fondo base mejorado: imagen realista con gradiente más vibrante */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2942&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-700/20 to-emerald-500/15" />
      </div>
      
      {/* Capa de atmósfera dinámica mejorada */}
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 300px at 30% 20%, rgba(59, 130, 246, 0.25) 0%, transparent 75%),
            radial-gradient(ellipse 500px 250px at 70% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 75%)
          `
        }}
      />
      
      {/* Nebulosas mejoradas */}
      <NebulaLayer />
      
      {/* Estrellas mejoradas */}
      <StarsLayer />
      
      {/* Cometas/meteoros mejorados */}
      <CometLayer />
      
      {/* Nuevas burbujas flotantes */}
      <BubblesLayer />
      
      {/* Nuevas hojas verdes cayendo */}
      <LeavesLayer />
      
      {/* Nuevas notas musicales flotando */}
      <MusicNotesLayer />
      
      {/* Olas inferiores mejoradas */}
      <WavesLayer />
      
      {/* Resplandor del horizonte mejorado */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.22), transparent)',
        }}
      />
    </div>
  );
});

// Exportación con nombre para evitar problemas de tree-shaking
export { SkyBackground as SkyBackgroundComponent };
