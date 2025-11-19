import React from "react";
import { motion } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";
import { DockIcon } from "./DockIcon";

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow, windows } = useWindows();

  const dockItems = [
    { id: "portfolio", icon: Palette, label: "Portfolio", gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)" },
    { id: "youtube", icon: Youtube, label: "YouTube", gradient: "linear-gradient(135deg, #ef4444, #f87171)" },
    { id: "animations", icon: Play, label: "Animations", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
    { id: "inspiration", icon: Lightbulb, label: "Inspiration", gradient: "linear-gradient(135deg, #eab308, #f97316)" },
    { id: "about", icon: User, label: "About Me", gradient: "linear-gradient(135deg, #8b5cf6, #d946ef)" },
    { id: "contact", icon: Mail, label: "Contact", gradient: "linear-gradient(135deg, #10b981, #06b6d4)" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 100, 
          delay: 2.5 // Espera a que termine el LoadingScreen
        }}
        className="
          relative flex items-end gap-3 px-4 py-3.5
          rounded-[2rem]
          ios-liquid-glass
        "
      >
        {/* Capa extra para el borde brillante inferior (estilo dock macOS/iOS) */}
        <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {dockItems.map((item) => {
          const isOpen = windows.some(w => w.id === item.id && !w.isMinimized);
          
          return (
            <DockIcon
              key={item.id}
              {...item}
              isOpen={isOpen}
              onClick={() => {
                playSound("click1"); // Asegúrate de que este sonido exista o usa uno genérico
                openWindow(item.id, item.label);
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default GlassDock;
