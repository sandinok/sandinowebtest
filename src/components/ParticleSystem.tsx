// src/components/ParticleSystem.tsx
import React, { useEffect, useRef, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: ParticleType;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  layer: number;
  life?: number;
  maxLife?: number;
  pulseSpeed: number;
  pulsePhase: number;
  hue: number;
  saturation: number;
  lightness: number;
  trail: { x: number; y: number; opacity: number }[];
  energy: number;
  magnetic: boolean;
  glowIntensity: number;
}

type ParticleType = 'plasma' | 'crystal' | 'stardust' | 'energy' | 'ethereal';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    moving: false, 
    lastX: 0, 
    lastY: 0,
    velocity: { x: 0, y: 0 },
    trail: [] as { x: number; y: number; time: number }[]
  });
  const lastTimeRef = useRef<number>(0);
  const performanceRef = useRef({ frameTime: 16, adaptiveQuality: 1 });

  // Configuración optimizada con calidad adaptativa
  const config = useMemo(() => ({
    particleCount: 75,
    maxTempParticles: 25,
    mouseRadius: 150,
    mouseForce: 0.25,
    baseSpeed: 0.4,
    sizeRange: { min: 4, max: 18 },
    trailLength: 8,
    layers: 4,
    qualityThreshold: 20, // ms por frame
    minQuality: 0.3,
    maxQuality: 1.5
  }), []);

  // Paleta de colores dinámica mejorada
  const getColorPalette = (type: ParticleType, hue: number, sat: number, light: number) => {
    const baseColor = `hsl(${hue}, ${sat}%, ${light}%)`;
    const glowColor = `hsl(${hue}, ${Math.min(sat + 20, 100)}%, ${Math.min(light + 30, 90)}%)`;
    const coreColor = `hsl(${hue}, ${Math.min(sat + 10, 100)}%, ${Math.min(light + 15, 80)}%)`;
    
    return { baseColor, glowColor, coreColor };
  };

  // Crear partícula con propiedades mejoradas
  const createParticle = (layer: number, isTemp = false, x?: number, y?: number): Particle => {
    const layerFactor = 1 / layer;
    const types: ParticleType[] = ['plasma', 'crystal', 'stardust', 'energy', 'ethereal'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Colores más sofisticados basados en HSL
    const hue = Math.random() * 360;
    const saturation = 60 + Math.random() * 40;
    const lightness = 50 + Math.random() * 30;
    
    return {
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * config.baseSpeed * layerFactor,
      vy: -Math.random() * config.baseSpeed * layerFactor - 0.05 * layerFactor,
      size: Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min + 
            (config.layers - layer) * 1.5,
      type,
      opacity: isTemp ? 0.9 : Math.random() * 0.4 + 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02 * layerFactor,
      layer,
      life: isTemp ? 0 : undefined,
      maxLife: isTemp ? 120 : undefined,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      hue,
      saturation,
      lightness,
      trail: [],
      energy: Math.random() * 0.5 + 0.5,
      magnetic: Math.random() > 0.7,
      glowIntensity: Math.random() * 0.8 + 0.2
    };
  };

  // Inicializar sistema de partículas
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(layer));
    }
  };

  // Control de mouse mejorado con trail
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    const prevMouse = mouseRef.current;
    
    // Calcular velocidad del mouse
    prevMouse.velocity.x = (x - prevMouse.lastX) * 0.1;
    prevMouse.velocity.y = (y - prevMouse.lastY) * 0.1;
    
    prevMouse.x = x;
    prevMouse.y = y;
    prevMouse.lastX = x;
    prevMouse.lastY = y;
    prevMouse.moving = true;
    
    // Añadir al trail del mouse
    prevMouse.trail.push({ x, y, time: Date.now() });
    if (prevMouse.trail.length > 10) {
      prevMouse.trail.shift();
    }
    
    // Crear partículas temporales basadas en velocidad del mouse
    const speed = Math.sqrt(prevMouse.velocity.x ** 2 + prevMouse.velocity.y ** 2);
    if (speed > 2 && particlesRef.current.filter(p => p.life !== undefined).length < config.maxTempParticles) {
      const numParticles = Math.min(Math.floor(speed / 5), 3);
      for (let i = 0; i < numParticles; i++) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        particlesRef.current.push(createParticle(1, true, x + offsetX, y + offsetY));
      }
    }
    
    clearTimeout((prevMouse as any).timeout);
    (prevMouse as any).timeout = setTimeout(() => {
      prevMouse.moving = false;
      prevMouse.velocity.x *= 0.9;
      prevMouse.velocity.y *= 0.9;
    }, 150);
  };

  // Función de dibujo mejorada con efectos avanzados
  const drawParticle = (
    ctx: CanvasRenderingContext2D, 
    particle: Particle, 
    pulse: number,
    quality: number
  ) => {
    const { x, y, size, type, opacity, rotation, hue, saturation, lightness, glowIntensity } = particle;
    const colors = getColorPalette(type, hue, saturation, lightness);
    const currentSize = size * pulse * quality;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    // Dibujar glow exterior si la calidad lo permite
    if (quality > 0.7) {
      ctx.shadowColor = colors.glowColor;
      ctx.shadowBlur = currentSize * glowIntensity * 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    switch (type) {
      case 'plasma':
        // Efecto plasma con múltiples gradientes
        const plasmaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        plasmaGradient.addColorStop(0, colors.coreColor);
        plasmaGradient.addColorStop(0.4, colors.baseColor);
        plasmaGradient.addColorStop(0.8, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`);
        plasmaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = plasmaGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        if (quality > 0.8) {
          // Núcleo brillante
          ctx.fillStyle = `hsla(${hue + 30}, 100%, 80%, 0.8)`;
          ctx.beginPath();
          ctx.arc(-currentSize * 0.2, -currentSize * 0.2, currentSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'crystal':
        // Cristal facetado
        ctx.fillStyle = colors.baseColor;
        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const radius = currentSize * (0.8 + Math.sin(pulse * Math.PI * 4) * 0.2);
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        if (quality > 0.6) {
          // Reflejos del cristal
          ctx.strokeStyle = colors.glowColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        break;

      case 'stardust':
        // Partícula de polvo estelar con destellos
        const dustGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        dustGradient.addColorStop(0, colors.coreColor);
        dustGradient.addColorStop(0.6, colors.baseColor);
        dustGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = dustGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        if (quality > 0.7) {
          // Destellos en cruz
          ctx.strokeStyle = colors.glowColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(-currentSize * 1.2, 0);
          ctx.lineTo(currentSize * 1.2, 0);
          ctx.moveTo(0, -currentSize * 1.2);
          ctx.lineTo(0, currentSize * 1.2);
          ctx.stroke();
        }
        break;

      case 'energy':
        // Orbe de energía con ondas
        const energyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        energyGradient.addColorStop(0, colors.coreColor);
        energyGradient.addColorStop(0.3, colors.baseColor);
        energyGradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`);
        energyGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = energyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        if (quality > 0.6) {
          // Ondas de energía
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.3)`;
          ctx.lineWidth = 1;
          const waveRadius = currentSize * (1.2 + Math.sin(pulse * Math.PI * 6) * 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case 'ethereal':
        // Forma etérea con bordes suaves
        const etherealGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        etherealGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, 0.9)`);
        etherealGradient.addColorStop(0.5, colors.baseColor);
        etherealGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = etherealGradient;
        ctx.beginPath();
        // Forma orgánica usando múltiples arcos
        const points = 8;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radius = currentSize * (0.7 + Math.sin(angle * 3 + pulse * Math.PI * 2) * 0.3);
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  // Sistema de actualización optimizado
  const updateParticles = (deltaTime: number, quality: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const mouse = mouseRef.current;
    const currentTime = Date.now();
    
    // Limpiar trail del mouse antiguo
    mouse.trail = mouse.trail.filter(point => currentTime - point.time < 500);
    
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      
      // Actualizar vida de partículas temporales
      if (p.life !== undefined) {
        p.life += deltaTime;
        if (p.life > p.maxLife!) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        const lifeRatio = p.life / p.maxLife!;
        p.opacity = 0.9 * (1 - lifeRatio * lifeRatio); // Fade out cuadrático
      }
      
      // Actualizar trail de la partícula
      if (quality > 0.5) {
        p.trail.push({ x: p.x, y: p.y, opacity: p.opacity });
        if (p.trail.length > config.trailLength) {
          p.trail.shift();
        }
      }
      
      // Física básica
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.rotation += p.rotationSpeed * deltaTime;
      p.pulsePhase += p.pulseSpeed * deltaTime;
      
      // Interacción magnética con el mouse
      if (mouse.moving && (p.magnetic || p.layer === 1)) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = config.mouseRadius * config.mouseRadius;
        
        if (distSq < maxDist && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = config.mouseForce * (1 - dist / config.mouseRadius) * p.energy;
          const forceX = (dx / dist) * force * deltaTime;
          const forceY = (dy / dist) * force * deltaTime;
          
          if (p.magnetic) {
            // Atracción magnética
            p.vx += forceX * 0.5;
            p.vy += forceY * 0.5;
          } else {
            // Repulsión normal
            p.vx -= forceX;
            p.vy -= forceY;
          }
          
          // Añadir efecto de la velocidad del mouse
          p.vx += mouse.velocity.x * 0.01;
          p.vy += mouse.velocity.y * 0.01;
        }
      }
      
      // Comportamientos específicos por tipo
      const time = currentTime * 0.001;
      switch (p.type) {
        case 'plasma':
          p.vy -= 0.003 / p.layer * deltaTime;
          p.vx += Math.sin(time * 0.5 + i) * 0.003 * deltaTime;
          p.hue += 0.1 * deltaTime; // Cambio de color
          break;
        case 'crystal':
          p.vx += Math.sin(time * 0.4 + i) * 0.005 * deltaTime;
          p.vy += 0.002 / p.layer * deltaTime;
          p.rotationSpeed = Math.sin(time * 0.3 + i) * 0.008 * deltaTime;
          break;
        case 'stardust':
          p.vx = Math.sin(time * 0.6 + i) * 0.08 / p.layer * deltaTime;
          p.vy -= 0.002 / p.layer * deltaTime;
          p.glowIntensity = 0.5 + Math.sin(time * 2 + i) * 0.5;
          break;
        case 'energy':
          p.vx += Math.cos(time * 0.7 + i) * 0.004 * deltaTime;
          p.vy += Math.sin(time * 0.5 + i) * 0.004 * deltaTime;
          p.energy = 0.5 + Math.sin(time + i) * 0.5;
          break;
        case 'ethereal':
          p.vx += Math.sin(time * 0.3 + i) * 0.002 * deltaTime;
          p.vy -= 0.001 / p.layer * deltaTime;
          p.opacity = (p.life !== undefined ? p.opacity : 0.7) + Math.sin(time * 1.5 + i) * 0.2;
          break;
      }
      
      // Limitar velocidad con damping
      const maxSpeed = 2 / p.layer;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      // Aplicar resistencia del aire
      p.vx *= 0.999;
      p.vy *= 0.999;
      
      // Wrap around screen con margen
      const margin = 100;
      if (p.y < -margin) {
        p.y = canvas.height + margin;
        p.x = Math.random() * canvas.width;
        p.vx = (Math.random() - 0.5) * config.baseSpeed;
        p.vy = -Math.random() * config.baseSpeed;
      }
      if (p.y > canvas.height + margin) {
        p.y = -margin;
        p.x = Math.random() * canvas.width;
        p.vx = (Math.random() - 0.5) * config.baseSpeed;
        p.vy = -Math.random() * config.baseSpeed;
      }
      if (p.x < -margin) {
        p.x = canvas.width + margin;
      }
      if (p.x > canvas.width + margin) {
        p.x = -margin;
      }
    }
  };

  // Renderizado principal con calidad adaptativa
  const render = (ctx: CanvasRenderingContext2D, quality: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear con fade trail suave
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ordenar partículas por capa para correcto z-index
    const sortedParticles = [...particlesRef.current].sort((a, b) => b.layer - a.layer);
    
    sortedParticles.forEach(p => {
      // Dibujar trail si la calidad lo permite
      if (quality > 0.5 && p.trail.length > 1) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 1; i < p.trail.length; i++) {
          const current = p.trail[i];
          const prev = p.trail[i - 1];
          const alpha = (i / p.trail.length) * current.opacity * 0.3;
          
          ctx.strokeStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha})`;
          ctx.lineWidth = p.size * 0.1;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(current.x, current.y);
          ctx.stroke();
        }
        ctx.restore();
      }
      
      // Dibujar partícula principal
      const pulse = 0.85 + Math.sin(p.pulsePhase) * 0.15;
      drawParticle(ctx, p, pulse, quality);
    });
    
    // Dibujar trail del mouse si se está moviendo
    if (mouseRef.current.moving && mouseRef.current.trail.length > 1 && quality > 0.6) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = 1; i < mouseRef.current.trail.length; i++) {
        const current = mouseRef.current.trail[i];
        const prev = mouseRef.current.trail[i - 1];
        const age = Date.now() - current.time;
        const alpha = Math.max(0, 1 - age / 500) * 0.3;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  // Loop de animación con control de rendimiento
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true, desynchronized: true });
    if (!canvas || !ctx) return;
    
    const deltaTime = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16, 3) : 1;
    lastTimeRef.current = time;
    
    // Control de calidad adaptativo
    const frameTime = deltaTime * 16;
    const perf = performanceRef.current;
    perf.frameTime = perf.frameTime * 0.9 + frameTime * 0.1;
    
    if (perf.frameTime > config.qualityThreshold) {
      perf.adaptiveQuality = Math.max(config.minQuality, perf.adaptiveQuality * 0.98);
    } else if (perf.frameTime < config.qualityThreshold * 0.7) {
      perf.adaptiveQuality = Math.min(config.maxQuality, perf.adaptiveQuality * 1.01);
    }
    
    updateParticles(deltaTime, perf.adaptiveQuality);
    render(ctx, perf.adaptiveQuality);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto principal con gestión de recursos
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      ctx.scale(dpr, dpr);
      
      // Reinicializar partículas en nueva resolución
      initParticles();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
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
        background: 'transparent',
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};
