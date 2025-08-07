// src/components/ParticleSystem.tsx
import React, { useEffect, useRef } from 'react';

/*
Ultra-light particles for SkyDawn:
- Pure stars + very rare meteors.
- Fully transparent rendering (no background fill), screen blend.
- DPR-aware, throttled resize, minimal allocations, short trails.
- Early bail-outs, fewer draw ops, reduced glow, batched state changes.
*/

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  a: number;          // base opacity
  layer: number;      // 1..L
  type: 0 | 1;        // 0=star, 1=meteor
  pp: number;         // pulse phase
  ps: number;         // pulse speed
  trail?: { x: number; y: number }[];
};

export const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const partsRef = useRef<Particle[]>([]);
  const lastRef = useRef<number>(0);
  const dimRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef<number>(1);

  // Tuned for transparency + minimal GPU/CPU
  const CFG = {
    COUNT: 32,            // fewer particles
    LAYERS: 3,            // subtle depth
    SPEED: 0.07,          // gentle drift
    SIZE_MIN: 1.2,
    SIZE_MAX: 3.2,
    METEOR_CHANCE: 0.003, // very rare
    TRAIL_MAX: 5,
    GLOW: 5,              // small blur
    // Colors balanced for sky-dawn; all rendered with screen blend
    STAR_CORE: 'rgba(255,255,255,0.85)',
    STAR_GLOW: 'rgba(170,200,255,0.45)',
    METEOR_CORE: 'rgba(255,245,210,0.9)',
    METEOR_TRAIL_0: 'rgba(170,200,255,0.45)',
    METEOR_TRAIL_1: 'rgba(120,180,255,0.0)',
  };

  const rnd = (min: number, max: number) => min + Math.random() * (max - min);

  const makeParticle = (w: number, h: number, layer: number): Particle => {
    const isMeteor = Math.random() < CFG.METEOR_CHANCE;
    const lf = 0.5 + (layer - 1) * 0.25; // layer factor
    return {
      x: Math.random() * w,
      y: isMeteor ? -10 : Math.random() * h,
      vx: (Math.random() - 0.5) * CFG.SPEED * lf * (isMeteor ? 8 : 1),
      vy: (0.4 + Math.random() * 0.6) * CFG.SPEED * lf * (isMeteor ? 7 : 1),
      size: rnd(CFG.SIZE_MIN, CFG.SIZE_MAX) * (1 + (layer - 1) * 0.2),
      a: 0.55 + Math.random() * 0.35,
      layer,
      type: isMeteor ? 1 : 0,
      ps: rnd(0.001, 0.002),
      pp: Math.random() * Math.PI * 2,
      trail: isMeteor ? [] : undefined,
    };
  };

  const init = (w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < CFG.COUNT; i++) {
      const layer = (Math.floor(Math.random() * CFG.LAYERS) + 1);
      arr.push(makeParticle(w, h, layer));
    }
    partsRef.current = arr;
  };

  const update = (dt: number, w: number, h: number) => {
    const p = partsRef.current;
    for (let i = p.length - 1; i >= 0; i--) {
      const it = p[i];
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      it.pp += it.ps * dt;

      if (it.type === 1 && it.trail) {
        it.trail.push({ x: it.x, y: it.y });
        if (it.trail.length > CFG.TRAIL_MAX) it.trail.shift();
        if (it.y > h + it.size * 2 || it.x < -it.size * 2 || it.x > w + it.size * 2) {
          p.splice(i, 1);
          continue;
        }
      } else {
        // wrap stars
        const s2 = it.size * 2;
        if (it.x < -s2) it.x = w + s2;
        else if (it.x > w + s2) it.x = -s2;
        if (it.y < -s2) it.y = h + s2;
        else if (it.y > h + s2) it.y = -s2;
      }
    }
    // very occasional meteor
    if (Math.random() < CFG.METEOR_CHANCE) {
      const layer = (Math.floor(Math.random() * CFG.LAYERS) + 1);
      p.push(makeParticle(w, h, layer));
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Transparent overlay: do not fill background
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';

    // Batch: set shadow once (we adjust intensity per type by alpha)
    ctx.shadowBlur = CFG.GLOW;

    // Render by layer for subtle depth alpha
    for (let layer = 1; layer <= CFG.LAYERS; layer++) {
      const arr = partsRef.current;
      for (let i = 0; i < arr.length; i++) {
        const it = arr[i];
        if (it.layer !== layer) continue;

        // micro-pulse
        const pulse = 1 + Math.sin(it.pp) * 0.06;
        const r = it.size * pulse;

        ctx.save();
        ctx.globalAlpha = it.a;

        if (it.type === 0) {
          // star
          ctx.translate(it.x, it.y);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4);
          grad.addColorStop(0, CFG.STAR_CORE);
          grad.addColorStop(1, CFG.STAR_GLOW);
          ctx.fillStyle = grad;
          ctx.shadowColor = CFG.STAR_CORE;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // meteor
          ctx.translate(it.x, it.y);
          ctx.fillStyle = CFG.METEOR_CORE;
          ctx.shadowColor = CFG.METEOR_CORE;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
          ctx.fill();

          if (it.trail && it.trail.length > 1) {
            const grad = ctx.createLinearGradient(0, 0, -it.vx * 16, -it.vy * 16);
            grad.addColorStop(0, CFG.METEOR_TRAIL_0);
            grad.addColorStop(1, CFG.METEOR_TRAIL_1);
            ctx.strokeStyle = grad;
            ctx.lineWidth = Math.max(1, it.size * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let j = it.trail.length - 1; j >= 0; j--) {
              const t = it.trail[j];
              ctx.lineTo(t.x - it.x, t.y - it.y);
            }
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    }
  };

  const loop = (t: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dt = lastRef.current ? Math.min((t - lastRef.current) / 16.67, 2) : 1;
    lastRef.current = t;

    update(dt, canvas.width, canvas.height);
    draw(ctx, canvas.width, canvas.height);

    rafRef.current = requestAnimationFrame(loop);
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
        // scale existing particles proportionally
        const ow = dimRef.current.w || w;
        const oh = dimRef.current.h || h;
        const sx = ow ? w / ow : 1;
        const sy = oh ? h / oh : 1;
        for (const it of partsRef.current) {
          it.x *= sx;
          it.y *= sy;
          if (it.trail) {
            for (const pt of it.trail) {
              pt.x *= sx;
              pt.y *= sy;
            }
          }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        dimRef.current = { w, h };
      }
    };

    // Initial setup
    resize();
    init(canvas.width, canvas.height);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    // Throttled resize
    let rr = 0;
    const onResize = () => {
      cancelAnimationFrame(rr);
      rr = requestAnimationFrame(resize);
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
