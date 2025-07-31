// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastTimeRef = useRef<number>(0);

  // Configuración minimalista y optimizada
  const config = {
    particleCount: 60, // Número reducido para minimalismo
    maxTempParticles: 12, // Partículas interactivas limitadas
    mouseRadius: 120,
    mouseForce: 0.2,
    baseSpeed: 0.25,
    sizeRange: { min: 3, max: 10 }
  };

  // Crear partícula minimalista (todas blancas)
  const createParticle = (layer: number, isTemp = false) => {
    const layerFactor = 1 / layer;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor,
      vy: -Math.random() * config.baseSpeed * layerFactor - 0.03 * layerFactor,
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min + 
            (3 - layer) * 1.5,
      opacity: isTemp ? 0.9 : Math.random() * 0.3 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01 * layerFactor,
      layer,
      life: isTemp ? 0 : undefined,
      maxLife: isTemp ? 80 : undefined,
      pulseSpeed: Math.random() * 0.03 + 0.01,
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
    
    // Crear partículas temporales con límite
    if (particlesRef.current.filter(p => p.life !== undefined).length < config.maxTempParticles) {
      particlesRef.current.push(createParticle(1, true));
    }
    
    clearTimeout((mouseRef.current as any).timeout);
    (mouseRef.current as any).timeout = setTimeout(() => {
      mouseRef.current.moving = false;
    }, 100);
  };

  // Dibujar formas minimalistas (círculos blancos)
  const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, 
                    size: number, opacity: number, pulse: number) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // Aplicar pulso sutil
    const currentSize = size * pulse;
    
    // Efecto de brillo suave (liquid glass)
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, currentSize
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, currentSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Borde sutil para definición
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    ctx.restore();
  };

  // Actualizar partículas optimizadas
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      
      // Manejar vida de partículas temporales
      if (p.life !== undefined) {
        p.life += 1;
        if (p.life > p.maxLife!) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        // Desvanecer partículas temporales
        p.opacity = 0.9 * (1 - p.life / p.maxLife!);
      }
      
      // Aplicar física con delta time
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;
      
      // Interacción con mouse (efecto de repulsión suave)
      if (mouseRef.current.moving && p.layer === 1) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < config.mouseRadius * config.mouseRadius) {
          const dist = Math.sqrt(distSq);
          const force = config.mouseForce * (1 - dist / config.mouseRadius);
          p.vx += -dx * force / dist * deltaTime * 0.7;
          p.vy += -dy * force / dist * deltaTime * 0.7;
        }
      }
      
      // Comportamiento sencillo y suave
      p.vy -= 0.0015 / p.layer * deltaTime;
      p.vx += Math.sin(Date.now() * 0.0003 + i) * 0.001 * deltaTime;
      
      // Limitar velocidad
      const maxSpeed = 1 / p.layer;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      // Resetear partículas fuera de pantalla
      const margin = 40;
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
    
    // Calcular delta time para animación consistente
    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
    lastTimeRef.current = time;
    
    // Limpiar con efecto de desvanecimiento sutil (liquid glass effect)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar partículas
    updateParticles(deltaTime);
    
    particlesRef.current.forEach(p => {
      const pulse = 0.95 + Math.sin(p.pulsePhase) * 0.05;
      drawShape(ctx, p.x, p.y, p.size, p.opacity, pulse);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Inicializar partículas
    initParticles();
    
    // Iniciar animación
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    // Limpiar efectos
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
