// src/context/WindowContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';

type Vec2 = { x: number; y: number };
type Size2 = { width: number; height: number };

export interface WindowModel {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: Vec2;
  size: Size2;
  zIndex: number;
  lastPosition?: Vec2; // Para restaurar después de maximizar
  lastSize?: Size2; // Para restaurar después de maximizar
}

interface WindowContextType {
  windows: WindowModel[];
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: Vec2) => void;
  updateWindowSize: (id: string, size: Size2) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used within a WindowProvider');
  return ctx;
};

const BASE_Z = 1000;
const DEFAULT_SIZE = { width: 800, height: 600 };

const generateInitialPosition = (index: number, size: Size2): Vec2 => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  const cascade = 50 + index * 40;
  const maxX = Math.max(0, vw - size.width - 40);
  const maxY = Math.max(0, vh - size.height - 80);
  
  const x = Math.min(cascade, maxX);
  const y = Math.min(cascade, maxY);
  
  return { x, y };
};

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowModel[]>([]);
  const maxZRef = useRef(BASE_Z);

  const bumpZ = useCallback(() => {
    maxZRef.current += 1;
    return maxZRef.current;
  }, []);

  const openWindow = useCallback((id: string, title: string) => {
    setWindows(prev => {
      const existingIndex = prev.findIndex(w => w.id === id);
      
      if (existingIndex !== -1) {
        // Ventana ya existe, solo la abrimos y traemos al frente
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          isOpen: true,
          isMinimized: false,
          zIndex: bumpZ()
        };
        return updated;
      }

      // Nueva ventana
      const openCount = prev.filter(w => w.isOpen && !w.isMinimized).length;
      const position = generateInitialPosition(openCount, DEFAULT_SIZE);

      const newWindow: WindowModel = {
        id,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position,
        size: DEFAULT_SIZE,
        zIndex: bumpZ(),
      };

      return [...prev, newWindow];
    });
  }, [bumpZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, isOpen: false, isMinimized: false, isMaximized: false }
          : w
      )
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, isMinimized: true } : w
      )
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => {
        if (w.id !== id) return w;
        
        if (w.isMaximized) {
          // Restaurar
          return {
            ...w,
            isMaximized: false,
            position: w.lastPosition || w.position,
            size: w.lastSize || w.size,
            lastPosition: undefined,
            lastSize: undefined,
          };
        } else {
          // Maximizar
          return {
            ...w,
            isMaximized: true,
            lastPosition: w.position,
            lastSize: w.size,
            position: { x: 0, y: 0 },
            size: { 
              width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
              height: typeof window !== 'undefined' ? window.innerHeight : 1080 
            },
          };
        }
      })
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, isMinimized: false, zIndex: bumpZ() }
          : w
      )
    );
  }, [bumpZ]);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, zIndex: bumpZ() } : w
      )
    );
  }, [bumpZ]);

  const updateWindowPosition = useCallback((id: string, position: Vec2) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, position } : w
      )
    );
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size2) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, size } : w
      )
    );
  }, []);

  const contextValue = useMemo(() => ({
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
  }), [
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
  ]);

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};
