
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-40 perspective-1000"
    >
      <motion.div 
        className="relative p-8 rounded-3xl border border-white/20 transform-style-3d"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          transform: 'rotateX(10deg)',
        }}
        whileHover={{ transform: 'rotateX(0deg)' }}
        transition={{ duration: 0.5 }}
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
                stiffness: 200,
              }}
            >
              <DockIcon
                {...item}
                onClick={() => handleIconClick(item)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Reflejo del dock */}
        <div 
          className="absolute top-full left-10 right-10 h-28 opacity-40 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 100%
              )
            `,
            transform: 'scaleY(-1)',
            filter: 'blur(2px)',
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
