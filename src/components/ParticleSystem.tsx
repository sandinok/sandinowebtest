
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partículas de diferentes tipos
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'bubble' | 'leaf' | 'note' | 'sparkle';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Crear partículas iniciales
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 10 + 5,
        type: ['bubble', 'leaf', 'note', 'sparkle'][Math.floor(Math.random() * 4)] as any,
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Resetear partículas que salen de la pantalla
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < -50 || particle.x > canvas.width + 50) {
          particle.x = Math.random() * canvas.width;
        }

        // Dibujar partícula según tipo
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;

        switch (particle.type) {
          case 'bubble':
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(173, 216, 230, 0.6)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

          case 'leaf':
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size * 0.6, particle.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 197, 94, 0.7)`;
            ctx.fill();
            break;

          case 'note':
            ctx.fillStyle = `rgba(147, 197, 253, 0.8)`;
            ctx.font = `${particle.size}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('♪', 0, particle.size / 3);
            break;

          case 'sparkle':
            ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
