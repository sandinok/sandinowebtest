import React from "react";
import { motion } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";
import { DockIcon } from "./DockIcon";

// IMPORTANTE: export const (No default)
export const GlassDock: React.FC = () => {
    const { playSound } = useSounds();
    const { openWindow, windows } = useWindows();

    const dockItems = [
        { id: "portfolio", icon: Palette, label: "Portfolio", gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)" },
        { id: "youtube", icon: Youtube, label: "YouTube", gradient: "linear-gradient(135deg, #ef4444, #fca5a5)" },
        { id: "animations", icon: Play, label: "Animations", gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)" },
        { id: "inspiration", icon: Lightbulb, label: "Inspiration", gradient: "linear-gradient(135deg, #eab308, #fde047)" },
        { id: "about", icon: User, label: "About Me", gradient: "linear-gradient(135deg, #8b5cf6, #c4b5fd)" },
        { id: "contact", icon: Mail, label: "Contact", gradient: "linear-gradient(135deg, #10b981, #6ee7b7)" },
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.5 }}
                className="pointer-events-auto flex items-end gap-3 px-4 py-3.5 pb-4 rounded-[2.5rem] ios-liquid-glass border border-white/10"
            >
                {dockItems.map((item) => {
                    const isOpen = windows.some(w => w.id === item.id && !w.isMinimized);
                    return (
                        <DockIcon
                            key={item.id}
                            {...item}
                            isOpen={isOpen}
                            onClick={() => {
                                // Usamos try-catch por seguridad si el sonido falla
                                try { playSound("click"); } catch (e) { }
                                openWindow(item.id, item.label);
                            }}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
};