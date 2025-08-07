// src/components/MainTitle.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type MainTitleProps = {
  title?: string;
  subtitle?: string;
};

export const MainTitle: React.FC<MainTitleProps> = ({
  title = 'Sandino',
  subtitle = 'Digital Artist & Content Creator',
}) => {
  // Precompute small random offsets for sparkle particles (no reflow on every render)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        dx: (Math.random() - 0.5) * 14,
        d: 2.6 + Math.random() * 1.6,
        delay: 1.8 + Math.random() * 1.8,
        hue: 200 + Math.floor(Math.random() * 40), // blue-teal range
        alpha: 0.35 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.35,
        type: 'spring',
        stiffness: 120,
        damping: 16,
      }}
      className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 text-center z-30 px-4"
    >
      <div className="relative inline-block">
        {/* Soft ambient glow (GPU friendly, static + slight breathing) */}
        <motion.div
          className="absolute -inset-6 md:-inset-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 25%, rgba(99,179,237,0.28) 0%, rgba(129,140,248,0.22) 35%, rgba(16,185,129,0.16) 70%, transparent 100%)',
            filter: 'blur(24px)',
          }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Title */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-3 md:mb-4 relative select-none z-10 leading-none"
          style={{
            fontFamily: "'Dancing Script', cursive",
            WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            textShadow:
              '0 8px 30px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.35)',
          }}
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #bae6fd 0%, #e9d5ff 40%, #a7f3d0 80%)',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 50%',
            }}
          >
            {title}
          </span>
        </motion.h1>

        {/* Subtle animated gradient sheen across the title (separate layer to avoid layout thrash) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-2 bottom-6 md:bottom-8 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 10%, transparent 20%)',
            WebkitMaskImage:
              'radial-gradient(80% 100% at 50% 0%, black 30%, transparent 80%)',
          }}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Sparkle particles (very light) */}
        <div className="absolute inset-x-0 -bottom-2 md:-bottom-3 h-16 overflow-visible -z-10 pointer-events-none">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${s.x}%`,
                backgroundColor: `hsla(${s.hue}, 85%, 75%, ${s.alpha})`,
                boxShadow: `0 0 10px hsla(${s.hue}, 85%, 75%, ${s.alpha * 0.9})`,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [-18, -34],
                opacity: [0, 1, 0],
                x: [0, s.dx],
              }}
              transition={{
                duration: s.d,
                delay: s.delay,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Divider line (uses transform instead of width anim for perf) */}
      <motion.div
        className="mx-auto mb-5 md:mb-6 rounded-full"
        style={{
          width: 128,
          height: 4,
          background:
            'linear-gradient(90deg, transparent, rgba(191,219,254,0.85), transparent)',
          boxShadow: '0 0 24px rgba(191,219,254,0.45)',
          transformOrigin: 'center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
        className="text-lg sm:text-xl md:text-2xl text-white/95 font-light tracking-wide px-4"
        style={{
          textShadow: '0 2px 10px rgba(0,0,0,0.45)',
        }}
      >
        {subtitle}
      </motion.p>

      {/* Respect user prefers-reduced-motion via utility class (optional if you have it) */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce\\:stop-anim * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default MainTitle;
