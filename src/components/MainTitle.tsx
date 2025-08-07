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
  // Precompute sparkles once to avoid layout jitter
  const sparkles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        dx: (Math.random() - 0.5) * 8, // smaller drift to prevent glitch feel
        dur: 2.4 + Math.random() * 0.9,
        delay: 1 + Math.random() * 1.2,
        hue: 200 + Math.floor(Math.random() * 24),
        a: 0.24 + Math.random() * 0.18,
      })),
    []
  );

  return (
    <div
      className={[
        'absolute left-1/2 -translate-x-1/2 text-center z-30 px-4',
        'top-16 md:top-20 lg:top-24',
        'will-change-transform', // hint GPU
        className,
      ].join(' ')}
    >
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="relative inline-block"
      >
        {/* Ambient glow (stabilized, no background animation swapping) */}
        <motion.div
          aria-hidden
          className="absolute -inset-6 md:-inset-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 25%, rgba(99,179,237,0.22) 0%, rgba(129,140,248,0.18) 40%, rgba(16,185,129,0.12) 70%, transparent 100%)',
            filter: 'blur(20px)',
          }}
          animate={{ opacity: [0.5, 0.65, 0.5], scale: [1, 1.02, 1] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Title (reduced motion amplitude, background gradient scroll only) */}
        <h1
          className="text-[52px] sm:text-[68px] md:text-[92px] lg:text-[108px] font-bold mb-3 md:mb-4 select-none leading-none relative"
          style={{
            fontFamily: "'Dancing Script', cursive",
            WebkitTextStroke: '1px rgba(255,255,255,0.10)',
            textShadow:
              '0 6px 24px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.28)',
          }}
        >
          <motion.span
            className="bg-clip-text text-transparent inline-block will-change-transform"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #bfe3fe 0%, #ead7ff 40%, #b7f7d6 80%)',
              backgroundSize: '200% 100%',
              transform: 'translateZ(0)', // eliminate subpixel jitter
            }}
            animate={{
              backgroundPositionX: ['0%', '200%', '0%'],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear', // linear avoids easing glitches on BG scroll
            }}
          >
            {title}
          </motion.span>
        </h1>

        {/* Sheen line (lighter, reduced mask to avoid harsh edges) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-1 bottom-6 md:bottom-8 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 10%, transparent 22%)',
            WebkitMaskImage:
              'radial-gradient(75% 100% at 50% 0%, black 30%, transparent 80%)',
          }}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />

        {/* Sparkles (fewer, smaller, slower) */}
        <div className="absolute inset-x-0 -bottom-1 md:-bottom-2 h-12 overflow-visible -z-10 pointer-events-none">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                width: '3px',
                height: '3px',
                backgroundColor: `hsla(${s.hue},85%,75%,${s.a})`,
                boxShadow: `0 0 8px hsla(${s.hue},85%,75%,${s.a * 0.85})`,
                willChange: 'transform, opacity',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-10, -20], opacity: [0, 1, 0], x: [0, s.dx] }}
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

      {/* Divider (transform-based anim only) */}
      <motion.div
        className="mx-auto mb-4 md:mb-5 rounded-full"
        style={{
          width: 112,
          height: 4,
          background:
            'linear-gradient(90deg, transparent, rgba(191,219,254,0.82), transparent)',
          boxShadow: '0 0 18px rgba(191,219,254,0.38)',
          transformOrigin: 'center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
      />

      {/* Subtitle (reduced motion) */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
        className="text-base sm:text-lg md:text-xl text-white/95 font-light tracking-wide px-4"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
      >
        {subtitle}
      </motion.p>

      {/* Respect reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform { will-change: auto !important; }
          * { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MainTitle;
