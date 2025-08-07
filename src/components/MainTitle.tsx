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
  // Sparkles precomputed (no re-renders jitter)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        dx: (Math.random() - 0.5) * 10,
        dur: 2.2 + Math.random() * 1.2,
        delay: 1.2 + Math.random() * 1.2,
        hue: 200 + Math.floor(Math.random() * 30),
        a: 0.28 + Math.random() * 0.22,
      })),
    []
  );

  return (
    <div
      className={[
        'absolute left-1/2 -translate-x-1/2 text-center z-30 px-4',
        'top-16 md:top-20 lg:top-24',
        className,
      ].join(' ')}
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        className="relative inline-block"
      >
        {/* Ambient glow (static + subtle breathing, no layout thrash) */}
        <motion.div
          aria-hidden
          className="absolute -inset-6 md:-inset-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 25%, rgba(99,179,237,0.26) 0%, rgba(129,140,248,0.2) 40%, rgba(16,185,129,0.14) 70%, transparent 100%)',
            filter: 'blur(22px)',
          }}
          animate={{ opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Title */}
        <h1
          className="text-[56px] sm:text-[72px] md:text-[96px] lg:text-[112px] font-bold mb-3 md:mb-4 select-none leading-none relative"
          style={{
            fontFamily: "'Dancing Script', cursive",
            WebkitTextStroke: '1px rgba(255,255,255,0.12)',
            textShadow:
              '0 8px 28px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.32)',
          }}
        >
          <motion.span
            className="bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #bae6fd 0%, #e9d5ff 40%, #a7f3d0 80%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ y: [0, -2, 0], backgroundPositionX: ['0%', '200%', '0%'] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {title}
          </motion.span>
        </h1>

        {/* Sheen line (GPU-only anim) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-1 bottom-6 md:bottom-8 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 10%, transparent 20%)',
            WebkitMaskImage:
              'radial-gradient(80% 100% at 50% 0%, black 32%, transparent 80%)',
          }}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Sparkles (very light) */}
        <div className="absolute inset-x-0 -bottom-1 md:-bottom-2 h-14 overflow-visible -z-10 pointer-events-none">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${s.x}%`,
                backgroundColor: `hsla(${s.hue},85%,75%,${s.a})`,
                boxShadow: `0 0 10px hsla(${s.hue},85%,75%,${s.a * 0.9})`,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-14, -26], opacity: [0, 1, 0], x: [0, s.dx] }}
              transition={{
                duration: s.dur,
                delay: s.delay,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Divider (transform for perf) */}
      <motion.div
        className="mx-auto mb-4 md:mb-5 rounded-full"
        style={{
          width: 120,
          height: 4,
          background:
            'linear-gradient(90deg, transparent, rgba(191,219,254,0.85), transparent)',
          boxShadow: '0 0 22px rgba(191,219,254,0.42)',
          transformOrigin: 'center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.55, ease: 'easeOut' }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
        className="text-base sm:text-lg md:text-xl text-white/95 font-light tracking-wide px-4"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}
      >
        {subtitle}
      </motion.p>

      {/* Reduced motion support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce\\:stop-anim * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainTitle;
