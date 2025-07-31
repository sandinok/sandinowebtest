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
      
      // Animar partículas flotantes
      for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        positions[i + 1] += Math.sin(time * 0.5 + idx * 0.1) * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={80}
          array={new Float32Array([
            ...Array.from({length: 240}, (_, i) => {
              if (i % 3 === 0) return (Math.random() - 0.5) * 40; // x
              if (i % 3 === 1) return Math.random() * 8 - 2; // y
              return (Math.random() - 0.5) * 40; // z
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

// Malla de ondas 2.5D optimizada
const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.8;

      // Calcular alturas de ondas con múltiples componentes
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        
        // Combinar múltiples ondas para efecto realista
        const wave1 = Math.sin(x * 0.2 + time * 1.2) * 0.4;
        const wave2 = Math.sin(z * 0.3 + time * 0.9) * 0.3;
        const wave3 = Math.sin((x + z) * 0.15 + time * 0.6) * 0.2;
        const wave4 = Math.sin(Math.sqrt(x * x + z * z) * 0.08 + time * 0.4) * 0.15;
        
        // Atenuación basada en distancia al centro
        const distance = Math.sqrt(x * x + z * z);
        const attenuation = Math.max(0, 1 - distance * 0.02);
        
        const finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
        positions.setY(i, finalHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
      
      // Rotación suave para efecto 3D
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.02;
    }
  });

  return (
    <group>
      {/* Ola principal con efecto de profundidad */}
      <mesh 
        ref={meshRef} 
        position={[0, -3, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry ref={geometryRef} args={[50, 50, 80, 80]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          metalness={0.2}
          roughness={0.1}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Partículas flotantes */}
      <FloatingParticles />
    </group>
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
          antialias: false, // Desactivado para mejor rendimiento
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        shadows={false} // Desactivado para mejor rendimiento
        performance={{ min: 0.8 }}
      >
        {/* Iluminación optimizada */}
        <ambientLight intensity={0.5} color="#e0f7fa" />
        <directionalLight 
          position={[15, 15, 8]} 
          intensity={1.5} 
          color="#ffffff"
        />
        <directionalLight 
          position={[-8, 12, -8]} 
          intensity={0.8} 
          color="#10b981" 
        />
        
        <WaveMesh />
        <fog attach="fog" args={['#10b981', 20, 60]} />
      </Canvas>
    </div>
  );
};
