// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Configuración simple y ligera
  const config = {
    particleCount: 30, // Número reducido intencionalmente
    baseSpeed: 0.2,
    sizeRange: { min: 2, max: 6 },
    layers: 3 // 3 capas para parallax
  };

  // Crear partícula simple y blanca
  const createParticle = (layer: number) => {
    const layerFactor = 1 / layer; // Capas traseras se mueven más lento
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor,
      vy: (Math.random() - 0.5) * config.baseSpeed * layerFactor,
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min,
      opacity: Math.random() * 0.4 + 0.2, // Opacidad baja para sutileza
      layer: layer,
      pulseSpeed: Math.random() * 0.01 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2
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

  // Dibujar partícula simple (círculo blanco con ligero brillo)
  const drawParticle = (ctx: CanvasRenderingContext2D, p: any, pulse: number) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    
    // Crear un suave gradiente radial blanco
    const gradient = ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.size * pulse
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Actualizar partículas con movimiento sutil
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current.forEach(p => {
      // Movimiento básico
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;
      
      // Reaparecer en el lado opuesto cuando salen de la pantalla
      if (p.x < -p.size) p.x = canvas.width + p.size;
      if (p.x > canvas.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = canvas.height + p.size;
      if (p.y > canvas.height + p.size) p.y = -p.size;
    });
  };

  // Animación principal optimizada
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Calcular delta time para animación consistente
    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
    lastTimeRef.current = time;

    // Limpiar con un fade muy sutil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas por capas (efecto parallax)
    for (let layer = 1; layer <= config.layers; layer++) {
      particlesRef.current
        .filter(p => p.layer === layer)
        .forEach(p => {
          updateParticles(deltaTime);
          const pulse = 0.9 + Math.sin(p.pulsePhase) * 0.1;
          drawParticle(ctx, p, pulse);
        });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto de inicialización
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar sistema
    initParticles();

    // Iniciar animación
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    // Limpiar al desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ 
        mixBlendMode: 'screen',
        background: 'transparent'
      }}
    />
  );
};
