// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

// Tipos de partículas con sus propiedades visuales
const PARTICLE_TYPES = {
  bubble: { 
    color: 'rgba(173, 216, 230, 0.7)', // Light blue
    shape: 'circle',
    glow: true
  },
  leaf: { 
    color: 'rgba(50, 205, 50, 0.7)', // Lime green
    shape: 'leaf',
    glow: false
  },
  note: { 
    color: 'rgba(255, 215, 0, 0.7)', // Gold
    shape: 'note',
    glow: true
  }
};

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  // Crear formas SVG como imágenes reutilizables
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

    // Crear imágenes SVG para partículas
    imagesRef.current = {
      bubble: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="white" />
        </svg>
      `),
      leaf: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M50,15 C60,5 85,10 80,30 C100,40 90,70 70,65 C80,85 50,95 40,80 C20,85 10,75 15,60 C5,50 10,25 30,30 C25,10 40,5 50,15 Z" fill="white" />
        </svg>
      `),
      note: createSVGImage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M30,20 L70,20 L70,80 L50,65 L30,80 Z" fill="white" />
          <rect x="35" y="30" width="30" height="5" fill="black" />
          <rect x="35" y="40" width="20" height="5" fill="black" />
          <rect x="35" y="50" width="25" height="5" fill="black" />
        </svg>
      `)
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar partículas
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 100; i++) {
        const layer = Math.floor(Math.random() * 3) + 1;
        const layerFactor = 1 / layer;
        const types = Object.keys(PARTICLE_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6 * layerFactor,
          vy: -Math.random() * 0.6 * layerFactor - 0.1 * layerFactor,
          size: Math.random() * 15 + 10 + (4 - layer) * 5,
          type,
          opacity: Math.random() * 0.5 + 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02 * layerFactor,
          layer,
          life: Math.random() * 100, // Para efectos de brillo pulsante
        });
      }
    };

    initParticles();

    // Evento del mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;
      
      // Crear partículas al mover el mouse
      if (Math.abs(mouseRef.current.x - lastMouseRef.current.x) > 5 || 
          Math.abs(mouseRef.current.y - lastMouseRef.current.y) > 5) {
        if (Math.random() > 0.7) {
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: Math.random() * 8 + 4,
            type: 'bubble',
            opacity: 0.9,
            rotation: 0,
            rotationSpeed: 0,
            layer: 1,
            life: 0
          });
        }
        lastMouseRef.current.x = mouseRef.current.x;
        lastMouseRef.current.y = mouseRef.current.y;
      }
      
      clearTimeout((mouseRef.current as any).timeout);
      (mouseRef.current as any).timeout = setTimeout(() => {
        mouseRef.current.moving = false;
      }, 100);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Función de dibujo optimizada
    const drawParticle = (particle: any) => {
      if (!ctx) return;
      
      const typeConfig = PARTICLE_TYPES[particle.type as keyof typeof PARTICLE_TYPES];
      if (!typeConfig) return;
      
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Efecto de brillo pulsante para partículas seleccionadas
      let currentOpacity = particle.opacity;
      if (typeConfig.glow) {
        const pulse = Math.sin(particle.life * 0.1) * 0.2 + 0.8;
        currentOpacity *= pulse;
      }
      
      ctx.globalAlpha = currentOpacity;
      
      // Aplicar efecto de desenfoque para brillo
      if (typeConfig.glow) {
        ctx.filter = 'blur(2px)';
      }
      
      // Dibujar partícula usando imagen SVG
      const img = imagesRef.current[particle.type];
      if (img && img.complete) {
        const size = particle.size;
        ctx.drawImage(img, -size/2, -size/2, size, size);
        
        // Agregar brillo adicional
        if (typeConfig.glow) {
          ctx.filter = 'blur(8px)';
          ctx.globalAlpha = currentOpacity * 0.4;
          ctx.drawImage(img, -size/2, -size/2, size, size);
        }
      }
      
      ctx.restore();
    };

    // Animación optimizada
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpiar con un fondo semitransparente para efecto de motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas por capas (de atrás hacia adelante)
      for (let layer = 3; layer >= 1; layer--) {
        particlesRef.current
          .filter((p: any) => p.layer === layer)
          .forEach((particle: any, index: number) => {
            // Actualizar propiedades de la partícula
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.life += 1;
            
            // Interacción con el mouse (solo para partículas frontales)
            if (mouseRef.current.moving && layer === 1) {
              const dx = mouseRef.current.x - particle.x;
              const dy = mouseRef.current.y - particle.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 150) {
                const force = 0.3 * (1 - dist / 150);
                particle.vx += -dx * force / dist;
                particle.vy += -dy * force / dist;
              }
            }
            
            // Comportamiento específico por tipo
            if (particle.type === 'bubble') {
              particle.vy -= 0.005 / particle.layer;
              particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.003;
            } else if (particle.type === 'leaf') {
              particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.015;
              particle.vy += 0.003 / particle.layer;
              particle.rotationSpeed = Math.sin(Date.now() * 0.0005 + index) * 0.01;
            } else if (particle.type === 'note') {
              particle.vx = Math.sin(Date.now() * 0.001 + index) * 0.2 / particle.layer;
              particle.vy -= 0.002 / particle.layer;
            }
            
            // Limitar velocidad
            const maxSpeed = 2 / particle.layer;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
              particle.vx = (particle.vx / speed) * maxSpeed;
              particle.vy = (particle.vy / speed) * maxSpeed;
            }
            
            // Resetear partículas fuera de pantalla
            const margin = 100;
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
            
            // Eliminar partículas creadas por el mouse después de un tiempo
            if (particle.layer === 1 && particle.life > 100) {
              const index = particlesRef.current.indexOf(particle);
              if (index > -1) {
                particlesRef.current.splice(index, 1);
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
