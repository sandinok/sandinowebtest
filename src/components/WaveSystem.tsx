// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Componente de partículas optimizado
const OptimizedParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 150;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 15 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      
      cols[i * 3] = 0.1 + Math.random() * 0.3;
      cols[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      cols[i * 3 + 2] = 0.5 + Math.random() * 0.3;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionArray[i3 + 1] += Math.sin(time * 0.8 + i * 0.1) * 0.002 + 0.01;
        
        if (positionArray[i3 + 1] > 12) {
          positionArray[i3 + 1] = -3;
          positionArray[i3] = (Math.random() - 0.5) * 80;
          positionArray[i3 + 2] = (Math.random() - 0.5) * 80;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
};

// Malla de ondas optimizada
const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.8;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Ondas combinadas para efecto realista
        const wave1 = Math.sin(x * 0.2 + time * 1.5) * 0.6;
        const wave2 = Math.sin(y * 0.3 + time * 1.2) * 0.4;
        const wave3 = Math.sin((x + y) * 0.15 + time * 0.8) * 0.3;
        const wave4 = Math.sin(Math.sqrt(x * x + y * y) * 0.08 + time * 0.6) * 0.25;
        
        const distance = Math.sqrt(x * x + y * y);
        const attenuation = Math.max(0, 1 - distance * 0.015);
        
        const finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
        positions.setZ(i, finalHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
      
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.03;
    }
  });

  return (
    <group>
      {/* Ola principal */}
      <mesh 
        ref={meshRef} 
        position={[0, -4, 0]} 
        rotation={[-Math.PI / 4, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry ref={geometryRef} args={[50, 50, 120, 120]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          metalness={0.2}
          roughness={0.1}
          emissive="#059669"
          emissiveIntensity={0.3}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Ola secundaria */}
      <mesh 
        position={[0, -4.8, 0]} 
        rotation={[-Math.PI / 3.5, 0, Math.PI / 8]}
        receiveShadow
      >
        <planeGeometry args={[40, 40, 100, 100]} />
        <meshStandardMaterial
          color="#14b8a6"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.2}
          emissive="#0d9488"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Partículas flotantes */}
      <OptimizedParticles />
    </group>
  );
};

// Componente principal del sistema de ondas
export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[75vh] z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 12, 25], fov: 65 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        shadows="soft"
        performance={{ min: 0.8 }}
      >
        {/* Iluminación optimizada */}
        <ambientLight intensity={0.6} color="#e0f7fa" />
        <directionalLight 
          position={[15, 15, 8]} 
          intensity={2} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <directionalLight 
          position={[-8, 12, -8]} 
          intensity={1.2} 
          color="#10b981" 
        />
        <pointLight 
          position={[0, 8, 5]} 
          intensity={1} 
          color="#14b8a6"
          distance={40}
          decay={2}
        />
        
        <WaveMesh />
        <fog attach="fog" args={['#10b981', 20, 60]} />
      </Canvas>
    </div>
  );
};
