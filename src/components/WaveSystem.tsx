// src/components/WaveSystem.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Componente de partículas flotantes optimizadas
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        positions[i + 1] += Math.sin(time * 0.5 + idx * 0.1) * 0.01;
        
        if (positions[i + 1] > 5) {
          positions[i + 1] = -1;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={60}
          array={new Float32Array([
            ...Array.from({length: 180}, (_, i) => {
              if (i % 3 === 0) return (Math.random() - 0.5) * 40;
              if (i % 3 === 1) return Math.random() * 6 - 1;
              return (Math.random() - 0.5) * 40;
            })
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#14b8a6"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Malla de ondas realista y optimizada
const RealisticWave = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.6;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        
        // Combinar múltiples ondas para efecto realista
        const wave1 = Math.sin(x * 0.15 + time) * 0.35;
        const wave2 = Math.sin(z * 0.2 + time * 0.7) * 0.25;
        const wave3 = Math.sin((x + z) * 0.1 + time * 0.4) * 0.2;
        const wave4 = Math.sin(Math.sqrt(x * x + z * z) * 0.07 + time * 0.3) * 0.15;
        
        // Atenuación basada en distancia al centro
        const distance = Math.sqrt(x * x + z * z);
        const attenuation = Math.max(0, 1 - distance * 0.02);
        
        const finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
        positions.setY(i, finalHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
      
      // Rotación suave para efecto 3D
      meshRef.current.rotation.z = Math.sin(time * 0.08) * 0.015;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, -2.5, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry ref={geometryRef} args={[50, 50, 80, 80]} />
      <meshStandardMaterial
        color="#10b981"
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        metalness={0.15}
        roughness={0.1}
        emissive="#059669"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70vh] z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 8, 25], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance",
          stencil: false
        }}
        performance={{ min: 0.8 }}
        frameloop="always"
      >
        <ambientLight intensity={0.4} color="#e0f7fa" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.5} 
          color="#ffffff"
        />
        <hemisphereLight 
          intensity={0.3} 
          groundColor="#0d9488" 
          color="#e0f7fa" 
        />
        
        <RealisticWave />
        <FloatingParticles />
        <fog attach="fog" args={['#0d9488', 25, 70]} />
      </Canvas>
    </div>
  );
};
