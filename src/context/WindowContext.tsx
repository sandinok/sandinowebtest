// src/context/WindowContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
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
  minimizedPosition?: number;
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
  getMinimizedWindows: () => WindowModel[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used within a WindowProvider');
  return ctx;
};

// posición inicial en cascada, clamped a viewport
const generateInitialPosition = (index: number, windowWidth: number, windowHeight: number): Vec2 => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const x = Math.max(32, Math.min(vw - windowWidth - 32, 96 + index * 28));
  const y = Math.max(24, Math.min(vh - windowHeight - 24, 96 + index * 28));
  return { x, y };
};

const STORAGE_KEY = 'sandino-windows';
const BASE_Z = 100;

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // cargar estado (safe parse)
  const [windows, setWindows] = useState<WindowModel[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as WindowModel[];
      // saneamiento mínimo de datos
      return Array.isArray(parsed) ? parsed.map(w => ({
        id: String(w.id),
        title: String(w.title ?? ''),
        isOpen: !!w.isOpen,
        isMinimized: !!w.isMinimized,
        isMaximized: !!w.isMaximized,
        position: w.position ?? { x: 120, y: 120 },
        size: w.size ?? { width: 600, height: 400 },
        zIndex: Number.isFinite(w.zIndex) ? w.zIndex : BASE_Z,
        minimizedPosition: w.minimizedPosition,
      })) : [];
    } catch {
      return [];
    }
  });

  // track del zIndex máximo (evita recorrer en cada bringToFront)
  const [maxZIndex, setMaxZIndex] = useState<number>(() => {
    if (!windows.length) return BASE_Z;
    return Math.max(BASE_Z, ...windows.map(w => w.zIndex));
  });

  // persistir cambios de ventanas (throttle implícito por batch react)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    } catch {
      // noop si storage está lleno o deshabilitado
    }
  }, [windows]);

  // sincronizar maxZIndex cuando cambian ventanas (si vinieron del storage)
  useEffect(() => {
    const mz = windows.length ? Math.max(BASE_Z, ...windows.map(w => w.zIndex)) : BASE_Z;
    if (mz !== maxZIndex) setMaxZIndex(mz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows]);

  const bumpZ = useCallback(() => setMaxZIndex(z => z + 1), []);

  const getMinimizedWindows = useCallback(() => {
    // no memoizamos el resultado (se usa poco y es O(n))
    return windows.filter(w => w.isOpen && w.isMinimized);
  }, [windows]);

  const openWindow = useCallback((id: string, title: string) => {
    setWindows(prev => {
      const i = prev.findIndex(w => w.id === id);
      if (i !== -1) {
        // restaurar si ya existe
        const next = [...prev];
        const w = next[i];
        next[i] = { ...w, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 };
        return next;
      }
      // crear nueva
      const openCount = prev.filter(w => w.isOpen).length;
      const size = { width: 600, height: 400 };
      const position = generateInitialPosition(openCount, size.width, size.height);
      const nw: WindowModel = {
        id,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position,
        size,
        zIndex: maxZIndex + 1,
      };
      return [...prev, nw];
    });
    bumpZ();
  }, [maxZIndex, bumpZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isOpen: false, isMinimized: false } : w)));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const w = prev.find(x => x.id === id);
      if (!w || !w.isOpen || w.isMinimized) return prev;
      return prev.map(x => (x.id === id ? { ...x, isMinimized: true } : x));
    });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w)));
    bumpZ();
  }, [maxZIndex, bumpZ]);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w)));
    bumpZ();
  }, [maxZIndex, bumpZ]);

  const updateWindowPosition = useCallback((id: string, position: Vec2) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, position } : w)));
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size2) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, size } : w)));
  }, []);

  // Corrección: clamp de ventanas al redimensionar viewport (opcional)
  useEffect(() => {
    const onResize = () => {
      setWindows(prev => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let changed = false;
        const next = prev.map(w => {
          if (!w.isOpen || w.isMaximized) return w;
          const maxX = Math.max(0, vw - w.size.width);
          const maxY = Math.max(0, vh - w.size.height);
          const nx = Math.min(Math.max(0, w.position.x), maxX);
          const ny = Math.min(Math.max(0, w.position.y), maxY);
          if (nx !== w.position.x || ny !== w.position.y) {
            changed = true;
            return { ...w, position: { x: nx, y: ny } };
          }
          return w;
        });
        return changed ? next : prev;
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const contextValue = useMemo<WindowContextType>(() => ({
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
    getMinimizedWindows,
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
    getMinimizedWindows,
  ]);

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};
