// src/components/GlassDock.tsx
import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";

/*
iOS Liquid Glass-style Dock (refined):
- No text labels under icons (clean look).
- True centered layout with max-width and auto margins.
- Shorter, tighter dock; adaptive sizes per breakpoint.
- Liquid Glass material tuned: higher translucency, edge sheen, soft frosted core, subtle parallax shimmer.
- Smooth, low-amplitude hover with light lift and halo; spring carefully damped.
- Performance-friendly: no heavy WebGL, only CSS+blur with one shimmer keyframes.
- Visual direction aligns with “Liquid Glass” dock: more transparent dock, edge sheen, frosted tint adapting to background[3][6][11][14].

Notes:
- If you want the dock even narrower, lower maxWidth.
*/

type IconType = React.ComponentType<{ className?: string; size?: number }>;

interface DockItem {
  id: string;
  icon: IconType;
  label: string; // kept for aria and openWindow label, not rendered visually
  sound: string;
  gradient: string; // per-icon halo tint
}

const injectOnce = (() => {
  let done = false;
  return () => {
    if (done || typeof document === "undefined") return;
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes dockLiquidSheen {
        0% { background-position: 160% 0%; }
        100% { background-position: -60% 0%; }
      }
    `;
    document.head.appendChild(style);
    done = true;
  };
})();

const DockTile: React.FC<{
  gradient: string;
  sizeClass?: string;
  Icon: IconType;
}> = ({ gradient, sizeClass = "w-12 h-12 md:w-14 md:h-14", Icon }) => {
  return (
    <motion.div
      className={`relative ${sizeClass} rounded-2xl overflow-hidden`}
      whileHover={{ y: -12, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6 }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Base glass: translucent core + soft frost, slight inner highlights */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/18"
        style={{
          background: `
            radial-gradient(120% 110% at 50% 10%,
              rgba(255,255,255,0.42) 0%,
              rgba(255,255,255,0.18) 36%,
              rgba(255,255,255,0.10) 72%,
              rgba(255,255,255,0.06) 100%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.07))
          `,
          backdropFilter: "blur(18px) saturate(145%)",
          WebkitBackdropFilter: "blur(18px) saturate(145%)",
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 8px 20px rgba(0,0,0,0.22)
          `,
        }}
      />
      {/* Per-icon tint halo (very subtle) */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-25"
        style={{ background: gradient, filter: "blur(16px)" }}
      />
      {/* Edge sheen sweep (screen blend, long linear pass) */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-screen"
        style={{
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
          backgroundSize: "220% 100%",
          animation: "dockLiquidSheen 5.6s linear infinite",
        }}
      />
      {/* Icon */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Icon className="text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]" size={22} />
      </div>
    </motion.div>
  );
};

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();

  useEffect(() => {
    injectOnce();
  }, []);

  const dockItems: DockItem[] = useMemo(
    () => [
      {
        id: "portfolio",
        icon: Palette,
        label: "PORTFOLIO",
        sound: "click1",
        gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
      },
      {
        id: "youtube",
        icon: Youtube,
        label: "YOUTUBE",
        sound: "click2",
        gradient: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
      },
      {
        id: "animations",
        icon: Play,
        label: "ANIMATIONS",
        sound: "click3",
        gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0891b2 100%)",
      },
      {
        id: "inspiration",
        icon: Lightbulb,
        label: "INSPIRATION",
        sound: "click4",
        gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)",
      },
      {
        id: "about",
        icon: User,
        label: "ABOUT ME",
        sound: "click5",
        gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)",
      },
      {
        id: "contact",
        icon: Mail,
        label: "CONTACT",
        sound: "click6",
        gradient: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)",
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
      {/* Full width lane to guarantee centering */}
      <div className="fixed inset-x-0 bottom-5 md:bottom-7 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 160, damping: 22 }}
          className="mx-auto pointer-events-auto"
          style={{
            maxWidth: "min(88vw, 560px)", // tighter width for a shorter dock
          }}
        >
          <div className="relative">
            {/* Subtle reflection under dock */}
            <div className="absolute top-full left-0 right-0 h-12 md:h-14 overflow-hidden pointer-events-none">
              <div
                className="w-full h-full rounded-[1.8rem] opacity-22"
                style={{
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.34), transparent)",
                  transform: "scaleY(-1) translateY(2px)",
                  filter: "blur(6px)",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 25%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 25%, transparent)",
                }}
              />
            </div>

            {/* Dock container */}
            <motion.div
              className="relative rounded-[1.8rem] border border-white/18"
              style={{
                padding: "10px 12px",
                background: `
                  radial-gradient(90% 80% at 50% 5%,
                    rgba(255,255,255,0.42) 0%,
                    rgba(255,255,255,0.2) 45%,
                    rgba(255,255,255,0.10) 100%
                  ),
                  linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))
                `,
                backdropFilter: "blur(22px) saturate(150%)",
                WebkitBackdropFilter: "blur(22px) saturate(150%)",
                boxShadow: `
                  0 16px 36px -14px rgba(0,0,0,0.35),
                  inset 0 0 0 1px rgba(255,255,255,0.16),
                  inset 0 8px 10px -6px rgba(255,255,255,0.24),
                  inset 0 -8px 10px -6px rgba(0,0,0,0.12)
                `,
              }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              {/* Top glow cap */}
              <div
                className="absolute inset-0 rounded-[1.8rem] pointer-events-none"
                style={{
                  background: "radial-gradient(60% 45% at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 100%)",
                  filter: "blur(2px)",
                }}
              />

              {/* Icons row – no text labels */}
              <div className="flex items-end justify-center gap-2 md:gap-2.5 relative z-10">
                {dockItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      aria-label={item.label}
                      className="relative outline-none rounded-2xl"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.04 + 0.05,
                        type: "spring",
                        stiffness: 220,
                        damping: 18,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleIconClick(item)}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {/* Hover halo (controlled by parent hover) */}
                      <motion.div
                        className="absolute -inset-2 rounded-3xl opacity-0"
                        whileHover={{ opacity: 0.55, scale: 1.06 }}
                        transition={{ duration: 0.18 }}
                        style={{ background: item.gradient, filter: "blur(16px)" }}
                      />
                      <DockTile gradient={item.gradient} Icon={Icon} />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlassDock;
