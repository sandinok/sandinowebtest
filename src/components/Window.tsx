// src/components/Window.tsx
import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { X, Minus, Square, RotateCcw, Move } from 'lucide-react';
import { useWindows } from '../context/WindowContext';

interface WindowProps {
  window: {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
  };
}

const WindowContent = memo(({ id }: { id: string }) => {
  const contentVariants = {
    initial: { opacity: 0, scale: 0.96, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.96,
      y: 10,
      transition: { duration: 0.25 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2 
      variants={itemVariants}
      className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-8 text-center tracking-tight"
    >
      {children}
    </motion.h2>
  );

  const renderContent = () => {
    switch (id) {
      case 'portfolio':
        return (
          <motion.div variants={contentVariants} className="p-10 space-y-8">
            <SectionTitle>Mi Portfolio</SectionTitle>
            <motion.div 
              className="grid grid-cols-2 gap-8"
              variants={contentVariants}
            >
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.15) 0%, 
                        rgba(168, 85, 247, 0.15) 50%, 
                        rgba(236, 72, 153, 0.15) 100%
                      )
                    `,
                    backdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255, 255, 255, 0.22),
                      inset 0 -1px 0 rgba(255, 255, 255, 0.05),
                      0 20px 40px -10px rgba(0, 0, 0, 0.15),
                      0 0 0 1px rgba(255, 255, 255, 0.05)
                    `,
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25 
                    }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Reflection effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)'
                    }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)',
                    }}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg drop-shadow-lg">
                      Proyecto {i}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'about':
        return (
          <motion.div variants={contentVariants} className="p-10 space-y-8">
            <SectionTitle>Sobre Mí</SectionTitle>
            <div className="flex flex-col items-center space-y-8">
              <motion.div 
                variants={itemVariants}
                className="relative w-40 h-40 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: `
                    0 0 0 4px rgba(255, 255, 255, 0.1),
                    0 0 0 8px rgba(255, 255, 255, 0.05),
                    0 30px 60px -12px rgba(0, 0, 0, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 2,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
                <div className="h-full flex items-center justify-center text-white text-5xl font-bold drop-shadow-lg">
                  S
                </div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="text-center space-y-6 max-w-lg"
              >
                <p className="text-white/95 text-xl leading-relaxed font-light">
                  Soy Sandino, un artista digital y creador de contenido de República Dominicana.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  Creo experiencias visuales inmersivas que combinan arte y tecnología moderna.
                </p>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div variants={contentVariants} className="p-10 space-y-8">
            <SectionTitle>Contacto</SectionTitle>
            <div className="space-y-6 max-w-lg mx-auto">
              {[
                { field: 'Nombre', type: 'text', placeholder: 'Tu nombre completo' },
                { field: 'Email', type: 'email', placeholder: 'tu@email.com' },
                { field: 'Mensaje', type: 'textarea', placeholder: 'Cuéntame sobre tu proyecto...' }
              ].map((item, i) => (
                <motion.div 
                  key={item.field}
                  variants={itemVariants}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium text-white/90 uppercase tracking-wider">
                    {item.field}
                  </label>
                  {item.type === 'textarea' ? (
                    <textarea 
                      className="w-full px-5 py-4 rounded-2xl text-white placeholder-white/50 resize-none h-32 transition-all duration-300 focus:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1)
                        `,
                      }}
                      placeholder={item.placeholder}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1),
                          0 0 0 3px rgba(99, 102, 241, 0.1)
                        `;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1)
                        `;
                      }}
                    />
                  ) : (
                    <input 
                      type={item.type}
                      className="w-full px-5 py-4 rounded-2xl text-white placeholder-white/50 transition-all duration-300 focus:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1)
                        `,
                      }}
                      placeholder={item.placeholder}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1),
                          0 0 0 3px rgba(99, 102, 241, 0.1)
                        `;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 10px 30px -5px rgba(0, 0, 0, 0.1)
                        `;
                      }}
                    />
                  )}
                </motion.div>
              ))}
              
              <motion.button 
                variants={itemVariants}
                className="w-full py-4 rounded-2xl font-semibold text-white relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: `
                    0 20px 40px -12px rgba(102, 126, 234, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{
                    x: '100%',
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
                <span className="relative z-10">Enviar Mensaje</span>
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div variants={contentVariants} className="p-10 flex items-center justify-center">
            <p className="text-white/60 text-lg">Contenido no encontrado</p>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full overflow-hidden"
    >
      {renderContent()}
    </motion.div>
  );
});

export const Window: React.FC<WindowProps> = memo(({ window }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, bringToFront, updateWindowPosition, updateWindowSize } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Motion values
  const x = useMotionValue(window.position.x);
  const y = useMotionValue(window.position.y);
  const scale = useSpring(1, { stiffness: 400, damping: 30 });
  const rotate = useSpring(0, { stiffness: 400, damping: 30 });

  // Transform values
  const boxShadowIntensity = useTransform(scale, [1, 1.02], [0.2, 0.4]);
  const borderOpacity = useTransform(scale, [1, 1.02], [0.15, 0.25]);

  // Update motion values when window position changes
  useEffect(() => {
    x.set(window.position.x);
    y.set(window.position.y);
  }, [window.position.x, window.position.y, x, y]);

  const handleDragStart = useCallback(() => {
    if (window.isMaximized) return;
    setIsDragging(true);
    bringToFront(window.id);
    scale.set(1.02);
    rotate.set(1);
  }, [window.isMaximized, window.id, bringToFront, scale, rotate]);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (window.isMaximized) return;
    setIsDragging(false);
    scale.set(1);
    rotate.set(0);
    
    const newX = Math.max(0, Math.min(window.position.x + info.offset.x, window.innerWidth - window.size.width));
    const newY = Math.max(0, Math.min(window.position.y + info.offset.y, window.innerHeight - window.size.height));
    
    updateWindowPosition(window.id, { x: newX, y: newY });
  }, [window, updateWindowPosition, scale, rotate]);

  if (window.isMinimized) return null;

  const windowVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      rotateX: -15
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        opacity: { duration: 0.3 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -50,
      rotateX: 15,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      variants={windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        x: window.isMaximized ? 0 : x,
        y: window.isMaximized ? 0 : y,
        scale,
        rotate,
        zIndex: window.zIndex,
        width: window.isMaximized ? '100vw' : window.size.width,
        he
