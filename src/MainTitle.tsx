// src/components/MainTitle.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type MainTitleProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

export const MainTitle: React.FC<MainTitleProps> = ({
  title = 'Sandino',
  subtitle = 'Digital Artist & Content Creator',
  className = '',
}) => {
  // Sparkles precomputed (few, light, very smooth)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        dx: (Math.random() - 0.5) * 6,
        dur: 3.4 + Math.random() * 1.0,
        delay: 1.0 + Math.random() * 1.5,
        hue: 195 + Math.floor(Math.random() * 20), // soft cyan-blue
        a: 0.18 + Math.random() * 0.16,
      })),
    []
  );

  // Fixed ultra‑bright gradient: pure white for maximum legibility (no tint)
  const gradient = 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)';

  return (
    <div
      className={[
        'absolute left-1/2 -translate-x-1/2 text-center z-30 px-4',
        'top-16 md:top-20 lg:top-24',
        'will-change-transform',
        className,
      ].join(' ')}
    >
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="relative inline-block"
      >
        {/* Ambient glow (brighter, tighter, still very light) */}
        <motion.div
          aria-hidden
          className="absolute -inset-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 25%, rgba(255,255,255,0.35) 0%, rgba(224, 244, 255, 0.28) 36%, rgba(255, 238, 248, 0.22) 62%, transparent 100%)',
            filter: 'blur(18px)',
          }}
          animate={{ opacity: [0.5, 0.62, 0.5], scale: [1, 1.01, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Title (no vertical bob, only BG scroll — eliminates jitter) */}
        <h1
          className="text-[48px] sm:text-[64px] md:text-[88px] lg:text-[104px] font-bold mb-3 md:mb-4 select-none leading-none relative"
          style={{
            fontFamily: "'Dancing Script', cursive",
            WebkitTextStroke: '2px rgba(255,255,255,0.95)',
            textShadow: '0 2px 8px rgba(0,0,0,0.28)'
          }}
        >
          <span
            className="inline-block"
            style={{
              color: '#FFFFFF'
            }}
          >
            {title}
          </span>
        </h1>

        {/* Remove extra sheen scroller to avoid any shimmer jitter */}

        {/* Sparkles removidos para 0 coste de animación */}
      </motion.div>

      {/* Divider removed per request */}

      {/* Subtitle (tiny lift, quick settle) */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        className="text-sm sm:text-base md:text-lg text-white/95 font-light tracking-wide px-4"
        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}
      >
        {subtitle}
      </motion.p>

      {/* Reduced motion support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MainTitle;
