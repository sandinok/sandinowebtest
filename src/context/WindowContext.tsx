// src/context/WindowContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';

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
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  getMinimizedWindows: () => Window[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
};

// Función para generar posición inicial de ventanas
const generateInitialPosition = (index: number, windowWidth: number, windowHeight: number) => ({
  x: Math.max(50, Math.min(window.innerWidth - windowWidth - 50, 100 + index * 30)),
  y: Math.max(50, Math.min(window.innerHeight - windowHeight - 50, 100 + index * 30))
});

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>(() => {
    // Estado inicial desde localStorage o vacío
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandino-windows');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved windows:', e);
        }
      }
    }
    return [];
  });
  
  const [maxZIndex, setMaxZIndex] = useState(100);

  // Guardar en localStorage cuando cambian las ventanas
  useEffect(() => {
    localStorage.setItem('sandino-windows', JSON.stringify(windows));
  }, [windows]);

  // Actualizar maxZIndex cuando cambian las ventanas
  useEffect(() => {
    const highestZIndex = Math.max(...windows.map(w => w.zIndex), 100);
    setMaxZIndex(highestZIndex);
  }, [windows]);

  // Obtener ventanas minimizadas (memoizado para performance)
  const getMinimizedWindows = useCallback(() => {
    return windows.filter(w => w.isOpen && w.isMinimized);
  }, [windows]);

  // Abrir o restaurar una ventana
  const openWindow = useCallback((id: string, title: string) => {
    setWindows(prev => {
      const existingIndex = prev.findIndex(w => w.id === id);
      
      if (existingIndex !== -1) {
        // Si existe, restaurarla
        const existing = prev[existingIndex];
        const updatedWindow = {
          ...existing,
          isOpen: true,
          isMinimized: false,
          zIndex: maxZIndex + 1
        };
        
        const newWindows = [...prev];
        newWindows[existingIndex] = updatedWindow;
        return newWindows;
      }
      
      // Crear nueva ventana
      const newWindow: Window = {
        id,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: generateInitialPosition(prev.filter(w => w.isOpen).length, 600, 400),
        size: { width: 600, height: 400 },
        zIndex: maxZIndex + 1,
      };
      
      return [...prev, newWindow];
    });
    
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  // Cerrar una ventana
  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const windowToClose = prev.find(w => w.id === id);
      if (!windowToClose || !windowToClose.isOpen) return prev;
      
      return prev.map(w => 
        w.id === id ? { ...w, isOpen: false, isMinimized: false } : w
      );
    });
  }, []);

  // Minimizar una ventana
  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const windowToMinimize = prev.find(w => w.id === id);
      if (!windowToMinimize || !windowToMinimize.isOpen || windowToMinimize.isMinimized) {
        return prev;
      }
      
      return prev.map(w => 
        w.id === id ? { ...w, isMinimized: true } : w
      );
    });
  }, []);

  // Maximizar/restaurar una ventana
  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, []);

  // Restaurar una ventana minimizada
  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => {
      const windowToRestore = prev.find(w => w.id === id);
      if (!windowToRestore || !windowToRestore.isOpen) return prev;
      
      return prev.map(w => 
        w.id === id ? { 
          ...w, 
          isMinimized: false,
          zIndex: maxZIndex + 1
        } : w
      );
    });
    
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  // Traer ventana al frente
  const bringToFront = useCallback((id: string) => {
    setWindows(prev => {
      const windowToFocus = prev.find(w => w.id === id);
      if (!windowToFocus || !windowToFocus.isOpen) return prev;
      
      return prev.map(w => 
        w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
      );
    });
    
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  // Actualizar posición de ventana
  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, position } : w
      )
    );
  }, []);

  // Actualizar tamaño de ventana
  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, size } : w
      )
    );
  }, []);

  // Valor del contexto optimizado con useMemo
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
    getMinimizedWindows
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
    getMinimizedWindows
  ]);

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};
