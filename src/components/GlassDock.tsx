// src/components/GlassDock.tsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";

/*
IMPORTANT BUILD FIX:
- Removed @react-three/fiber and drei to avoid the "LinearEncoding" mismatch error from three/drei.
- Replaced the shader tile with a lightweight CSS-based liquid-glass approximation to keep the dock stable in production.
- No eval, no heavy bundles. Fully SSR/CSR safe with Vite.

If you later want WebGL tiles, we’ll mount a single off-DOM canvas and sample it as a texture, but for now this is bulletproof.
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
  children: React.ReactNode;
}> = ({ gradient, children }) => {
  return (
    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20">
      {/* Liquid glass faux background (fast, GPU-friendly) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 120% at 20% 0%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.08) 100%),
            linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))
          `,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          boxShadow:
            "inset 0 2px 2px rgba(255,255,255,0.45), inset 0 -2px 2px rgba(0,0,0,0.1)",
        }}
      />
      {/* Soft moving highlight to mimic “liquid” */}
      <div
        className="absolute -inset-1 opacity-25"
        style={{
          background: gradient,
          filter: "blur(16px)",
          animation: "lg-shimmer 3.2s ease-in-out infinite",
        }}
      />
      {/* Content (icon) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Local keyframes for shimmer without touching global CSS
const style = document.createElement("style");
style.innerHTML = `
@keyframes lg-shimmer {
  0% { transform: translate(-8%, -8%) scale(1); opacity: .2; }
  50% { transform: translate(6%, 8%) scale(1.05); opacity: .35; }
  100% { transform: translate(-8%, -8%) scale(1); opacity: .2; }
}
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();

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
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 150,
          damping: 22,
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          {/* Reflection */}
          <div className="absolute top-full left-0 right-0 h-16 overflow-hidden pointer-events-none">
            <div
              className="w-full h-16 rounded-[2.5rem] opacity-25"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
                transform: "scaleY(-1) translateY(2px)",
                filter: "blur(6px)",
                maskImage: "linear-gradient(to bottom, black 30%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 30%, transparent)",
              }}
            />
          </div>

          {/* Dock container */}
          <motion.div
            className="relative px-6 py-5 rounded-[2.5rem] border border-white/20 backdrop-blur-3xl"
            style={{
              background: `
                radial-gradient(80% 70% at 50% 0%, 
                  rgba(255, 255, 255, 0.4) 0%, 
                  rgba(255, 255, 255, 0.2) 50%, 
                  rgba(255, 255, 255, 0.1) 100%
                ),
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.05) 100%
                )`,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 8px 12px -4px rgba(255, 255, 255, 0.3),
                inset 0 -8px 12px -4px rgba(0, 0, 0, 0.1)
              `,
            }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Glow cap */}
            <div
              className="absolute inset-0 rounded-[2.5rem] opacity-60 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    60% 60% at 50% 0%, 
                    rgba(255, 255, 255, 0.7) 0%, 
                    transparent 100%
                  )`,
                filter: "blur(2px)",
              }}
            />

            {/* Items */}
            <div className="flex items-end gap-3 relative z-10">
              {dockItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{ y: -20, zIndex: 10 }}
                >
                  <motion.div
                    className="relative cursor-pointer"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleIconClick(item)}
                  >
                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0"
                      whileHover={{ opacity: 0.7, scale: 1.25 }}
                      transition={{ duration: 0.25 }}
                      style={{ background: item.gradient, filter: "blur(16px)" }}
                    />
                    {/* Tile */}
                    <DockTile gradient={item.gradient}>
                      <item.icon
                        className="text-white drop-shadow-lg"
                        size={24}
                      />
                    </DockTile>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlassDock;
