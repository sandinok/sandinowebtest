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

const STORAGE_KEY = 'sandino-windows';
const BASE_Z = 100;

// cascada inicial, con clamp
const generateInitialPosition = (index: number, ww: number, wh: number): Vec2 => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const x = Math.max(24, Math.min(vw - ww - 24, 80 + index * 24));
  const y = Math.max(24, Math.min(vh - wh - 24, 80 + index * 24));
  return { x, y };
};

const snapToGrid = (v: number, grid = 8) => Math.round(v / grid) * grid;

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowModel[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as WindowModel[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map(w => ({
        id: String(w.id),
        title: String(w.title ?? ''),
        isOpen: !!w.isOpen,
        isMinimized: !!w.isMinimized,
        isMaximized: !!w.isMaximized,
        position: w.position ?? { x: 120, y: 120 },
        size: w.size ?? { width: 600, height: 400 },
        zIndex: Number.isFinite(w.zIndex) ? w.zIndex : BASE_Z,
      }));
    } catch {
      return [];
    }
  });

  const [maxZ, setMaxZ] = useState<number>(() => {
    return windows.length ? Math.max(BASE_Z, ...windows.map(w => w.zIndex)) : BASE_Z;
  });

  // Persistencia ligera
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    } catch {}
  }, [windows]);

  // Sincroniza max Z si carga desde storage modifica
  useEffect(() => {
    const mz = windows.length ? Math.max(BASE_Z, ...windows.map(w => w.zIndex)) : BASE_Z;
    if (mz !== maxZ) setMaxZ(mz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows]);

  const bumpZ = useCallback(() => setMaxZ(z => z + 1), []);

  const openWindow = useCallback((id: string, title: string) => {
    setWindows(prev => {
      const i = prev.findIndex(w => w.id === id);
      if (i !== -1) {
        const next = [...prev];
        next[i] = { ...next[i], isOpen: true, isMinimized: false, zIndex: maxZ + 1 };
        return next;
      }
      const size = { width: 600, height: 400 };
      const openCount = prev.filter(w => w.isOpen).length;
      const position = generateInitialPosition(openCount, size.width, size.height);
      const nw: WindowModel = {
        id, title, isOpen: true, isMinimized: false, isMaximized: false,
        position, size, zIndex: maxZ + 1,
      };
      return [...prev, nw];
    });
    bumpZ();
  }, [maxZ, bumpZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isOpen: false, isMinimized: false } : w)));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w)));
    bumpZ();
  }, [maxZ, bumpZ]);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w)));
    bumpZ();
  }, [maxZ, bumpZ]);

  const updateWindowPosition = useCallback((id: string, position: Vec2) => {
    // Clamp + snap suave para evitar jitter visual
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) return w;
      const maxX = Math.max(0, vw - w.size.width);
      const maxY = Math.max(0, vh - w.size.height);
      const nx = Math.min(Math.max(0, position.x), maxX);
      const ny = Math.min(Math.max(0, position.y), maxY);
      return { ...w, position: { x: snapToGrid(nx, 4), y: snapToGrid(ny, 4) } };
    }));
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size2) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) return w;
      const width = Math.min(Math.max(360, size.width), vw);
      const height = Math.min(Math.max(260, size.height), vh);
      // clamp posición si se pasa
      const maxX = Math.max(0, vw - width);
      const maxY = Math.max(0, vh - height);
      const x = Math.min(Math.max(0, w.position.x), maxX);
      const y = Math.min(Math.max(0, w.position.y), maxY);
      return { ...w, size: { width, height }, position: { x, y } };
    }));
  }, []);

  const ctx = useMemo<WindowContextType>(() => ({
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

  // Clamp automático en resize viewport, con rAF throttle
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setWindows(prev => prev.map(w => {
          if (!w.isOpen || w.isMaximized) return w;
          const width = Math.min(w.size.width, vw);
          const height = Math.min(w.size.height, vh);
          const maxX = Math.max(0, vw - width);
          const maxY = Math.max(0, vh - height);
          const x = Math.min(Math.max(0, w.position.x), maxX);
          const y = Math.min(Math.max(0, w.position.y), maxY);
          if (x === w.position.x && y === w.position.y && width === w.size.width && height === w.size.height) return w;
          return { ...w, size: { width, height }, position: { x, y } };
        }));
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <WindowContext.Provider value={ctx}>{children}</WindowContext.Provider>;
};
