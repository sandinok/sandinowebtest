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
        {/* Ambient glow (single layer, subtle breathing) */}
        <motion.div
          aria-hidden
          className="absolute -inset-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 25%, rgba(125, 196, 255, 0.18) 0%, rgba(167, 139, 250, 0.14) 40%, rgba(52, 211, 153, 0.10) 70%, transparent 100%)',
            filter: 'blur(22px)',
          }}
          animate={{ opacity: [0.5, 0.62, 0.5], scale: [1, 1.015, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Title (no vertical bob, only BG scroll — eliminates jitter) */}
        <h1
          className="text-[48px] sm:text-[64px] md:text-[88px] lg:text-[104px] font-bold mb-3 md:mb-4 select-none leading-none relative"
          style={{
            fontFamily: "'Dancing Script', cursive",
            WebkitTextStroke: '1px rgba(255,255,255,0.08)',
            textShadow: '0 5px 22px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.26)',
          }}
        >
          <motion.span
            className="bg-clip-text text-transparent inline-block will-change-transform"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #c9ecff 0%, #eedbff 40%, #bffae1 80%)',
              backgroundSize: '200% 100%',
              transform: 'translateZ(0)',
            }}
            animate={{ backgroundPositionX: ['0%', '200%', '0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            {title}
          </motion.span>
        </h1>

        {/* Gentle sheen (very low opacity, long cycle) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-1 bottom-7 md:bottom-9 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 10%, transparent 22%)',
            WebkitMaskImage:
              'radial-gradient(75% 100% at 50% 0%, black 28%, transparent 80%)',
          }}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />

        {/* Sparkles (few, slow, tiny) */}
        <div className="absolute inset-x-0 -bottom-1 md:-bottom-2 h-12 overflow-visible -z-10 pointer-events-none">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                width: '2px',
                height: '2px',
                backgroundColor: `hsla(${s.hue},85%,80%,${s.a})`,
                boxShadow: `0 0 6px hsla(${s.hue},85%,80%,${s.a * 0.9})`,
                willChange: 'transform, opacity',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-8, -16], opacity: [0, 1, 0], x: [0, s.dx] }}
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

      {/* Divider (transform-only anim, short and smooth) */}
      <motion.div
        className="mx-auto mb-3 md:mb-4 rounded-full"
        style={{
          width: 104,
          height: 3,
          background:
            'linear-gradient(90deg, transparent, rgba(191,219,254,0.75), transparent)',
          boxShadow: '0 0 14px rgba(191,219,254,0.35)',
          transformOrigin: 'center',
        }}
        initial={{ scaleX: 0.5, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
      />

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
