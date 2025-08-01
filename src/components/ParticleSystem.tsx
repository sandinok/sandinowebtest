// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const lastTimeRef = useRef<number>(0);
  const prevDimensionsRef = useRef({ width: 0, height: 0 });

  // Configuración optimizada: valores ajustados para rendimiento y belleza
  const config = {
    particleCount: 60, // Reducido para fluidez, manteniendo densidad visual
    baseSpeed: 0.1, // Velocidad más suave para movimiento etéreo
    sizeRange: { min: 1.5, max: 6 }, // Rangos más finos para partículas delicadas
    layers: 3, // Capas reducidas para menos filtrados
    meteorChance: 0.01, // Baja probabilidad para no sobrecargar
    floatingTypes: ['star', 'note', 'leaf', 'bubble'],
    colors: {
      star: 'rgba(255, 255, 255, 0.9)',
      note: 'rgba(255, 220, 100, 0.8)',
      leaf: 'rgba(100, 255, 150, 0.7)',
      bubble: 'rgba(150, 200, 255, 0.6)',
      meteor: 'rgba(255, 255, 200, 1)'
    },
    glowBlur: 4 // Brillo sutil optimizado
  };

  // Crear partícula simplificada
  const createParticle = (layer: number) => {
    const type = Math.random() < config.meteorChance 
      ? 'meteor' 
      : config.floatingTypes[Math.floor(Math.random() * config.floatingTypes.length)];
    
    const layerFactor = 1 / layer;
    const isMeteor = type === 'meteor';
    
    return {
      x: Math.random() * (prevDimensionsRef.current.width || window.innerWidth),
      y: isMeteor ? -10 : Math.random() * (prevDimensionsRef.current.height || window.innerHeight),
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 4 : 1),
      vy: (Math.random() * 0.5 + 0.5) * config.baseSpeed * layerFactor * (isMeteor ? 6 : 1),
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min,
      opacity: Math.random() * 0.3 + 0.5,
      layer,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.006,
      pulseSpeed: Math.random() * 0.003 + 0.0015,
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

  // Dibujar partículas optimizado: menos operaciones por tipo
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

    switch (p.type) {
      case 'star': {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'note': {
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 2, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, -size);
        ctx.strokeStyle = color;
        ctx.lineWidth = size / 6;
        ctx.stroke();
        break;
      }
      case 'leaf': {
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.7);
        ctx.quadraticCurveTo(size / 2, 0, 0, size * 0.7);
        ctx.quadraticCurveTo(-size / 2, 0, 0, -size * 0.7);
        ctx.fill();
        break;
      }
      case 'bubble': {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-size / 5, -size / 5, size / 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        break;
      }
      case 'meteor': {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();

        if (p.trail && p.trail.length > 0) {
          const gradient = ctx.createLinearGradient(0, 0, -p.vx * 6, -p.vy * 6);
          gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
          gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = size / 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          p.trail.forEach((point: {x: number, y: number}) => {
            ctx.lineTo(point.x - p.x, point.y - p.y);
          });
          ctx.stroke();
        }
        break;
      }
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  };

  // Actualizar partículas optimizado: filtrado eficiente, trail más corto
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
        if (p.trail.length > 6) p.trail.shift(); // Trail más corto para menos dibujo
        if (p.y > canvas.height + p.size || p.x < -p.size || p.x > canvas.width + p.size) {
          return false;
        }
      } else {
        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;
      }
      return true;
    });

    if (Math.random() < config.meteorChance) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Animación principal: clear mínimo, waves simplificadas
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16.67, 2) : 1;
    lastTimeRef.current = time;

    updateParticles(deltaTime);

    // Fondo degradado con alpha bajo para fade suave en lugar de clear full
    ctx.globalAlpha = 0.05; // Fade sutil para trails naturales sin clear pesado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001133');
    gradient.addColorStop(0.5, '#002255');
    gradient.addColorStop(1, '#003366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // Waves optimizadas: 2 capas en lugar de 3, menos puntos en loop
    ctx.save();
    const waveLayers = [0.25, 0.15]; // Capas reducidas
    waveLayers.forEach((opacity, index) => {
      ctx.fillStyle = `rgba(0, 150, 200, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * (0.8 + index * 0.04));
      for (let x = 0; x < canvas.width; x += 10) { // Step de 10px para menos lineTo calls
        const y = canvas.height * (0.8 + index * 0.04) + 
          Math.sin(x * 0.008 + time * 0.0008 + index) * 20 + 
          Math.sin(x * 0.004 + time * 0.0004 + index) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    // Dibujar partículas: filter una vez por capa
    for (let layer = 1; layer <= config.layers; layer++) {
      const layerParticles = particlesRef.current.filter(p => p.layer === layer);
      layerParticles.forEach(p => {
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.1;
        drawParticle(ctx, p, pulse);
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Inicialización: resize throttled, init solo una vez
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: NodeJS.Timeout;
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
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
            p.trail.forEach(point => {
              point.x *= scaleX;
              point.y *= scaleY;
            });
          }
        });

        prevDimensionsRef.current = { width: newWidth, height: newHeight };
      }, 100); // Throttle resize para evitar spam
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
