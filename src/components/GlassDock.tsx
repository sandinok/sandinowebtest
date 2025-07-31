// src/components/GlassDock.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Youtube, Play, Lightbulb, User, Mail } from 'lucide-react';
import { useSounds } from '../context/SoundContext';
import { useWindows } from '../context/WindowContext';

interface DockItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  sound: string;
  gradient: string;
}

export const GlassDock = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dockItems: DockItem[] = [
    {
      id: 'portfolio',
      icon: Palette,
      label: 'PORTFOLIO',
      color: 'from-blue-500 to-blue-700',
      sound: 'click1',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
    },
    {
      id: 'youtube',
      icon: Youtube,
      label: 'YOUTUBE',
      color: 'from-red-500 to-pink-600',
      sound: 'click2',
      gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
    },
    {
      id: 'animations',
      icon: Play,
      label: 'ANIMATIONS',
      color: 'from-teal-500 to-cyan-600',
      sound: 'click3',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0891b2 100%)',
    },
    {
      id: 'inspiration',
      icon: Lightbulb,
      label: 'INSPIRATION',
      color: 'from-green-500 to-emerald-600',
      sound: 'click4',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)',
    },
    {
      id: 'about',
      icon: User,
      label: 'ABOUT ME',
      color: 'from-cyan-500 to-blue-600',
      sound: 'click5',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'CONTACT',
      color: 'from-purple-500 to-indigo-600',
      sound: 'click6',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)',
    },
  ];

  const handleIconClick = (item: DockItem) => {
    playSound(item.sound);
    openWindow(item.id, item.label);
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 150,
            damping: 25
          }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="relative">
            {/* Reflejo del dock */}
            <div className="absolute top-full left-0 right-0 h-20 overflow-hidden">
              <div 
                className="w-full h-20 rounded-[2.5rem] opacity-30"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                  transform: 'scaleY(-1) translateY(2px)',
                  filter: 'blur(6px)',
                  maskImage: 'linear-gradient(to bottom, black 30%, transparent)'
                }}
              />
            </div>

            {/* Contenedor principal del dock */}
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
              whileHover={{ 
                y: -8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              {/* Efecto de brillo */}
              <div 
                className="absolute inset-0 rounded-[2.5rem] opacity-60 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(
                      60% 60% at 50% 0%, 
                      rgba(255, 255, 255, 0.8) 0%, 
                      transparent 100%
                    )`,
                  filter: 'blur(2px)'
                }}
              />

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
                      damping: 20
                    }}
                    whileHover={{ 
                      y: -20,
                      zIndex: 10
                    }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }}
                  >
                    <motion.div
                      className="relative cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleIconClick(item)}
                    >
                      {/* Glow effect */}
                      <motion.div 
                        className="absolute inset-0 rounded-2xl opacity-0"
                        animate={{ 
                          opacity: hoveredIndex === index ? 0.7 : 0,
                          scale: hoveredIndex === index ? 1.4 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: item.gradient,
                          filter: 'blur(16px)'
                        }}
                      />
                      
                      {/* Icon container */}
                      <div 
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.25) 0%, 
                              rgba(255, 255, 255, 0.1) 100%
                            )`,
                          boxShadow: `
                            0 8px 20px -4px rgba(0, 0, 0, 0.2),
                            inset 0 2px 2px rgba(255, 255, 255, 0.4),
                            inset 0 -2px 2px rgba(0, 0, 0, 0.1)
                          `
                        }}
                      >
                        <item.icon 
                          className="text-white drop-shadow-lg" 
                          size={24} 
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
