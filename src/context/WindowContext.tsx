
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimizedPosition?: number;
}

interface WindowContextType {
  windows: Window[];
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
};

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [minimizedCount, setMinimizedCount] = useState(0);

  // Load windows from localStorage on mount
  useEffect(() => {
    const savedWindows = localStorage.getItem('sandino-windows');
    if (savedWindows) {
      try {
        const parsedWindows = JSON.parse(savedWindows);
        setWindows(parsedWindows);
        
        // Find the highest zIndex to set maxZIndex properly
        const highestZIndex = Math.max(...parsedWindows.map((w: Window) => w.zIndex), 100);
        setMaxZIndex(highestZIndex);
        
        // Count minimized windows
        const minimizedWindowsCount = parsedWindows.filter((w: Window) => w.isMinimized && w.isOpen).length;
        setMinimizedCount(minimizedWindowsCount);
      } catch (error) {
        console.error("Error loading windows from localStorage:", error);
      }
    }
  }, []);
  
  // Save windows to localStorage whenever they change
  useEffect(() => {
    if (windows.length > 0) {
      localStorage.setItem('sandino-windows', JSON.stringify(windows));
    }
  }, [windows]);

  const openWindow = (id: string, title: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 } : w);
      }
      
      const newWindow: Window = {
        id,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: { x: Math.max(50, Math.min(window.innerWidth - 650, 100 + prev.length * 40)), 
                   y: Math.max(50, Math.min(window.innerHeight - 450, 100 + prev.length * 40)) },
        size: { width: 600, height: 400 },
        zIndex: maxZIndex + 1,
      };
      
      setMaxZIndex(prev => prev + 1);
      return [...prev, newWindow];
    });
  };

  const closeWindow = (id: string) => {
    setWindows(prev => {
      const updatedWindows = prev.map(w => {
        if (w.id === id) {
          // If window was minimized, decrease minimized count
          if (w.isMinimized && w.isOpen) {
            setMinimizedCount(count => Math.max(0, count - 1));
          }
          return { ...w, isOpen: false, isMinimized: false };
        }
        return w;
      });
      return updatedWindows;
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => {
      const windowToMinimize = prev.find(w => w.id === id);
      if (!windowToMinimize || (windowToMinimize.isMinimized && windowToMinimize.isOpen)) return prev;
      
      // Increment minimized count for a new minimized window
      if (windowToMinimize.isOpen && !windowToMinimize.isMinimized) {
        setMinimizedCount(count => count + 1);
      }
      
      return prev.map(w => w.id === id ? { 
        ...w, 
        isMinimized: true,
        minimizedPosition: minimizedCount
      } : w);
    });
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const bringToFront = (id: string) => {
    setMaxZIndex(prev => prev + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      bringToFront,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  );
};
