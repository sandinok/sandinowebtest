// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastTimeRef = useRef<number>(0);

  // Reducimos drásticamente el número de partículas
  const PARTICLE_COUNT = 40; // Antes era 120
  const MAX_TEMP_PARTICLES = 15; // Antes era 30

  // Usamos formas simples en lugar de imágenes base64
  const drawShape = (ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    switch(type) {
      case 'bubble':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'leaf':
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'note':
        ctx.fillRect(x - size/2, y - size/2, size, size * 1.3);
        break;
    }
  };

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

    // Inicializar partículas con menos elementos
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const layer = Math.floor(Math.random() * 3) + 1;
      const layerFactor = 1 / layer;
      const types = ['bubble', 'leaf', 'note'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3 * layerFactor,
        vy: -Math.random() * 0.3 * layerFactor - 0.03 * layerFactor,
        size: Math.random() * 6 + 4 + (3 - layer) * 2,
        type,
        opacity: Math.random() * 0.3 + 0.2,
        rotation: 0,
        rotationSpeed: 0,
        layer,
        life: 0
      });
    }

    // Manejar movimiento del mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;
      
      // Limitar partículas temporales
      if (particlesRef.current.filter(p => p.life > 0).length < MAX_TEMP_PARTICLES) {
        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1 - 0.2,
          size: Math.random() * 4 + 2,
          type: 'bubble',
          opacity: 0.7,
          rotation: 0,
          rotationSpeed: 0,
          layer: 1,
          life: 1,
          maxLife: 40
        });
      }
      
      clearTimeout((mouseRef.current as any).timeout);
      (mouseRef.current as any).timeout = setTimeout(() => {
        mouseRef.current.moving = false;
      }, 50);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animación optimizada
    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      
      // Calcular delta time para animación consistente
      const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 2) : 1;
      lastTimeRef.current = time;
      
      // Limpiar con efecto de desvanecimiento sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        
        // Manejar vida de partículas temporales
        if (p.life > 0) {
          p.life += 1;
          if (p.life > p.maxLife) {
            particlesRef.current.splice(i, 1);
            continue;
          }
          // Desvanecer partículas temporales
          p.opacity = 0.7 * (1 - p.life / p.maxLife);
        }
        
        // Actualizar posición
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        
        // Interacción con mouse (solo para partículas frontales)
        if (mouseRef.current.moving && p.layer === 1) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 8000) { // Radio de 90px
            const dist = Math.sqrt(distSq);
            const force = 0.1 * (1 - dist / 90);
            p.vx += -dx * force / dist * deltaTime;
            p.vy += -dy * force / dist * deltaTime;
          }
        }
        
        // Comportamiento específico por tipo
        switch (p.type) {
          case 'bubble':
            p.vy -= 0.0015 / p.layer * deltaTime;
            break;
          case 'leaf':
            p.vx += Math.sin(time * 0.0003 + i) * 0.005 * deltaTime;
            p.vy += 0.001 / p.layer * deltaTime;
            break;
          case 'note':
            p.vx = Math.sin(time * 0.0004 + i) * 0.08 / p.layer * deltaTime;
            p.vy -= 0.001 / p.layer * deltaTime;
            break;
        }
        
        // Resetear partículas fuera de pantalla
        const margin = 30;
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
        
        // Dibujar partícula
        ctx.save();
        ctx.globalAlpha = p.opacity;
        drawShape(ctx, p.type, p.x, p.y, p.size, 
          p.type === 'bubble' ? 'rgba(173, 216, 230, 0.7)' :
          p.type === 'leaf' ? 'rgba(50, 205, 50, 0.7)' :
          'rgba(255, 215, 0, 0.7)'
        );
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animación
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
