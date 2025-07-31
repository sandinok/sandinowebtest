// src/components/WaveSystem.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Componente de partículas MUY SIMPLE
const SimpleParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={new Float32Array([
            ...Array.from({length: 150}, () => (Math.random() - 0.5) * 30),
            ...Array.from({length: 150}, () => Math.random() * 5 - 1),
            ...Array.from({length: 150}, () => (Math.random() - 0.5) * 30)
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#14b8a6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Malla de ondas MÍNIMA
const SimpleWave = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.5;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Onda simple
        const wave = Math.sin(x * 0.1 + time) * 0.3 + 
                     Math.sin(y * 0.15 + time * 0.8) * 0.2;
        
        positions.setZ(i, wave);
      }
      
      positions.needsUpdate = true;
      meshRef.current.rotation.z = Math.sin(time * 0.05) * 0.01;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, -2, 0]} 
      rotation={[-Math.PI / 4, 0, 0]}
    >
      <planeGeometry ref={geometryRef} args={[30, 30, 50, 50]} />
      <meshStandardMaterial
        color="#10b981"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60vh] z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: false, // Desactivar antialias para mejor rendimiento
          powerPreference: "high-performance"
        }}
        frameloop="always" // O "demand" si no necesitas animación constante
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <SimpleWave />
        <SimpleParticles />
        <fog attach="fog" args={['#10b981', 10, 40]} />
      </Canvas>
    </div>
  );
};
