
import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

// Make Three.js objects available as JSX elements
extend({ Mesh: THREE.Mesh, PlaneGeometry: THREE.PlaneGeometry, MeshStandardMaterial: THREE.MeshStandardMaterial });

const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // More natural wave movement with multiple sine waves of different frequencies
        const waveHeight = 
          Math.sin(x * 0.5 + time * 0.7) * 0.3 + 
          Math.sin(y * 0.3 + time * 0.5) * 0.2 +
          Math.sin(x * 0.2 + y * 0.3 + time * 0.3) * 0.15;
        
        positions.setZ(i, waveHeight);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry ref={geometryRef} args={[30, 30, 80, 80]} />
      <meshStandardMaterial
        color="#10b981"
        transparent={true}
        opacity={0.8}
        side={THREE.DoubleSide}
        wireframe={false}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-80 z-10">
      <Canvas
        camera={{ position: [0, 8, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <WaveMesh />
      </Canvas>
    </div>
  );
};
