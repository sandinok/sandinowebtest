import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";

// --- Types ---
interface DockItem {
  id: string;
  icon: React.ElementType;
  label: string;
  gradient: string;
  windowId?: string;
  link?: string;
}

// --- Configuration ---
const DOCK_ITEMS: DockItem[] = [
  { id: "portfolio", icon: Palette, label: "Portfolio", gradient: "linear-gradient(135deg, #60a5fa, #2563eb)", windowId: "portfolio" },
  { id: "youtube", icon: Youtube, label: "YouTube", gradient: "linear-gradient(135deg, #f87171, #dc2626)", windowId: "youtube" },
  { id: "animations", icon: Play, label: "Animations", gradient: "linear-gradient(135deg, #14b8a6, #0891b2)", link: "https://youtube.com" }, // Placeholder link
  { id: "inspiration", icon: Lightbulb, label: "Inspiration", gradient: "linear-gradient(135deg, #22c55e, #059669)", windowId: "about" }, // Using About for now
  { id: "about", icon: User, label: "About", gradient: "linear-gradient(135deg, #06b6d4, #2563eb)", windowId: "about" },
  { id: "contact", icon: Mail, label: "Contact", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", windowId: "contact" },
];

// --- Sub-components ---

const DockIcon = ({
  item,
  mouseX,
  onClick,
  isOpen
}: {
  item: DockItem;
  mouseX: MotionValue;
  onClick: () => void;
  isOpen: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Distance calculation for magnification (Subtle for iOS feel)
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [56, 70, 56]); // Base 56px (w-14), Max 70px
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square relative flex items-center justify-center group dock-icon-jelly"
    >
      {/* Tooltip */}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="px-3 py-1 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
          {item.label}
        </div>
      </div>

      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className="w-full h-full rounded-2xl relative overflow-hidden focus:outline-none"
      >
        {/* Icon Background (Glass) */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity border border-white/20" />

        {/* Gradient Glow on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md"
          style={{ background: item.gradient }}
        />

        {/* Icon */}
        <div className="relative z-10 text-white drop-shadow-md flex items-center justify-center h-full w-full">
          <item.icon size="50%" strokeWidth={2} />
        </div>

        {/* Active Indicator */}
        {isOpen && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" />
        )}
      </motion.button>
    </motion.div>
  );
};

// --- Main Component ---

export const GlassDock: React.FC = () => {
  const mouseX = useMotionValue(Infinity);
  const { playSound } = useSounds();
  const { openWindow, windows, restoreWindow } = useWindows();

  const isWindowOpen = (id: string) => windows.some((w) => w.id === id && w.isOpen && !w.isMinimized);

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {/* Dock Container */}
      <motion.div
        className="flex items-end gap-3 px-4 py-3 rounded-[2rem] liquid-glass-animated"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={item.windowId ? isWindowOpen(item.windowId) : false}
            onClick={() => {
              playSound("click1");
              if (item.windowId) {
                const win = windows.find(w => w.id === item.windowId);
                if (win?.isMinimized) {
                  restoreWindow(item.windowId);
                } else {
                  openWindow(item.windowId, item.label);
                }
              } else if (item.link) {
                window.open(item.link, '_blank');
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
