
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_IMAGES = {
  bubble: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yMFQxOToyMToyNCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0yMFQxOToyMToyNCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOTUyZmQ5OS1kYWY5LTA1NDQtYmM1MC1lYjE2MmUyMmM2M2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3M2E1YmIxNS0zNDM0LTlhNDItYTRhMi1hNTNiZmZjZDU1NjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphYzY0MzMzYS00NGViLTNkNDYtYmQ2Yi03YTVkODYwZGFhMDgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYzY0MzMzYS00NGViLTNkNDYtYmQ2Yi03YTVkODYwZGFhMDgiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjBUMTk6MjE6MjQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Mzk1MmZkOTktZGFmOS0wNTQ0LWJjNTAtZWIxNjJlMjJjNjNmIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTIwVDE5OjIxOjI0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bNeihQAAC5tJREFUeJzVm3tw1NUVxz+/3c1CXrCEZyDhkQQpYKE8hgkPAwxQJggYhlHHMrZjxRHrOGm107TO6LSdVju109YRlT6GKQOCBDIMZQINDwMYCASoKDZECe9AAkl4ZLPZvefv3ce+s5sNkOL3P+/v3HN/v3PuPffce34RWmsqS0Sk91vrn98D3A/0A9oDnWs1uBnIA7KBTcDiQH35hdXll6ovXNKae64AK0n9gGXAVOrK4KmhDb0ZBt41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",
  leaf: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yMFQxOToyMTozNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0yMFQxOToyMTozNiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NjNjYzBlYS03ZWUzLTRkNDUtOGNlMS1jODdiYTYxYWQ0ZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5OGM2OTBkNC1lMTU2LWJiNGEtOGY0OS1jNGVkNjdmZjE1ZDgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphZWNjYjgzMi0yYWQ2LTlmNGYtYTQwNS03OWFmYmJiNmQ3NGUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWNjYjgzMi0yYWQ2LTlmNGYtYTQwNS03OWFmYmJiNmQ3NGUiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjBUMTk6MjE6MzYrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjYzY2MwZWEtN2VlMy00ZDQ1LThjZTEtYzg3YmE2MWFkNGVjIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTIwVDE5OjIxOjM2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aegQ7wAADJFJREFUeJzFm3lwVdUZwH/33psgdUhhbVhiIEYQKGJLqDgEh8UBMRYGukA7gxZarW072A6dlpm267TTaetMkeJSlFHaCgpS0KK0FCjIUtZaICRACBQSE0LMQoDkvezeU/7xvvveyxIgL4kzv5k37937znd+55zvbOecK7TWPCSYbiagB8SIEemdYsXsxCCzgeEYIkNrzVAhukYAFRhkJMoUKBdCbALWALsNI6f8QQlyZxLgZnwAsBBY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",
  note: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGxmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDEtMDhUMjA6MzU6NDQtMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRmYWM0NTg1LTU0MGEtOTY0Yi1hYWJkLTUwYjY1N2ZmM2U1YSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjE0YzE2NzkzLTUyZTQtZWQ0MS1iMTQyLTQxYWEzZDcyNGM5MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjM5MDJkZWYzLWZjMjMtZTg0OS04Yjk2LTY1ZjEyNjY4MTYwNCI+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+TXVzaWMgRXZlbnQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozOTAyZGVmMy1mYzIzLWU4NDktOGI5Ni02NWYxMjY2ODE2MDQiIHN0RXZ0OndoZW49IjIwMjAtMDUtMDRUMTk6MTE6MzkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGZhYzQ1ODUtNTQwYS05NjRiLWFhYmQtNTBiNjU3ZmYzZTVhIiBzdEV2dDp3aGVuPSIyMDIwLTA5LTI5VDE1OjQ4OjU1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6D88wjAAAMJElEQVR4nMWbe4xcVR3HP+fOzO6WUtrCIgVaKK0IfaHAttSItkhLg5AGMVEN8Q8FIgVUfCAIJCZG0cRXSH3FhP+MTSQay0NDI0qtAkpbtWFpy65dedVuu9vuY2fu8Y/fuefee2fvzJ3ZlpPc7My9vznn9/7dxznnLsw156mREBG5dvW5zcDlwJeBTwMX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"
};

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create image objects for each particle type
    const images: { [key: string]: HTMLImageElement } = {};
    Object.entries(PARTICLE_IMAGES).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      images[key] = img;
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partículas de diferentes tipos con información de capa para efecto parallax
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: string;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      layer: number; // 1 = front, 2 = middle, 3 = back (for parallax)
    }> = [];

    // Crear partículas iniciales con distribución por capas
    for (let i = 0; i < 120; i++) {
      const layer = Math.floor(Math.random() * 3) + 1; // 1, 2 or 3
      const layerFactor = 1 / layer; // Particles in back layers move slower
      const types = ['bubble', 'leaf', 'note'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6 * layerFactor,
        vy: -Math.random() * 0.6 * layerFactor - 0.1 * layerFactor,
        size: Math.random() * 10 + 10 + (4 - layer) * 5, // Bigger particles in front layers
        type: type,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02 * layerFactor,
        layer: layer
      });
    }

    // Track mouse for interactive particles
    const mouse = { x: 0, y: 0, moving: false };
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moving = true;
      
      // Check if we should create a sparkle
      if (Math.abs(mouse.x - lastMouseX) > 5 || Math.abs(mouse.y - lastMouseY) > 5) {
        // Add a sparkle at mouse position
        if (Math.random() > 0.7) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: Math.random() * 8 + 4,
            type: 'bubble',
            opacity: 0.9,
            rotation: 0,
            rotationSpeed: 0,
            layer: 1
          });
        }
        
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;
      }
      
      // Reset moving flag after a delay
      setTimeout(() => {
        mouse.moving = false;
      }, 100);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We'll render particles by layer, starting with the back layer
      for (let layer = 3; layer >= 1; layer--) {
        const layerParticles = particles.filter(p => p.layer === layer);
        
        layerParticles.forEach((particle, index) => {
          // Actualizar posición con movimiento suave
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;
          
          // Interactividad con el ratón
          if (mouse.moving && layer === 1) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const force = 0.3 * (1 - dist / 150);
              particle.vx += -dx * force / dist;
              particle.vy += -dy * force / dist;
            }
          }

          // Aplicar un poco de aceleración según el tipo de partícula
          if (particle.type === 'bubble') {
            particle.vy -= 0.005 / particle.layer; // Burbujas suben más lento en capas traseras
            // Añadir un movimiento ondulatorio suave
            particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.003;
          } else if (particle.type === 'leaf') {
            particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.015; // Hojas oscilan
            particle.vy += 0.003 / particle.layer; // Hojas caen lentamente
            // Rotación natural para hojas
            particle.rotationSpeed = Math.sin(Date.now() * 0.0005 + index) * 0.01;
          } else if (particle.type === 'note') {
            particle.vx = Math.sin(Date.now() * 0.001 + index) * 0.2 / particle.layer; // Notas oscilan lateralmente
            particle.vy -= 0.002 / particle.layer; // Notas suben lentamente
          }

          // Limitar velocidad máxima según la capa
          const maxSpeed = 2 / particle.layer;
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
          }

          // Resetear partículas que salen de la pantalla
          if (particle.y < -50) {
            particle.y = canvas.height + 50;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.y > canvas.height + 50) {
            particle.y = -50;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.x < -50) {
            particle.x = canvas.width + 50;
          }
          if (particle.x > canvas.width + 50) {
            particle.x = -50;
          }

          // Dibujar partícula según tipo con imágenes
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.globalAlpha = particle.opacity;
          
          if (images[particle.type] && images[particle.type].complete) {
            const size = particle.size * 2;
            ctx.drawImage(
              images[particle.type], 
              -size/2, 
              -size/2, 
              size, 
              size
            );
          }
          
          ctx.restore();
        });
      }

      requestAnimationFrame(animate);
    };

    // Wait for images to load
    const loadImages = () => {
      let allLoaded = true;
      Object.values(images).forEach(img => {
        if (!img.complete) allLoaded = false;
      });

      if (allLoaded) {
        animate();
      } else {
        setTimeout(loadImages, 100);
      }
    };

    loadImages();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
