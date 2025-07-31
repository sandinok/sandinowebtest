// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

// Definición de tipos de partículas con colores y comportamientos mejorados
const PARTICLE_TYPES = {
  bubble: { 
    color: 'rgba(173, 216, 230, 0.8)', // Celeste claro
    shape: 'circle',
    glow: true,
    behavior: 'float'
  },
  leaf: { 
    color: 'rgba(50, 205, 50, 0.8)', // Verde lima
    shape: 'leaf',
    glow: false,
    behavior: 'drift'
  },
  note: { 
    color: 'rgba(255, 215, 0, 0.8)', // Dorado
    shape: 'note',
    glow: true,
    behavior: 'dance'
  }
};

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  // Crear formas SVG como imágenes reutilizables (más detalladas)
  const createSVGImage = (svgString: string): HTMLImageElement => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
    return img;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crear imágenes SVG mejoradas para partículas
    imagesRef.current = {
      bubble: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="white" />
          <circle cx="35" cy="35" r="8" fill="rgba(255,255,255,0.5)" />
        </svg>
      `),
      leaf: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M50,15 C60,5 85,10 80,30 C100,40 90,70 70,65 C80,85 50,95 40,80 C20,85 10,75 15,60 C5,50 10,25 30,30 C25,10 40,5 50,15 Z" fill="white" />
          <path d="M45,25 C50,20 60,22 58,30 C65,35 62,45 55,42 C60,50 50,55 45,50 C40,55 35,50 40,42 C33,45 30,35 37,30 C35,22 40,20 45,25 Z" fill="rgba(255,255,255,0.3)" />
        </svg>
      `),
      note: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M30,20 L70,20 L70,80 L50,65 L30,80 Z" fill="white" />
          <rect x="35" y="30" width="30" height="5" rx="2" fill="black" />
          <rect x="35" y="40" width="20" height="5" rx="2" fill="black" />
          <rect x="35" y="50" width="25" height="5" rx="2" fill="black" />
          <circle cx="55" cy="25" r="3" fill="black" />
        </svg>
      `)
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar partículas con distribución equilibrada
    const initParticles = () => {
      particlesRef.current = [];
      const typeKeys = Object.keys(PARTICLE_TYPES);
      
      // Crear 120 partículas equilibradas (40 de cada tipo)
      for (let i = 0; i < 120; i++) {
        const layer = Math.floor(Math.random() * 3) + 1;
        const layerFactor = 1 / layer;
        const type = typeKeys[Math.floor(i / 40) % typeKeys.length]; // Equilibrar tipos
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5 * layerFactor,
          vy: -Math.random() * 0.5 * layerFactor - 0.05 * layerFactor,
          size: Math.random() * 12 + 8 + (3 - layer) * 4, // Tamaños más coherentes
          type,
          opacity: Math.random() * 0.4 + 0.4, // Opacidad más consistente
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015 * layerFactor,
          layer,
          life: Math.random() * 100,
          // Propiedades para efectos visuales
          pulseSpeed: Math.random() * 0.05 + 0.02,
          hueShift: Math.random() * 30 - 15 // Variación de color
        });
      }
    };

    initParticles();

    // Evento del mouse mejorado
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;
      
      // Crear partículas al mover el mouse con menor frecuencia
      if (Math.abs(mouseRef.current.x - lastMouseRef.current.x) > 10 || 
          Math.abs(mouseRef.current.y - lastMouseRef.current.y) > 10) {
        if (Math.random() > 0.8) { // Menos partículas temporales
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.3,
            size: Math.random() * 6 + 3,
            type: 'bubble',
            opacity: 0.9,
            rotation: 0,
            rotationSpeed: 0,
            layer: 1,
            life: 0,
            pulseSpeed: 0.1,
            hueShift: 0
          });
        }
        lastMouseRef.current.x = mouseRef.current.x;
        lastMouseRef.current.y = mouseRef.current.y;
      }
      
      clearTimeout((mouseRef.current as any).timeout);
      (mouseRef.current as any).timeout = setTimeout(() => {
        mouseRef.current.moving = false;
      }, 150);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Función de dibujo optimizada con efectos mejorados
    const drawParticle = (particle: any) => {
      if (!ctx) return;
      
      const typeConfig = PARTICLE_TYPES[particle.type as keyof typeof PARTICLE_TYPES];
      if (!typeConfig) return;
      
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Efecto de pulso para partículas brillantes
      let currentOpacity = particle.opacity;
      let currentSize = particle.size;
      if (typeConfig.glow) {
        const pulse = Math.sin(particle.life * particle.pulseSpeed) * 0.3 + 0.7;
        currentOpacity *= pulse;
        currentSize *= pulse;
      }
      
      ctx.globalAlpha = currentOpacity;
      
      // Aplicar cambio de tono
      if (particle.hueShift !== 0) {
        ctx.filter = `hue-rotate(${particle.hueShift}deg)`;
      }
      
      // Dibujar partícula usando imagen SVG
      const img = imagesRef.current[particle.type];
      if (img && img.complete) {
        const size = currentSize * 2;
        ctx.drawImage(img, -size/2, -size/2, size, size);
        
        // Agregar brillo adicional para partículas con glow
        if (typeConfig.glow) {
          ctx.globalAlpha = currentOpacity * 0.3;
          ctx.filter = 'blur(6px) brightness(1.5)';
          ctx.drawImage(img, -size/2, -size/2, size, size);
        }
      }
      
      ctx.restore();
    };

    // Animación optimizada con física mejorada
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpiar con un fondo semitransparente para efecto de motion blur suave
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas por capas
      for (let layer = 3; layer >= 1; layer--) {
        particlesRef.current
          .filter((p: any) => p.layer === layer)
          .forEach((particle: any, index: number) => {
            // Actualizar propiedades de la partícula
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.life += 1;
            
            // Interacción con el mouse más suave
            if (mouseRef.current.moving && layer === 1) {
              const dx = mouseRef.current.x - particle.x;
              const dy = mouseRef.current.y - particle.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 120) {
                const force = 0.2 * (1 - dist / 120);
                particle.vx += -dx * force / dist * 0.3;
                particle.vy += -dy * force / dist * 0.3;
              }
            }
            
            // Comportamiento específico por tipo con física mejorada
            switch (particle.type) {
              case 'bubble':
                particle.vy -= 0.003 / particle.layer; // Flotación más suave
                particle.vx += Math.sin(Date.now() * 0.0008 + index) * 0.002;
                break;
              case 'leaf':
                particle.vx += Math.sin(Date.now() * 0.0007 + index) * 0.01;
                particle.vy += 0.002 / particle.layer; // Caída más lenta
                particle.rotationSpeed = Math.sin(Date.now() * 0.0004 + index) * 0.008;
                break;
              case 'note':
                particle.vx = Math.sin(Date.now() * 0.0009 + index) * 0.15 / particle.layer;
                particle.vy -= 0.0015 / particle.layer; // Ascenso más suave
                break;
            }
            
            // Limitar velocidad con mayor suavidad
            const maxSpeed = 1.5 / particle.layer;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
              particle.vx = (particle.vx / speed) * maxSpeed;
              particle.vy = (particle.vy / speed) * maxSpeed;
            }
            
            // Resetear partículas fuera de pantalla con márgenes
            const margin = 80;
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
            
            // Eliminar partículas temporales después de un tiempo
            if (particle.layer === 1 && particle.life > 80) {
              const particleIndex = particlesRef.current.indexOf(particle);
              if (particleIndex > -1) {
                particlesRef.current.splice(particleIndex, 1);
                return;
              }
            }
            
            // Dibujar partícula
            drawParticle(particle);
          });
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Iniciar animación cuando las imágenes estén cargadas
    const startAnimation = () => {
      let allLoaded = true;
      Object.values(imagesRef.current).forEach(img => {
        if (!img.complete) allLoaded = false;
      });
      
      if (allLoaded) {
        animate();
      } else {
        setTimeout(startAnimation, 100);
      }
    };

    startAnimation();

    // Limpiar efectos
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
      clearTimeout((mouseRef.current as any).timeout);
      
      // Liberar URLs de objetos SVG
      Object.values(imagesRef.current).forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });
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
