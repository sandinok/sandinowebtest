import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindows } from '../context/WindowContext';
import { AppContents } from './AppContents'; // <--- IMPORTANTE

interface WindowProps {
  id: string;
  title: string;
  zIndex: number;
}

export const Window: React.FC<WindowProps> = ({ id, title, zIndex }) => {
  const { closeWindow, focusWindow, minimizeWindow } = useWindows();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{ zIndex }}
      onMouseDown={() => focusWindow(id)}
      className="absolute top-20 left-4 md:left-20 w-full max-w-[90vw] md:w-[800px] h-[60vh] md:h-[500px] pointer-events-auto flex flex-col"
    >
      <div className="flex-1 rounded-xl overflow-hidden ios-liquid-glass flex flex-col border border-white/20 shadow-2xl">
        
        {/* Header */}
        <div 
          className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing backdrop-blur-md"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 group">
              <button onClick={() => closeWindow(id)} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center transition-colors shadow-inner">
                <X size={8} className="text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button onClick={() => minimizeWindow(id)} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center transition-colors shadow-inner">
                <Minus size={8} className="text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center transition-colors shadow-inner">
                <Maximize2 size={8} className="text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
            </div>
          </div>
          
          <span className="text-xs font-medium text-white/70 tracking-wide pointer-events-none select-none">
            {title}
          </span>
          
          <div className="w-10" />
        </div>

        {/* Contenido Dinámico */}
        <div className="flex-1 p-6 text-white overflow-auto custom-scrollbar">
           <AppContents id={id} />
        </div>
      </div>
    </motion.div>
  );
};