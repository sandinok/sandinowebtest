
import React from 'react';
import { motion } from 'framer-motion';
import { DockIcon } from './DockIcon';
import { Palette, Youtube, Play, Lightbulb, User, Mail } from 'lucide-react';
import { useSounds } from '../context/SoundContext';
import { useWindows } from '../context/WindowContext';

export const GlassDock = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();

  const dockItems = [
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

  const handleIconClick = (item: any) => {
    playSound(item.sound);
    openWindow(item.id, item.label);
  };

  // Variantes de animación mejoradas con física realista
  const dockVariants = {
    hover: {
      scale: 1.05,
      y: -8,
      rotateX: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }
    },
    initial: {
      scale: 1,
      y: 0,
      rotateX: 15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 1.2, 
        delay: 1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 perspective-1000"
    >
      <motion.div 
        className="relative p-8 rounded-3xl border border-white/20 transform-style-3d"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.25) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0.05) 75%,
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          backdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: `
            0 32px 64px -8px rgba(0, 0, 0, 0.4),
            0 16px 32px -8px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          transform: 'rotateX(15deg) translateZ(0)',
        }}
        whileHover={{ 
          transform: 'rotateX(8deg) translateZ(10px)',
          boxShadow: `
            0 40px 80px -8px rgba(0, 0, 0, 0.5),
            0 20px 40px -8px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
        variants={dockVariants}
        initial="initial"
        whileHover="hover"
      >
        {/* Efecto de reflejos internos */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-30"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.1) 25%, 
                transparent 50%,
                rgba(255, 255, 255, 0.05) 75%,
                transparent 100%
              )
            `,
            backgroundSize: '200% 200%',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        />

        <div className="flex gap-6 relative z-10">
          {dockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.3, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 1.2 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <DockIcon
                {...item}
                onClick={() => handleIconClick(item)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Reflejo mejorado del dock */}
        <div 
          className="absolute top-full left-8 right-8 h-32 opacity-40 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                transparent 100%
              )
            `,
            transform: 'scaleY(-0.8) perspective(200px) rotateX(25deg)',
            filter: 'blur(2px)',
            borderRadius: '0 0 50% 50%',
            transformOrigin: 'top center',
          }}
        />
        
        {/* Efecto de luz ambiental */}
        <div 
          className="absolute -inset-4 opacity-20 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 200px 100px at center, 
                rgba(99, 179, 237, 0.3) 0%, 
                transparent 70%
              )
            `,
            filter: 'blur(20px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
