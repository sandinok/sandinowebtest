// src/components/GlassDock.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";

/*
GlassDock optimizado:
- Centrado robusto: wrapper full-width con flex y transform para evitar desalineaciones en layouts complejos.
- Tamaños responsivos: iconos y gaps ajustados por breakpoints.
- Hit-area accesible: botones con aria-label.
- Animaciones suaves y ligeras (spring corto, hover moderado).
- Shimmer local (sin global CSS), sin memory leaks.
- Fondo glass más realista con capa de reflexión controlada.
*/

type IconType = React.ComponentType<{ className?: string; size?: number }>;

interface DockItem {
  id: string;
  icon: IconType;
  label: string;
  color: string;
  sound: string;
  gradient: string;
}

const DockTile: React.FC<{
  gradient: string;
  sizeClass?: string; // permite variar tamaño con breakpoints
  children: React.ReactNode;
}> = ({ gradient, sizeClass = "w-12 h-12 md:w-14 md:h-14", children }) => {
  return (
    <div
      className={`relative ${sizeClass} rounded-2xl overflow-hidden border border-white/20 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22)]`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Glass base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 120% at 20% 0%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.08) 100%),
            linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.07))
          `,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
        }}
      />
      {/* Soft gradient glow (static, subtle) */}
      <div
        className="absolute -inset-1 opacity-25"
        style={{
          background: gradient,
          filter: "blur(14px)",
        }}
      />
      {/* Shimmer beam (CSS keyframes injected once) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.08) 52%, transparent 65%)",
          backgroundSize: "250% 100%",
          animation: "dockShimmer 5.2s linear infinite",
          mixBlendMode: "screen",
          borderRadius: "inherit",
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Inject local keyframes once
let injected = false;
const injectKeyframes = () => {
  if (injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes dockShimmer {
      0% { background-position: 200% 0%; }
      100% { background-position: -200% 0%; }
    }
  `;
  document.head.appendChild(style);
  injected = true;
};

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();
  const dockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    injectKeyframes();
  }, []);

  const dockItems: DockItem[] = useMemo(
    () => [
      {
        id: "portfolio",
        icon: Palette,
        label: "PORTFOLIO",
        color: "from-blue-500 to-blue-700",
        sound: "click1",
        gradient:
          "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
      },
      {
        id: "youtube",
        icon: Youtube,
        label: "YOUTUBE",
        color: "from-red-500 to-pink-600",
        sound: "click2",
        gradient:
          "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
      },
      {
        id: "animations",
        icon: Play,
        label: "ANIMATIONS",
        color: "from-teal-500 to-cyan-600",
        sound: "click3",
        gradient:
          "linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0891b2 100%)",
      },
      {
        id: "inspiration",
        icon: Lightbulb,
        label: "INSPIRATION",
        color: "from-green-500 to-emerald-600",
        sound: "click4",
        gradient:
          "linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)",
      },
      {
        id: "about",
        icon: User,
        label: "ABOUT ME",
        color: "from-cyan-500 to-blue-600",
        sound: "click5",
        gradient:
          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)",
      },
      {
        id: "contact",
        icon: Mail,
        label: "CONTACT",
        color: "from-purple-500 to-indigo-600",
        sound: "click6",
        gradient:
          "linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)",
      },
    ],
    []
  );

  const handleIconClick = (item: DockItem) => {
    playSound(item.sound);
    openWindow(item.id, item.label);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-x-0 bottom-6 md:bottom-8 z-50"
        style={{ pointerEvents: "none" }}
      >
        <motion.div
          ref={dockRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{
            duration: 0.55,
            type: "spring",
            stiffness: 140,
            damping: 20,
          }}
          className="mx-auto"
          style={{
            maxWidth: "min(92vw, 680px)",
            pointerEvents: "auto",
          }}
        >
          <div className="relative">
            {/* Reflection (subtle, masked) */}
            <div className="absolute top-full left-0 right-0 h-14 md:h-16 overflow-hidden pointer-events-none">
              <div
                className="w-full h-full rounded-[2rem] opacity-25"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.34), transparent)",
                  transform: "scaleY(-1) translateY(2px)",
                  filter: "blur(6px)",
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 20%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 20%, transparent)",
                }}
              />
            </div>

            {/* Dock container */}
            <motion.div
              className="relative rounded-[2rem] border border-white/20 backdrop-blur-3xl"
              style={{
                padding: "12px 14px",
                background: `
                  radial-gradient(80% 70% at 50% 0%, 
                    rgba(255, 255, 255, 0.38) 0%, 
                    rgba(255, 255, 255, 0.18) 50%, 
                    rgba(255, 255, 255, 0.10) 100%
                  ),
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.14) 0%, 
                    rgba(255, 255, 255, 0.06) 100%
                  )`,
                boxShadow: `
                  0 18px 40px -14px rgba(0,0,0,0.35),
                  inset 0 0 0 1px rgba(255,255,255,0.18),
                  inset 0 8px 12px -6px rgba(255,255,255,0.26),
                  inset 0 -8px 12px -6px rgba(0,0,0,0.12)
                `,
              }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              {/* Top glow cap */}
              <div
                className="absolute inset-0 rounded-[2rem] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.65) 0%, transparent 100%)",
                  filter: "blur(2px)",
                  opacity: 0.55,
                }}
              />

              {/* Items row */}
              <div className="flex items-end justify-center gap-2.5 md:gap-3 relative z-10">
                {dockItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    aria-label={item.label}
                    className="relative outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.04 + 0.05,
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                    whileHover={{ y: -16, scale: 1.03, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleIconClick(item)}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {/* Hover halo */}
                    <motion.div
                      className="absolute -inset-2 rounded-3xl opacity-0"
                      whileHover={{ opacity: 0.6, scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: item.gradient,
                        filter: "blur(18px)",
                      }}
                    />
                    <DockTile gradient={item.gradient} sizeClass="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14">
                      <item.icon className="text-white drop-shadow-lg" size={22} />
                    </DockTile>
                    {/* Label tooltip-like (mobile-hidden) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] hidden md:block">
                      <div
                        className="px-2 py-1 rounded-md text-xs text-white/90"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(20,20,24,0.6), rgba(20,20,24,0.4))",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlassDock;
