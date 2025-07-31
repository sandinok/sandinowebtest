import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Plane, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Reusable optimized geometry
const waveGeometry1 = new THREE.PlaneGeometry(50, 50, 120, 120);
const waveGeometry2 = new THREE.PlaneGeometry(40, 40, 100, 100);

const WaveMesh = memo(() => {
  const meshRef = useRef();
  const meshRef2 = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.8;
    
    // Update primary wave
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const wave1 = Math.sin(x * 0.2 + time * 1.5) * 0.6;
        const wave2 = Math.sin(y * 0.3 + time * 1.2) * 0.4;
        const wave3 = Math.sin((x + y) * 0.15 + time * 0.8) * 0.3;
        const wave4 = Math.sin(Math.sqrt(x * x + y * y) * 0.08 + time * 0.6) * 0.25;
        
        const distance = Math.sqrt(x * x + y * y);
        const attenuation = Math.max(0, 1 - distance * 0.015);
        
        positions.setZ(i, (wave1 + wave2 + wave3 + wave4) * attenuation);
      }
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.03;
    }
    
    // Update secondary wave
    if (meshRef2.current) {
      const positions = meshRef2.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const wave1 = Math.sin(x * 0.15 + time * 1.3) * 0.5;
        const wave2 = Math.sin(y * 0.25 + time * 1.0) * 0.3;
        const wave3 = Math.sin((x - y) * 0.12 + time * 0.7) * 0.25;
        
        const distance = Math.sqrt(x * x + y * y);
        const attenuation = Math.max(0, 1 - distance * 0.02);
        
        positions.setZ(i, (wave1 + wave2 + wave3) * attenuation);
      }
      positions.needsUpdate = true;
      meshRef2.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, -4, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={waveGeometry1} attach="geometry" />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          metalness={0.2}
          roughness={0.1}
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      <mesh
        ref={meshRef2}
        position={[0, -4.8, 0]}
        rotation={[-Math.PI / 3.5, 0, Math.PI / 8]}
        receiveShadow
      >
        <primitive object={waveGeometry2} attach="geometry" />
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
    </group>
  );
});

const OptimizedParticles = memo(() => {
  const pointsRef = useRef();
  const particleCount = 150;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 15 - 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      
      colors[i * 3] = 0.1 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
    }
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.8 + i * 0.1) * 0.002 + 0.01;
        
        if (positions[i3 + 1] > 12) {
          positions[i3 + 1] = -3;
          positions[i3] = (Math.random() - 0.5) * 80;
          positions[i3 + 2] = (Math.random() - 0.5) * 80;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.02;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointMaterial
        size={0.08}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
});

const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[75vh] z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 12, 25], fov: 65 }}
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false
        }}
        shadows
        performance={{ min: 0.8 }}
        frameloop="always"
      >
        <ambientLight intensity={0.6} color="#e0f7fa" />
        <directionalLight
          position={[15, 15, 8]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
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
        <OptimizedParticles />
        <fog attach="fog" args={['#10b981', 20, 60]} />
      </Canvas>
    </div>
  );
};

export default WaveSystem;
