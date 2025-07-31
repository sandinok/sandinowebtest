// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Componente de partículas optimizado
const OptimizedParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100; // Reducido para mejor rendimiento
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      cols[i * 3] = 0.2 + Math.random() * 0.2;
      cols[i * 3 + 1] = 0.7 + Math.random() * 0.2;
      cols[i * 3 + 2] = 0.5 + Math.random() * 0.2;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionArray[i3 + 1] += Math.sin(time * 0.6 + i * 0.1) * 0.0015 + 0.008;
        
        if (positionArray[i3 + 1] > 8) {
          positionArray[i3 + 1] = -2;
          positionArray[i3] = (Math.random() - 0.5) * 60;
          positionArray[i3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.015;
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
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
};

// Malla de ondas corregida
const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.6;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Ondas combinadas corregidas
        const wave1 = Math.sin(x * 0.15 + time * 1.2) * 0.5;
        const wave2 = Math.sin(y * 0.25 + time * 1.0) * 0.35;
        const wave3 = Math.sin((x + y) * 0.12 + time * 0.7) * 0.25;
        const wave4 = Math.sin(Math.sqrt(x * x + y * y) * 0.07 + time * 0.5) * 0.2;
        
        const distance = Math.sqrt(x * x + y * y);
        const attenuation = Math.max(0, 1 - distance * 0.012);
        
        const finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
        positions.setZ(i, finalHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
      
      meshRef.current.rotation.z = Math.sin(time * 0.08) * 0.02;
    }
  });

  return (
    <group>
      {/* Ola principal */}
      <mesh 
        ref={meshRef} 
        position={[0, -3, 0]} 
        rotation={[-Math.PI / 4, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry ref={geometryRef} args={[40, 40, 100, 100]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.1}
          emissive="#059669"
          emissiveIntensity={0.25}
        />
      </mesh>
      
      {/* Ola secundaria */}
      <mesh 
        position={[0, -3.7, 0]} 
        rotation={[-Math.PI / 3.8, 0, Math.PI / 10]}
        receiveShadow
      >
        <planeGeometry args={[35, 35, 80, 80]} />
        <meshStandardMaterial
          color="#14b8a6"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          metalness={0.25}
          roughness={0.15}
          emissive="#0d9488"
          emissiveIntensity={0.15}
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
    <div className="fixed bottom-0 left-0 right-0 h-[70vh] z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 10, 20], fov: 60 }}
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
        <ambientLight intensity={0.5} color="#e0f7fa" />
        <directionalLight 
          position={[12, 12, 6]} 
          intensity={1.8} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={80}
        />
        <directionalLight 
          position={[-6, 10, -6]} 
          intensity={1.0} 
          color="#10b981" 
        />
        <pointLight 
          position={[0, 6, 4]} 
          intensity={0.8} 
          color="#14b8a6"
          distance={30}
          decay={2}
        />
        
        <WaveMesh />
        <fog attach="fog" args={['#10b981', 15, 50]} />
      </Canvas>
    </div>
  );
};
