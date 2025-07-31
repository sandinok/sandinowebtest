// src/components/ParticleSystem.tsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react';

// Definición de tipos de partículas con colores y comportamientos
const PARTICLE_TYPES = {
  bubble: { color: 'rgba(173, 216, 230, 0.8)', behavior: 'float' },
  leaf: { color: 'rgba(50, 205, 50, 0.8)', behavior: 'drift' },
  note: { color: 'rgba(255, 215, 0, 0.8)', behavior: 'dance' }
};

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastTimeRef = useRef<number>(0);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Memoizar configuración de partículas
  const config = useMemo(() => ({
    particleCount: 80, // Reducido para mejor rendimiento
    maxTempParticles: 30, // Límite de partículas temporales
    mouseForce: 0.15,
    mouseRadius: 100
  }), []);

  // Crear partículas optimizadas
  const createParticle = useCallback((layer: number, isTemp = false) => {
    const layerFactor = 1 / layer;
    const types = Object.keys(PARTICLE_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4 * layerFactor,
      vy: -Math.random() * 0.4 * layerFactor - 0.05 * layerFactor,
      size: Math.random() * 8 + 6 + (3 - layer) * 3,
      type,
      opacity: Math.random() * 0.4 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01 * layerFactor,
      layer,
      life: isTemp ? 0 : undefined,
      maxLife: isTemp ? 60 : undefined
    };
  }, []);

  // Inicializar partículas
  const initParticles = useCallback(() => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * 3) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  }, [config.particleCount, createParticle]);

  // Manejar movimiento del mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    mouseRef.current.moving = true;
    
    // Crear partículas temporales con límite
    if (particlesRef.current.filter(p => p.life !== undefined).length < config.maxTempParticles) {
      particlesRef.current.push(createParticle(1, true));
    }
    
    clearTimeout((mouseRef.current as any).timeout);
    (mouseRef.current as any).timeout = setTimeout(() => {
      mouseRef.current.moving = false;
    }, 100);
  }, [config.maxTempParticles, createParticle]);

  // Dibujar partícula optimizada
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: any) => {
    const typeConfig = PARTICLE_TYPES[particle.type as keyof typeof PARTICLE_TYPES];
    if (!typeConfig) return;
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity;
    
    // Dibujar formas simples en lugar de imágenes
    ctx.fillStyle = typeConfig.color;
    switch (particle.type) {
      case 'bubble':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'leaf':
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size * 0.8, particle.size * 0.6, particle.rotation, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'note':
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size * 1.2);
        break;
    }
    ctx.restore();
  }, []);

  // Actualizar partículas optimizadas
  const updateParticles = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      
      // Actualizar vida de partículas temporales
      if (particle.life !== undefined) {
        particle.life += 1;
        if (particle.life > particle.maxLife!) {
          particlesRef.current.splice(i, 1);
          continue;
        }
      }
      
      // Aplicar física
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.rotation += particle.rotationSpeed * deltaTime;
      
      // Interacción con mouse
      if (mouseRef.current.moving && particle.layer === 1) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < config.mouseRadius * config.mouseRadius) {
          const dist = Math.sqrt(distSq);
          const force = config.mouseForce * (1 - dist / config.mouseRadius);
          particle.vx += -dx * force / dist * deltaTime;
          particle.vy += -dy * force / dist * deltaTime;
        }
      }
      
      // Comportamiento específico por tipo
      switch (particle.type) {
        case 'bubble':
          particle.vy -= 0.002 / particle.layer * deltaTime;
          particle.vx += Math.sin(Date.now() * 0.0005 + i) * 0.001 * deltaTime;
          break;
        case 'leaf':
          particle.vx += Math.sin(Date.now() * 0.0004 + i) * 0.008 * deltaTime;
          particle.vy += 0.001 / particle.layer * deltaTime;
          particle.rotationSpeed = Math.sin(Date.now() * 0.0002 + i) * 0.005 * deltaTime;
          break;
        case 'note':
          particle.vx = Math.sin(Date.now() * 0.0006 + i) * 0.1 / particle.layer * deltaTime;
          particle.vy -= 0.001 / particle.layer * deltaTime;
          break;
      }
      
      // Resetear partículas fuera de pantalla
      const margin = 50;
      if (particle.y < -margin) {
        particle.y = canvas.height + margin;
        particle.x = Math.random() * canvas.width;
      }
      if (particle.y > canvas.height + margin) {
        particle.y = -margin;
        particle.x = Math.random() * canvas.width;
      }
      if (particle.x < -margin) {
        particle.x = canvas.width + margin;
      }
      if (particle.x > canvas.width + margin) {
        particle.x = -margin;
      }
    }
  }, [config.mouseForce, config.mouseRadius]);

  // Animación optimizada con requestAnimationFrame
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    // Crear canvas offscreen si no existe
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = canvas.width;
      offscreenCanvasRef.current.height = canvas.height;
      offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d');
    }
    
    const offscreenCtx = offscreenCtxRef.current;
    if (!offscreenCtx) return;
    
    // Calcular delta time para animación consistente
    const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 16 : 1;
    lastTimeRef.current = time;
    
    // Limpiar con efecto de motion blur
    offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    offscreenCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar partículas
    updateParticles(deltaTime);
    
    particlesRef.current.forEach(particle => {
      drawParticle(offscreenCtx, particle);
    });
    
    // Copiar al canvas principal
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvasRef.current!, 0, 0);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawParticle, updateParticles]);

  // Efecto principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Redimensionar canvas offscreen
      if (offscreenCanvasRef.current) {
        offscreenCanvasRef.current.width = canvas.width;
        offscreenCanvasRef.current.height = canvas.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Inicializar partículas
    initParticles();
    
    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate);
    
    // Limpiar efectos
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      clearTimeout((mouseRef.current as any).timeout);
    };
  }, [animate, handleMouseMove, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
