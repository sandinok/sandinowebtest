
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
        className="relative p-6 rounded-3xl border border-white/30 transform-style-3d overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.35) 0%,
              rgba(255, 255, 255, 0.25) 25%,
              rgba(255, 255, 255, 0.15) 75%,
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(60px) saturate(200%)',
          boxShadow: `
            0 40px 80px -16px rgba(0, 0, 0, 0.6),
            0 20px 40px -8px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.4),
            inset 0 -2px 0 rgba(0, 0, 0, 0.15)
          `,
          transform: 'rotateX(8deg) translateZ(0)',
        }}
        whileHover={{ 
          transform: 'rotateX(0deg) translateZ(20px)',
          y: -12,
          boxShadow: `
            0 60px 120px -16px rgba(0, 0, 0, 0.7),
            0 30px 60px -8px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.4),
            inset 0 2px 0 rgba(255, 255, 255, 0.5),
            inset 0 -2px 0 rgba(0, 0, 0, 0.15)
          `,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        {/* Glass reflection layers */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-40"
          style={{
            background: `
              linear-gradient(135deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.3) 20%, 
                transparent 40%,
                rgba(255, 255, 255, 0.2) 60%,
                transparent 80%,
                rgba(255, 255, 255, 0.1) 100%
              )
            `,
            backgroundSize: '200% 200%',
            animation: 'shimmer 6s ease-in-out infinite',
          }}
        />

        <div className="flex gap-4 relative z-10">
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
        
        {/* Enhanced dock reflection */}
        <div 
          className="absolute top-full left-6 right-6 h-40 opacity-50 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(255, 255, 255, 0.25) 0%,
                rgba(255, 255, 255, 0.15) 20%,
                rgba(255, 255, 255, 0.08) 40%,
                transparent 100%
              )
            `,
            transform: 'scaleY(-0.9) perspective(300px) rotateX(35deg)',
            filter: 'blur(3px)',
            borderRadius: '0 0 60% 60%',
            transformOrigin: 'top center',
          }}
        />
        
        {/* Ambient glow effect */}
        <div 
          className="absolute -inset-6 opacity-30 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 300px 150px at center, 
                rgba(129, 140, 248, 0.4) 0%, 
                rgba(99, 102, 241, 0.2) 30%,
                transparent 70%
              )
            `,
            filter: 'blur(30px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
