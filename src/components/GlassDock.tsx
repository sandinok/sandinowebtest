// src/components/GlassDock.tsx
import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";

/*
iOS 26 Liquid/Aero Glass Dock (clean, brighter, more transparent):
- Floating at ~14vh (looks modern and avoids covering bottom area)
- Higher translucency and brightness (less "dark/gray" feeling)
- Balanced inner sheen, thin inner border, softer outer shadow
- Micro‑tilt on hover (very subtle) and open app indicator pill
- Optimized: single sheen animation, minimal layers, no heavy effects
*/

type IconType = React.ComponentType<{ className?: string; size?: number | string }>;

interface DockItem {
  id: string;
  icon: IconType;
  label: string; // for aria/openWindow label (not visible)
  sound: string;
  gradient: string; // halo tint per icon
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
      @keyframes dockHue {
        0% { background-position: 0% 0%; }
        100% { background-position: 300% 0%; }
      }
      @keyframes dockSheen {
        0% { background-position: 200% 0%; }
        100% { background-position: -100% 0%; }
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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.6 }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Base glass: clearer, brighter, thinner tint */}
      <div
        className="absolute inset-0 rounded-2xl border"
        style={{
          borderColor: "rgba(255,255,255,0.22)",
          background: `
            radial-gradient(120% 110% at 50% 8%,
              rgba(255,255,255,0.36) 0%,
              rgba(255,255,255,0.14) 38%,
              rgba(255,255,255,0.08) 72%,
              rgba(255,255,255,0.04) 100%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))
          `,
          backdropFilter: "blur(28px) saturate(180%) brightness(1.08)",
          WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.08)",
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.40),
            inset 0 -1px 0 rgba(0,0,0,0.12),
            0 18px 40px -20px rgba(0,0,0,0.32)
          `,
        }}
      />
      {/* Per-icon halo (very subtle) */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-25"
        style={{ background: gradient, filter: "blur(16px)" }}
      />
      {/* Edge sheen sweep */}
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
        <Icon className="text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)]" size={22} />
      </div>
    </motion.div>
  );
};

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow, windows } = useWindows();

  useEffect(() => {
    injectOnce();
  }, []);

  // Map of open windows (to show indicator below icon)
  const openMap = useMemo(() => {
    const m = new Map<string, boolean>();
    windows.forEach((w) => {
      if (w.isOpen && !w.isMinimized) m.set(w.id, true);
    });
    return m;
  }, [windows]);

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
      <div
        className="fixed inset-x-0 z-50 pointer-events-none"
        style={{ bottom: "14vh" }} // floating dock ~ modern iOS style
      >
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 160, damping: 22 }}
          className="mx-auto pointer-events-auto"
          style={{
            maxWidth: "min(88vw, 560px)",
            perspective: 800,
          }}
        >
          <div className="relative">
            {/* Dock container (no reflection below) */}
            <motion.div
              className="relative rounded-[1.8rem] border"
              style={{
                borderColor: "rgba(0,0,0,0.28)",
                padding: "12px 14px",
                background: `
                  linear-gradient(0deg, rgba(0,0,0,0.12), rgba(0,0,0,0.12)),
                  radial-gradient(90% 80% at 50% 8%,
                    rgba(255,255,255,0.18) 0%,
                    rgba(255,255,255,0.08) 44%,
                    rgba(255,255,255,0.03) 100%
                  ),
                  linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))
                `,
                backdropFilter: "blur(22px) saturate(160%) brightness(1.02)",
                WebkitBackdropFilter: "blur(22px) saturate(160%) brightness(1.02)",
                boxShadow: `
                  0 18px 46px -18px rgba(0,0,0,0.40),
                  inset 0 0 0 1px rgba(255,255,255,0.12),
                  inset 0 8px 12px -8px rgba(255,255,255,0.18),
                  inset 0 -8px 10px -8px rgba(0,0,0,0.12)
                `,
              }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              {/* Top glow cap */}
              <div
                className="absolute inset-0 rounded-[1.8rem] pointer-events-none"
                style={{
                  background: "radial-gradient(60% 45% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 100%)",
                  filter: "blur(1.5px)",
                }}
              />
              {/* Inner glow (very subtle) */}
              <div
                className="absolute inset-0 rounded-[1.8rem] pointer-events-none"
                style={{ boxShadow: "inset 0 0 24px rgba(255,255,255,0.10)" }}
              />

              {/* Dynamic glow line along the bottom (low cost) */}
              <motion.div
                aria-hidden
                className="absolute left-6 right-6 bottom-2 h-[2px] rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(170,220,255,0.55), rgba(255,200,245,0.55), rgba(255,230,180,0.55))",
                  backgroundSize: "200% 100%",
                  filter: "blur(2px)",
                }}
                animate={{ backgroundPositionX: ["0%", "100%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Icons row */}
              <div
                className="flex items-end justify-center gap-2 md:gap-2.5 relative z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {dockItems.map((item, index) => {
                  const Icon = item.icon;
                  const isOpen = openMap.get(item.id);
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
                        damping: 22,
                      }}
                      whileHover={{ scale: 1.03, rotateX: -5, rotateY: 2, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleIconClick(item)}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {/* Hover halo */}
                      <motion.div
                        className="absolute -inset-2 rounded-3xl opacity-0"
                        whileHover={{ opacity: 0.5, scale: 1.05 }}
                        transition={{ duration: 0.16 }}
                        style={{ background: item.gradient, filter: "blur(16px)" }}
                      />
                      <DockTile gradient={item.gradient} Icon={Icon} />

                      {/* Open app indicator (tiny pill) */}
                      {isOpen && (
                        <span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                          style={{
                            width: 7,
                            height: 3,
                            background: "rgba(255,255,255,0.9)",
                            boxShadow: "0 0 8px rgba(255,255,255,0.55)",
                          }}
                        />
                      )}
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
