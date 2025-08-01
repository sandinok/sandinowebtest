// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const lastTimeRef = useRef<number>(0);
  const prevDimensionsRef = useRef({ width: 0, height: 0 });

  // Configuración mejorada: ajustada para mejor rendimiento, más suavidad y fidelidad a la imagen
  const config = {
    particleCount: 80, // Reducido ligeramente para optimizar rendimiento sin perder densidad
    baseSpeed: 0.12, // Velocidad ajustada para flotación más natural
    sizeRange: { min: 2, max: 7 }, // Rangos refinados para variedad
    layers: 4,
    meteorChance: 0.015, // Ligeramente reducido para no sobrecargar
    floatingTypes: ['star', 'note', 'leaf', 'bubble'],
    colors: {
      star: 'rgba(255, 255, 255, 0.85)',
      note: 'rgba(255, 220, 100, 0.75)',
      leaf: 'rgba(100, 255, 150, 0.65)',
      bubble: 'rgba(150, 200, 255, 0.55)',
      meteor: 'rgba(255, 255, 200, 0.95)'
    },
    glowBlur: 5 // Para efectos de brillo sutil
  };

  // Crear partícula con mejoras en inicialización
  const createParticle = (layer: number) => {
    const type = Math.random() < config.meteorChance 
      ? 'meteor' 
      : config.floatingTypes[Math.floor(Math.random() * config.floatingTypes.length)];
    
    const layerFactor = 1 / layer;
    const isMeteor = type === 'meteor';
    
    return {
      x: Math.random() * (prevDimensionsRef.current.width || window.innerWidth),
      y: isMeteor ? -10 : Math.random() * (prevDimensionsRef.current.height || window.innerHeight),
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 5 : 1),
      vy: (Math.random() * 0.5 + 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 7 : 1),
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min,
      opacity: Math.random() * 0.4 + 0.4,
      layer,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      pulseSpeed: Math.random() * 0.004 + 0.002,
      pulsePhase: Math.random() * Math.PI * 2,
      trail: isMeteor ? [] : null
    };
  };

  // Inicializar partículas
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Dibujar partículas con glow y formas refinadas
  const drawParticle = (ctx: CanvasRenderingContext2D, p: any, pulse: number) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(pulse, pulse);

    const size = p.size;
    const color = config.colors[p.type] || 'white';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = config.glowBlur;

    if (p.type === 'star') {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'note') {
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 2, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, -size * 1.2);
      ctx.strokeStyle = color;
      ctx.lineWidth = size / 5;
      ctx.stroke();
    } else if (p.type === 'leaf') {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.quadraticCurveTo(size / 2, 0, 0, size * 0.8);
      ctx.quadraticCurveTo(-size / 2, 0, 0, -size * 0.8);
      ctx.fill();
    } else if (p.type === 'bubble') {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-size / 4, -size / 4, size / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    } else if (p.type === 'meteor') {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();

      if (p.trail && p.trail.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, -p.vx * 8, -p.vy * 8);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.95)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = size / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        p.trail.forEach((point: {x: number, y: number}) => {
          ctx.lineTo(point.x - p.x, point.y - p.y);
        });
        ctx.stroke();
      }
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  };

  // Actualizar partículas con wrap mejorado y generación suave
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;

      if (p.type === 'meteor') {
        if (!p.trail) p.trail = [];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();
        if (p.y > canvas.height + p.size * 2 || p.x < -p.size * 2 || p.x > canvas.width + p.size * 2) {
          return false;
        }
      } else {
        if (p.x < -p.size * 2) p.x = canvas.width + p.size * 2;
        if (p.x > canvas.width + p.size * 2) p.x = -p.size * 2;
        if (p.y < -p.size * 2) p.y = canvas.height + p.size * 2;
        if (p.y > canvas.height + p.size * 2) p.y = -p.size * 2;
      }
      return true;
    });

    if (Math.random() < config.meteorChance) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Animación principal con orden optimizado (update antes de draw)
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16.67, 2) : 1;
    lastTimeRef.current = time;

    // Actualizar primero para dibujar con posiciones frescas
    updateParticles(deltaTime);

    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001133');
    gradient.addColorStop(0.6, '#002255');
    gradient.addColorStop(1, '#003366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Olas etéreas con múltiples capas para profundidad
    ctx.save();
    const waveLayers = [0.3, 0.2, 0.1]; // Opacidades para capas
    waveLayers.forEach((opacity, index) => {
      ctx.fillStyle = `rgba(0, 150, 200, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * (0.75 + index * 0.05));
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height * (0.75 + index * 0.05) + 
          Math.sin(x * 0.01 + time * 0.001 + index) * 25 + 
          Math.sin(x * 0.005 + time * 0.0005 + index) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    // Dibujar partículas por capas
    for (let layer = 1; layer <= config.layers; layer++) {
      particlesRef.current
        .filter(p => p.layer === layer)
        .forEach(p => {
          const pulse = 1 + Math.sin(p.pulsePhase) * 0.12;
          drawParticle(ctx, p, pulse);
        });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Inicialización con manejo de resize mejorado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const oldWidth = prevDimensionsRef.current.width || newWidth;
      const oldHeight = prevDimensionsRef.current.height || newHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;

      const scaleX = newWidth / oldWidth;
      const scaleY = newHeight / oldHeight;

      particlesRef.current.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
        if (p.trail) {
          p.trail.forEach((point: {x: number, y: number}) => {
            point.x *= scaleX;
            point.y *= scaleY;
          });
        }
      });

      prevDimensionsRef.current = { width: newWidth, height: newHeight };
    };

    prevDimensionsRef.current = { width: window.innerWidth, height: window.innerHeight };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initParticles();

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'screen',
        background: 'transparent'
      }}
    />
  );
};
