
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
    },
    {
      id: 'youtube',
      icon: Youtube,
      label: 'YOUTUBE',
      color: 'from-red-500 to-pink-600',
      sound: 'click2',
    },
    {
      id: 'animations',
      icon: Play,
      label: 'ANIMATIONS',
      color: 'from-teal-500 to-cyan-600',
      sound: 'click3',
    },
    {
      id: 'inspiration',
      icon: Lightbulb,
      label: 'INSPIRATION',
      color: 'from-green-500 to-emerald-600',
      sound: 'click4',
    },
    {
      id: 'about',
      icon: User,
      label: 'ABOUT ME',
      color: 'from-cyan-500 to-blue-600',
      sound: 'click5',
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'CONTACT',
      color: 'from-purple-500 to-indigo-600',
      sound: 'click6',
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
      className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-40"
    >
      <div 
        className="relative p-6 rounded-3xl border border-white/20"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(150%)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        <div className="flex gap-4">
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
          className="absolute top-full left-6 right-6 h-20 opacity-30 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 100%
              )
            `,
            transform: 'scaleY(-1)',
            filter: 'blur(1px)',
          }}
        />
      </div>
    </motion.div>
  );
};
