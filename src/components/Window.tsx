import React, { useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useWindows } from "../context/WindowContext";

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  onFocus: () => void;
}

export const Window: React.FC<WindowProps> = ({ id, title, children, zIndex, onFocus }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, windows } = useWindows();
  const windowState = windows.find((w) => w.id === id);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  if (!windowState || !windowState.isOpen) return null;

  return (
    <AnimatePresence>
      {!windowState.isMinimized && (
        <motion.div
          key={id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ zIndex }}
          className="fixed top-20 left-4 md:left-20 w-[90vw] md:w-[800px] h-[70vh] md:h-[600px] rounded-2xl liquid-glass-animated flex flex-col overflow-hidden shadow-2xl"
          onPointerDown={onFocus}
          drag
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={true}
          dragElastic={0.3}
          dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
        >
          {/* Title Bar */}
          <div
            className="h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/10 cursor-default select-none"
            onPointerDown={(e) => dragControls.start(e)}
            onDoubleClick={() => maximizeWindow(id)}
          >
            <div className="flex items-center gap-2 group">
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:brightness-110 active:brightness-90 transition-all shadow-sm"
              />
              <button
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:brightness-110 active:brightness-90 transition-all shadow-sm"
              />
              <button
                onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:brightness-110 active:brightness-90 transition-all shadow-sm"
              />
            </div>

            <span className="text-xs font-medium text-white/70 font-inter tracking-wide pointer-events-none">
              {title}
            </span>

            <div className="w-14" /> {/* Spacer */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 text-white/90 selectable cursor-text bg-black/20">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
