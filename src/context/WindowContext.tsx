import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

// EXPORT 1: El Proveedor
export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = (id: string, title: string) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        return prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: getMaxZ(prev) + 1 }
            : w
        );
      }
      return [...prev, { id, title, isOpen: true, isMinimized: false, zIndex: getMaxZ(prev) + 1 }];
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = getMaxZ(prev);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  };

  const getMaxZ = (list: WindowState[]) => {
    if (list.length === 0) return 10;
    return Math.max(...list.map((w) => w.zIndex));
  };

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, focusWindow, minimizeWindow }}>
      {children}
    </WindowContext.Provider>
  );
};

// EXPORT 2: El Hook
export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error("useWindows must be used within a WindowProvider");
  return context;
};