// src/components/ParticleSystem.tsx
import React, { useEffect, useRef, useCallback } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastTimeRef = useRef<number>(0);

  // Configuración optimizada para belleza y rendimiento
  const config = {
    particleCount: 50, // Reducido para mejor rendimiento
    maxTempParticles: 15,
    mouseRadius: 100,
    mouseForce: 0.15,
    baseSpeed: 0.3,
    sizeRange: { min: 6, max: 14 }
  };

  // Paleta de colores armoniosa y vibrante con gradientes
  const COLORS = {
    bubble: {
      primary: 'rgba(135, 206, 250, 0.9)', // Light sky blue
      secondary: 'rgba(173, 216, 230, 0.7)', // Light blue
      highlight: 'rgba(255, 255, 255, 0.8)'
    },
    leaf: {
      primary: 'rgba(50, 205, 50, 0.9)', // Lime green
      secondary: 'rgba(34, 139, 34, 0.7)', // Forest green
      highlight: 'rgba(144, 238, 144, 0.6)'
    },
    note: {
      primary: 'rgba(255, 215, 0, 0.9)', // Gold
      secondary: 'rgba(218, 165, 32, 0.7)', // Goldenrod
      highlight: 'rgba(255, 255, 224, 0.8)'
    }
  };

  // Crear partícula optimizada con efectos visuales
  const createParticle = useCallback((layer: number, isTemp = false) => {
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
      pulsePhase: Math.random() * Math.PI * 2,
      colorShift: Math.random() * 0.2
    };
  }, []);

  // Inicializar partículas
  const initParticles = useCallback(() => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * 3) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  }, [createParticle]);

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
  }, [createParticle, config.maxTempParticles]);

  // Dibujar formas mejoradas con efectos visuales
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, type: string, x: number, y: number, 
                                size: number, opacity: number, pulse: number, rotation: number, 
                                colorShift: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    
    // Aplicar pulso a las partículas
    const currentSize = size * pulse;
    
    switch(type) {
      case 'bubble':
        // Burbuja con gradiente y reflejo
        const bubbleGradient = ctx.createRadialGradient(
          -currentSize/3, -currentSize/3, 1,
          -currentSize/3, -currentSize/3, currentSize
        );
        bubbleGradient.addColorStop(0, COLORS.bubble.highlight);
        bubbleGradient.addColorStop(0.3, COLORS.bubble.primary);
        bubbleGradient.addColorStop(1, COLORS.bubble.secondary);
        
        ctx.fillStyle = bubbleGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflejo brillante
        ctx.fillStyle = COLORS.bubble.highlight;
        ctx.beginPath();
        ctx.arc(-currentSize/3, -currentSize/3, currentSize/4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'leaf':
        // Hoja con forma orgánica y venas
        ctx.fillStyle = COLORS.leaf.primary;
        ctx.beginPath();
        
        // Forma de hoja más realista
        ctx.moveTo(0, -currentSize);
        ctx.bezierCurveTo(
          currentSize * 0.8, -currentSize * 0.6,
          currentSize * 0.8, currentSize * 0.6,
          0, currentSize
        );
        ctx.bezierCurveTo(
          -currentSize * 0.8, currentSize * 0.6,
          -currentSize * 0.8, -currentSize * 0.6,
          0, -currentSize
        );
        ctx.closePath();
        ctx.fill();
        
        // Venas de la hoja
        ctx.strokeStyle = COLORS.leaf.highlight;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -currentSize * 0.8);
        ctx.lineTo(0, currentSize * 0.8);
        ctx.moveTo(-currentSize * 0.4, -currentSize * 0.3);
        ctx.lineTo(currentSize * 0.4, -currentSize * 0.3);
        ctx.moveTo(-currentSize * 0.4, currentSize * 0.3);
        ctx.lineTo(currentSize * 0.4, currentSize * 0.3);
        ctx.stroke();
        break;
        
      case 'note':
        // Nota musical con diseño mejorado
        const noteGradient = ctx.createLinearGradient(
          -currentSize/2, -currentSize, 
          currentSize/2, currentSize
        );
        noteGradient.addColorStop(0, COLORS.note.primary);
        noteGradient.addColorStop(1, COLORS.note.secondary);
        
        ctx.fillStyle = noteGradient;
        ctx.beginPath();
        
        // Cuerpo de la nota musical
        ctx.ellipse(0, 0, currentSize * 0.6, currentSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Palo de la nota
        ctx.fillStyle = COLORS.note.secondary;
        ctx.fillRect(currentSize * 0.4, -currentSize * 0.5, 2, currentSize * 1.5);
        
        // Círculo en la nota
        ctx.fillStyle = COLORS.note.highlight;
        ctx.beginPath();
        ctx.arc(currentSize * 0.4, -currentSize * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }, []);

  // Actualizar partículas optimizadas
  const updateParticles = useCallback((deltaTime: number) => {
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
        p.opacity = 0.95 * (1 - p.life / p.maxLife!);
      }
      
      // Aplicar física con delta time
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      
      // Efecto de pulso para partículas
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
  }, [config.mouseForce, config.mouseRadius]);

  // Animación optimizada
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    
    // Calcular delta time para animación consistente
    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
    lastTimeRef.current = time;
    
    // Limpiar con efecto de desvanecimiento sutil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar partículas
    updateParticles(deltaTime);
    
    particlesRef.current.forEach(p => {
      const pulse = 0.9 + Math.sin(p.pulsePhase) * 0.1;
      drawShape(ctx, p.type, p.x, p.y, p.size, p.opacity, pulse, p.rotation, p.colorShift);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawShape, updateParticles]);

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
  }, [animate, handleMouseMove, initParticles]);

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
