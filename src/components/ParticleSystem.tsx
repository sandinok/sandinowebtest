// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Configuración mejorada para mayor similitud con la imagen: más partículas, tipos variados y efectos etéreos
  const config = {
    particleCount: 100, // Aumentado para un cielo más estrellado y elementos flotantes
    baseSpeed: 0.15, // Velocidad sutil para movimiento flotante
    sizeRange: { min: 3, max: 8 }, // Tamaños variables para estrellas, burbujas, etc.
    layers: 4, // Más capas para parallax y profundidad
    meteorChance: 0.02, // Probabilidad de generar meteoros
    floatingTypes: ['star', 'note', 'leaf', 'bubble'], // Tipos de partículas flotantes
    colors: {
      star: 'rgba(255, 255, 255, 0.8)',
      note: 'rgba(255, 220, 100, 0.7)', // Amarillo suave para notas musicales
      leaf: 'rgba(100, 255, 150, 0.6)', // Verde para hojas
      bubble: 'rgba(150, 200, 255, 0.5)', // Azul claro para burbujas
      meteor: 'rgba(255, 255, 200, 0.9)' // Blanco-amarillo para meteoros
    }
  };

  // Crear partícula con tipos variados (estrellas, notas, hojas, burbujas, meteoros)
  const createParticle = (layer: number) => {
    const type = Math.random() < config.meteorChance 
      ? 'meteor' 
      : config.floatingTypes[Math.floor(Math.random() * config.floatingTypes.length)];
    
    const layerFactor = 1 / layer; // Capas traseras más lentas para parallax
    const isMeteor = type === 'meteor';
    
    return {
      x: Math.random() * window.innerWidth,
      y: isMeteor ? -10 : Math.random() * window.innerHeight, // Meteors empiezan arriba
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 4 : 1), // Meteors más rápidos
      vy: (Math.random() * 0.5 + 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 6 : 1), // Meteors caen rápido
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min,
      opacity: Math.random() * 0.5 + 0.3, // Opacidad variable para sutileza
      layer,
      type,
      rotation: Math.random() * Math.PI * 2, // Rotación para elementos flotantes
      rotationSpeed: (Math.random() - 0.5) * 0.01, // Rotación sutil
      pulseSpeed: Math.random() * 0.005 + 0.002, // Pulsación más lenta
      pulsePhase: Math.random() * Math.PI * 2,
      trail: isMeteor ? [] : null // Cola para meteoros
    };
  };

  // Inicializar partículas con variedad
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Dibujar partículas según tipo (formas simples para similitud con la imagen)
  const drawParticle = (ctx: CanvasRenderingContext2D, p: any, pulse: number) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(pulse, pulse);

    const size = p.size;
    ctx.fillStyle = config.colors[p.type] || 'white';

    if (p.type === 'star') {
      // Estrella simple: círculo con brillo
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'note') {
      // Nota musical simple: óvalo con línea
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 2, size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, -size * 1.5);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = size / 4;
      ctx.stroke();
    } else if (p.type === 'leaf') {
      // Hoja simple: forma de diamante
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size / 2, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size / 2, 0);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'bubble') {
      // Burbuja: círculo con reflejo interno
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-size / 3, -size / 3, size / 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    } else if (p.type === 'meteor') {
      // Meteor con cola
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar cola
      if (p.trail && p.trail.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, -p.vx * 10, -p.vy * 10);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = size / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        p.trail.forEach((point: {x: number, y: number}, i: number) => {
          ctx.lineTo(point.x - p.x, point.y - p.y); // Relativo a posición actual
        });
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  // Actualizar partículas con movimiento flotante y efectos
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = particlesRef.current.filter(p => {
      // Movimiento
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;

      // Actualizar cola para meteoros
      if (p.type === 'meteor') {
        if (!p.trail) p.trail = [];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 10) p.trail.shift(); // Limitar longitud de cola
      }

      // Reaparecer o eliminar si salen (meteoros se eliminan al final)
      if (p.type === 'meteor') {
        if (p.y > canvas.height + p.size || p.x < -p.size || p.x > canvas.width + p.size) {
          return false; // Eliminar meteoros que salen
        }
      } else {
        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;
      }
      return true;
    });

    // Generar nuevos meteoros ocasionalmente
    if (Math.random() < config.meteorChance) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Animación principal con fondo degradado y olas inferiores
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
    lastTimeRef.current = time;

    // Dibujar fondo degradado (azul oscuro con estrellas)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001133'); // Azul oscuro superior
    gradient.addColorStop(0.7, '#002255');
    gradient.addColorStop(1, '#003366'); // Transición a azul-verde inferior para olas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar olas inferiores etéreas (patrón sinusoidal simple)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 150, 200, 0.3)'; // Verde-azulado translúcido
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.8);
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height * 0.8 + Math.sin(x * 0.01 + time * 0.001) * 20 + Math.sin(x * 0.005 + time * 0.0005) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Actualizar y dibujar partículas por capas
    for (let layer = 1; layer <= config.layers; layer++) {
      particlesRef.current
        .filter(p => p.layer === layer)
        .forEach(p => {
          const pulse = 1 + Math.sin(p.pulsePhase) * 0.1;
          drawParticle(ctx, p, pulse);
        });
    }

    updateParticles(deltaTime);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto de inicialización
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

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
      className="fixed inset-0 pointer-events-none z-0" // Cambiado a z-0 para fondo
      style={{ 
        mixBlendMode: 'screen',
        background: 'transparent'
      }}
    />
  );
};
