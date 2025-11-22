import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// El terreno "Grid" estilo Synthwave
const RetroGrid = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorGrid: { value: new THREE.Color('#ff00de') }, // Magenta Neón
    uColorBg: { value: new THREE.Color('#0f0518') }    // Púrpura oscuro
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[80, 80, 40, 40]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            // Efecto de movimiento infinito (conducción)
            float speed = uTime * 0.5;
            // Curvatura del mundo (horizonte)
            float dist = length(pos.xy);
            pos.z -= dist * dist * 0.02; 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorGrid;
          uniform vec3 uColorBg;

          void main() {
            // Crear la rejilla
            float speed = uTime * 0.2;
            vec2 gridUv = vUv * 40.0;
            gridUv.y += speed * 20.0; // Movimiento vertical

            float gridX = step(0.95, fract(gridUv.x));
            float gridY = step(0.95, fract(gridUv.y));
            float grid = max(gridX, gridY);

            // Desvanecer en el horizonte
            float alpha = smoothstep(0.0, 0.4, vUv.y); 
            
            vec3 color = mix(uColorBg, uColorGrid, grid);
            // Añadir brillo al grid
            color += grid * 0.5;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
};

// El Sol Retro de los 80s
const RetroSun = () => {
  return (
    <mesh position={[0, 5, -20]}>
      <circleGeometry args={[8, 32]} />
      <meshBasicMaterial color={"#ffaa00"} transparent opacity={0.8}>
        {/* Truco simple para las rayas del sol: usar una textura de gradiente o shader simple */}
      </meshBasicMaterial>
      {/* Usamos un gradiente CSS en el div padre para el efecto de rayas del sol, es más barato */}
    </mesh>
  );
};

export const CityBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4e] to-[#000000]">
      {/* El Sol Retro CSS (para mejor rendimiento que shader complejo) */}
      <div 
        className="absolute left-1/2 top-[30%] -translate-x-1/2 w-64 h-64 rounded-full"
        style={{
          background: 'linear-gradient(to bottom, #ffeb3b 0%, #ff00de 60%, transparent 60%, transparent 65%, #ff00de 65%, #ff00de 100%)',
          boxShadow: '0 0 60px #ff00de',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }}
      />
      
      <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
        <fog attach="fog" args={['#1a0b2e', 5, 25]} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
        <RetroGrid />
      </Canvas>
      
      {/* Viñeta para oscurecer bordes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60 pointer-events-none" />
    </div>
  );
};