// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

/*
Particle system simplified, balanced, and color-matched for the SkyBackground:
- Fewer particles with layered parallax for depth.
- Soft stars + rare meteors only (removed leaves/notes/bubbles to avoid visual noise).
- Colors match celestial blue/teal palette of sky-dawn shader.
- Screen blend, DPR-aware canvas, throttled resize, minimal allocations.
- Wave overlay removed here (background already handles atmosphere/waves).
*/

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  layer: number;
  type: 'star' | 'meteor';
  pulseSpeed: number;
  pulsePhase: number;
  trail?: { x: number; y: number }[];
};

export const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const prevDimRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef<number>(1);

  // Tuned for the sky-dawn background
  const config = {
    particleCount: 48, // compact and light
    layers: 3,         // depth without clutter
    baseSpeed: 0.09,   // gentle drift
    size: { min: 1.5, max: 3.8 }, // tiny, star-like
    meteorChance: 0.006, // rare
    colors: {
      starCore: 'rgba(255,255,255,0.95)',
      starGlow: 'rgba(180,210,255,0.55)',
      meteorCore: 'rgba(255,245,210,0.95)',
      meteorTrail0: 'rgba(180,210,255,0.55)',
      meteorTrail1: 'rgba(120,190,255,0.0)',
    },
    glowBlur: 8,
    maxTrail: 7,
  };

  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  const createParticle = (w: number, h: number, layer: number): Particle => {
    const isMeteor = Math.random() < config.meteorChance;
    const lf = 0.55 + (layer - 1) * 0.25; // layer factor
    return {
      x: Math.random() * w,
      y: isMeteor ? -10 : Math.random() * h,
      vx: (Math.random() - 0.5) * config.baseSpeed * lf * (isMeteor ? 10 : 1),
      vy: (0.4 + Math.random() * 0.6) * config.baseSpeed * lf * (isMeteor ? 9 : 1),
      size: rand(config.size.min, config.size.max) * (1 + (layer - 1) * 0.25),
      opacity: 0.65 + Math.random() * 0.35,
      layer,
      type: isMeteor ? 'meteor' : 'star',
      pulseSpeed: rand(0.0012, 0.0028),
      pulsePhase: Math.random() * Math.PI * 2,
      trail: isMeteor ? [] : undefined,
    };
  };

  const initParticles = (w: number, h: number) => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      particlesRef.current.push(createParticle(w, h, layer));
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, p: Particle, pulse: number) => {
    const r = p.size * pulse;
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.6);
    grd.addColorStop(0, config.colors.starCore);
    grd.addColorStop(1, config.colors.starGlow);
    ctx.fillStyle = grd;
    ctx.shadowColor = config.colors.starCore;
    ctx.shadowBlur = config.glowBlur;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawMeteor = (ctx: CanvasRenderingContext2D, p: Particle) => {
    const r = p.size * 0.7;
    ctx.fillStyle = config.colors.meteorCore;
    ctx.shadowColor = config.colors.meteorCore;
    ctx.shadowBlur = config.glowBlur + 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    if (p.trail && p.trail.length > 1) {
      const grad = ctx.createLinearGradient(0, 0, -p.vx * 18, -p.vy * 18);
      grad.addColorStop(0, config.colors.meteorTrail0);
      grad.addColorStop(1, config.colors.meteorTrail1);
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, p.size * 0.35);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let i = p.trail.length - 1; i >= 0; i--) {
        const t = p.trail[i];
        ctx.lineTo(t.x - p.x, t.y - p.y);
      }
      ctx.stroke();
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle, pulse: number) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    if (p.type === 'star') {
      drawStar(ctx, p, pulse);
    } else {
      drawMeteor(ctx, p);
    }
    ctx.restore();
  };

  const update = (dt: number, w: number, h: number) => {
    const parts = particlesRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.pulsePhase += p.pulseSpeed * dt;

      if (p.type === 'meteor' && p.trail) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > config.maxTrail) p.trail.shift();
        if (p.y > h + p.size * 2 || p.x < -p.size * 2 || p.x > w + p.size * 2) {
          parts.splice(i, 1);
          continue;
        }
      } else {
        // wrap for stars
        if (p.x < -p.size * 2) p.x = w + p.size * 2;
        else if (p.x > w + p.size * 2) p.x = -p.size * 2;
        if (p.y < -p.size * 2) p.y = h + p.size * 2;
        else if (p.y > h + p.size * 2) p.y = -p.size * 2;
      }
    }

    // occasional meteor
    if (Math.random() < config.meteorChance) {
      const layer = Math.floor(Math.random() * config.layers) + 1;
      parts.push(createParticle(w, h, layer));
    }
  };

  const animate = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = lastTimeRef.current ? Math.min((t - lastTimeRef.current) / 16.67, 2) : 1;
    lastTimeRef.current = t;

    const w = canvas.width;
    const h = canvas.height;

    // Clear only with alpha to let WebGL background show through
    ctx.clearRect(0, 0, w, h);

    update(dt, w, h);

    // render by layers for subtle parallax bias
    for (let layer = 1; layer <= config.layers; layer++) {
      const layerAlpha = 0.5 + layer * 0.15;
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = layerAlpha;
      for (const p of particlesRef.current) {
        if (p.layer !== layer) continue;
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.08;
        drawParticle(ctx, p, pulse);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const dpr = dprRef.current;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        // scale existing particles to new size smoothly
        const oldW = prevDimRef.current.w || w;
        const oldH = prevDimRef.current.h || h;
        const sx = w / oldW;
        const sy = h / oldH;
        if (prevDimRef.current.w && prevDimRef.current.h) {
          for (const p of particlesRef.current) {
            p.x *= sx;
            p.y *= sy;
            if (p.trail) {
              for (const pt of p.trail) {
                pt.x *= sx;
                pt.y *= sy;
              }
            }
          }
        }
        prevDimRef.current = { w, h };
      }
    };

    resize();
    initParticles(canvas.width, canvas.height);

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        mixBlendMode: 'screen',
        background: 'transparent',
      }}
    />
  );
};
