// src/components/ShimmerEffect.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ShimmerEffectProps {
  className?: string;
  duration?: number;   // seconds
  delay?: number;      // seconds
  angleDeg?: number;   // 0..360
  intensity?: number;  // 0..1 (controls brightness)
  widthPct?: number;   // 5..40 (beam width %)
  repeatDelay?: number; // seconds between passes
  disabled?: boolean;  // disable animation
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  className = '',
  duration = 2.8,
  delay = 0,
  angleDeg = 20,
  intensity = 0.22,
  widthPct = 22,
  repeatDelay = 0.6,
  disabled = false,
}) => {
  // Clamp & precompute values
  const { angle, width, alphaSoft, alphaCore } = useMemo(() => {
    const a = Math.max(0, Math.min(360, angleDeg));
    const w = Math.max(5, Math.min(40, widthPct));
    const i = Math.max(0, Math.min(1, intensity));
    return {
      angle: a,
      width: w,
      alphaSoft: 0.12 * i,
      alphaCore: 0.38 * i,
    };
  }, [angleDeg, widthPct, intensity]);

  // Build gradient frames once (avoid object churn)
  const frames = useMemo(() => {
    // Soft feather on sides, bright core in the middle
    const gBase = (a: number, core: number, soft: number) =>
      `linear-gradient(${a}deg, 
        transparent 0%,
        rgba(255,255,255,0) ${50 - width - 10}%,
        rgba(255,255,255,${soft}) ${50 - width}%,
        rgba(255,255,255,${core}) 50%,
        rgba(255,255,255,${soft}) ${50 + width}%,
        rgba(255,255,255,0) ${50 + width + 10}%,
        transparent 100%)`;

    const gDim = (a: number, soft: number) =>
      `linear-gradient(${a}deg, 
        transparent 0%,
        rgba(255,255,255,0) ${50 - width}%,
        rgba(255,255,255,${soft * 0.4}) 50%,
        rgba(255,255,255,0) ${50 + width}%,
        transparent 100%)`;

    return [
      gDim(angle, alphaSoft),               // start subtle
      gBase(angle, alphaCore, alphaSoft),   // peak
      gDim(angle, alphaSoft),               // end subtle
    ];
  }, [angle, width, alphaCore, alphaSoft]);

  // Reduce motion support
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (disabled) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{ borderRadius: 'inherit' }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{
        background: frames[0],
        backgroundPosition: '200% 0%', // begin off to one side
      }}
      animate={
        prefersReducedMotion
          ? {
              // Single subtle pass position change, no flicker
              background: frames[1],
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }
          : {
              background: frames,
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay,
        ease: 'linear', // linear scroll avoids easing artifacts in gradients
        delay,
      }}
      style={{
        // Use large background to allow long travel without pixel stepping
        backgroundSize: '300% 200%',
        backgroundRepeat: 'no-repeat',
        borderRadius: 'inherit',
        // Hint GPU acceleration and avoid subpixel jitter
        willChange: 'background-position, opacity',
        transform: 'translateZ(0)',
        // Blend softly over underlying content
        mixBlendMode: 'screen',
      }}
      aria-hidden
    />
  );
};

export default ShimmerEffect;
