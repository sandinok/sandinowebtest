
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  
  // Pre-calcular posiciones para mejor rendimiento
  const waveData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        data.push({
          x: (i - 50) * 0.4,
          y: (j - 50) * 0.4,
          originalZ: 0
        });
      }
    }
    return data;
  }, []);

  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime() * 0.5;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Sistema de ondas múltiples más sofisticado
        const wave1 = Math.sin(x * 0.3 + time * 1.2) * 0.4;
        const wave2 = Math.sin(y * 0.4 + time * 0.8) * 0.3;
        const wave3 = Math.sin((x + y) * 0.2 + time * 0.6) * 0.2;
        const wave4 = Math.sin(Math.sqrt(x * x + y * y) * 0.1 + time) * 0.15;
        
        // Combinación de ondas con atenuación por distancia
        const distance = Math.sqrt(x * x + y * y);
        const attenuation = Math.max(0, 1 - distance * 0.02);
        
        const finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
        positions.setZ(i, finalHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
      
      // Rotación sutil del mesh
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <group>
      {/* Mesh principal de ondas */}
      <mesh 
        ref={meshRef} 
        position={[0, -3, 0]} 
        rotation={[-Math.PI / 5, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry ref={geometryRef} args={[40, 40, 100, 100]} />
        <meshStandardMaterial
          color="#0ea5e9"
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
          wireframe={false}
          metalness={0.1}
          roughness={0.2}
          emissive="#0369a1"
          emissiveIntensity={0.2}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Segundo layer de ondas para profundidad */}
      <mesh 
        position={[0, -3.5, 0]} 
        rotation={[-Math.PI / 4, 0, Math.PI / 6]}
        receiveShadow
      >
        <planeGeometry args={[35, 35, 80, 80]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
          metalness={0.2}
          roughness={0.3}
          emissive="#0891b2"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Partículas flotantes */}
      <ParticleSystem />
    </group>
  );
};

const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i) * 0.001;
        
        // Reset particles que han subido demasiado
        if (positions[i3 + 1] > 8) {
          positions[i3 + 1] = -2;
        }
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
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70vh] z-10">
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        shadows
        performance={{ min: 0.5 }}
      >
        {/* Iluminación mejorada */}
        <ambientLight intensity={0.4} color="#e0f2fe" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-5, 8, -5]} 
          intensity={0.8} 
          color="#0ea5e9" 
        />
        <pointLight 
          position={[0, 5, 0]} 
          intensity={0.6} 
          color="#06b6d4"
          distance={30}
        />
        
        {/* Componente principal */}
        <WaveMesh />
        
        {/* Niebla para profundidad */}
        <fog attach="fog" args={['#0ea5e9', 15, 50]} />
      </Canvas>
    </div>
  );
};
