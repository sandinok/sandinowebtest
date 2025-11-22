import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { useWindows } from "../context/WindowContext";

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  onFocus: () => void;
}

export const Window: React.FC<WindowProps> = ({ id, title, children, zIndex, onFocus }) => {
  const { closeWindow, minimizeWindow, windows } = useWindows();
  const windowState = windows.find((w) => w.id === id);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  if (!windowState || !windowState.isOpen) return null;

  return (
    <AnimatePresence>
      {!windowState.isMinimized && (
        <motion.div
          key={id}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50, filter: "blur(10px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ zIndex }}
          className="fixed top-20 left-4 md:left-20 w-[90vw] md:w-[800px] h-[70vh] md:h-[600px] rounded-3xl liquid-glass flex flex-col shadow-2xl"
          onPointerDown={onFocus}
          drag
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }} // Constraints handled by parent usually, but here we just want free float with limits if needed. For now, free float.
        >
          {/* Title Bar */}
          <div
            className="h-12 flex items-center justify-between px-4 border-b border-white/10 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors shadow-inner"
              />
              <button
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors shadow-inner"
              />
              <button
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-inner"
              />
            </div>

            <span className="text-sm font-medium text-white/80 font-inter tracking-wide select-none">
              {title}
            </span>

            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 text-white/90 select-text">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
