
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
      gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    },
    {
      id: 'youtube',
      icon: Youtube,
      label: 'YOUTUBE',
      color: 'from-red-500 to-pink-600',
      sound: 'click2',
      gradient: 'linear-gradient(135deg, #f87171, #db2777)',
    },
    {
      id: 'animations',
      icon: Play,
      label: 'ANIMATIONS',
      color: 'from-teal-500 to-cyan-600',
      sound: 'click3',
      gradient: 'linear-gradient(135deg, #14b8a6, #0891b2)',
    },
    {
      id: 'inspiration',
      icon: Lightbulb,
      label: 'INSPIRATION',
      color: 'from-green-500 to-emerald-600',
      sound: 'click4',
      gradient: 'linear-gradient(135deg, #22c55e, #059669)',
    },
    {
      id: 'about',
      icon: User,
      label: 'ABOUT ME',
      color: 'from-cyan-500 to-blue-600',
      sound: 'click5',
      gradient: 'linear-gradient(135deg, #06b6d4, #2563eb)',
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'CONTACT',
      color: 'from-purple-500 to-indigo-600',
      sound: 'click6',
      gradient: 'linear-gradient(135deg, #a855f7, #4f46e5)',
    },
  ];

  const handleIconClick = (item: any) => {
    playSound(item.sound);
    openWindow(item.id, item.label);
  };

  // Custom hover effect for the whole dock
  const dockVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    initial: {
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 perspective-1000"
    >
      <motion.div 
        className="relative p-8 rounded-full border border-white/30 transform-style-3d shadow-2xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.25) 0%, 
              rgba(255, 255, 255, 0.08) 100%
            )
          `,
          backdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          transform: 'rotateX(20deg) translateZ(10px)',
        }}
        whileHover={{ 
          transform: 'rotateX(10deg) translateZ(20px)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
        }}
        variants={dockVariants}
        initial="initial"
        whileHover="hover"
      >
        <div className="flex gap-6">
          {dockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6,
                delay: 1.2 + index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
            >
              <DockIcon
                {...item}
                onClick={() => handleIconClick(item)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Reflejo del dock mejorado */}
        <div 
          className="absolute top-full left-10 right-10 h-28 opacity-50 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 100%
              )
            `,
            transform: 'scaleY(-1)',
            filter: 'blur(3px)',
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
