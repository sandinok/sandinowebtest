// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastTimeRef = useRef<number>(0);

  // Configuración optimizada
  const config = {
    particleCount: 50,
    maxTempParticles: 15,
    mouseRadius: 100,
    mouseForce: 0.15,
    baseSpeed: 0.3,
    sizeRange: { min: 6, max: 14 }
  };

  // Paleta de colores armoniosa
  const COLORS = {
    bubble: 'rgba(173, 216, 230, 0.85)',
    leaf: 'rgba(50, 205, 50, 0.85)',
    note: 'rgba(255, 215, 0, 0.85)'
  };

  // Crear partícula optimizada
  const createParticle = (layer: number, isTemp = false) => {
    const layerFactor = 1 / layer;
    const types = Object.keys(COLORS);
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor,
      vy: -Math.random() * config.baseSpeed * layerFactor - 0.04 * layerFactor,
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min + 
            (3 - layer) * 2,
      type,
      opacity: isTemp ? 0.95 : Math.random() * 0.3 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015 * layerFactor,
      layer,
      life: isTemp ? 0 : undefined,
      maxLife: isTemp ? 60 : undefined,
      pulseSpeed: Math.random() * 0.05 + 0.02,
      pulsePhase: Math.random() * Math.PI * 2
    };
  };

  // Inicializar partículas
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * 3) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Manejar movimiento del mouse
  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    mouseRef.current.moving = true;
    
    if (particlesRef.current.filter(p => p.life !== undefined).length < config.maxTempParticles) {
      particlesRef.current.push(createParticle(1, true));
    }
    
    clearTimeout((mouseRef.current as any).timeout);
    (mouseRef.current as any).timeout = setTimeout(() => {
      mouseRef.current.moving = false;
    }, 100);
  };

  // Dibujar formas mejoradas
  const drawShape = (ctx: CanvasRenderingContext2D, type: string, x: number, y: number, 
                    size: number, opacity: number, pulse: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    
    const currentSize = size * pulse;
    
    switch(type) {
      case 'bubble':
        // Burbuja con gradiente
        const bubbleGradient = ctx.createRadialGradient(
          -currentSize/3, -currentSize/3, 1,
          -currentSize/3, -currentSize/3, currentSize
        );
        bubbleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        bubbleGradient.addColorStop(0.3, COLORS.bubble);
        bubbleGradient.addColorStop(1, 'rgba(135, 206, 250, 0.3)');
        
        ctx.fillStyle = bubbleGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflejo brillante
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-currentSize/3, -currentSize/3, currentSize/4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'leaf':
        // Hoja estilizada
        ctx.fillStyle = COLORS.leaf;
        ctx.beginPath();
        ctx.ellipse(0, 0, currentSize * 0.9, currentSize * 0.7, 
                   Math.sin(Date.now() * 0.0005) * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Venas de la hoja
        ctx.strokeStyle = 'rgba(34, 139, 34, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -currentSize * 0.6);
        ctx.lineTo(0, currentSize * 0.6);
        ctx.stroke();
        break;
        
      case 'note':
        // Nota musical estilizada
        ctx.fillStyle = COLORS.note;
        ctx.beginPath();
        ctx.ellipse(0, 0, currentSize * 0.7, currentSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Línea de la nota
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(currentSize * 0.5, -currentSize * 0.3);
        ctx.lineTo(currentSize * 0.5, currentSize * 0.7);
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  };

  // Actualizar partículas optimizadas
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      
      if (p.life !== undefined) {
        p.life += 1;
        if (p.life > p.maxLife!) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        p.opacity = 0.95 * (1 - p.life / p.maxLife!);
      }
      
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;
      
      // Interacción con mouse
      if (mouseRef.current.moving && p.layer === 1) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < config.mouseRadius * config.mouseRadius) {
          const dist = Math.sqrt(distSq);
          const force = config.mouseForce * (1 - dist / config.mouseRadius);
          p.vx += -dx * force / dist * deltaTime * 0.8;
          p.vy += -dy * force / dist * deltaTime * 0.8;
        }
      }
      
      // Comportamiento específico por tipo
      switch (p.type) {
        case 'bubble':
          p.vy -= 0.002 / p.layer * deltaTime;
          p.vx += Math.sin(Date.now() * 0.0005 + i) * 0.002 * deltaTime;
          break;
        case 'leaf':
          p.vx += Math.sin(Date.now() * 0.0004 + i) * 0.008 * deltaTime;
          p.vy += 0.0015 / p.layer * deltaTime;
          p.rotationSpeed = Math.sin(Date.now() * 0.0003 + i) * 0.007 * deltaTime;
          break;
        case 'note':
          p.vx = Math.sin(Date.now() * 0.0006 + i) * 0.1 / p.layer * deltaTime;
          p.vy -= 0.0015 / p.layer * deltaTime;
          break;
      }
      
      // Limitar velocidad
      const maxSpeed = 1.5 / p.layer;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      // Resetear partículas fuera de pantalla
      const margin = 50;
      if (p.y < -margin) {
        p.y = canvas.height + margin;
        p.x = Math.random() * canvas.width;
      }
      if (p.y > canvas.height + margin) {
        p.y = -margin;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -margin) {
        p.x = canvas.width + margin;
      }
      if (p.x > canvas.width + margin) {
        p.x = -margin;
      }
    }
  };

  // Animación optimizada
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    
    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
    lastTimeRef.current = time;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    updateParticles(deltaTime);
    
    particlesRef.current.forEach(p => {
      const pulse = 0.9 + Math.sin(p.pulsePhase) * 0.1;
      drawShape(ctx, p.type, p.x, p.y, p.size, p.opacity, pulse, p.rotation);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    initParticles();
    
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      clearTimeout((mouseRef.current as any).timeout);
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
