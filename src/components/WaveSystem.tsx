// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ondas suaves y sutiles como en la imagen
const SoftWaves = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#34d399') }, // Verde suave
    uColor2: { value: new THREE.Color('#10b981') }, // Verde más oscuro
    uOpacity: { value: 0.6 }
  }), []);

  // Shader para ondas suaves y orgánicas
  const vertexShader = `
    uniform float uTime;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Ondas suaves y lentas como en la imagen
      float wave1 = sin(pos.x * 0.02 + uTime * 0.3) * 0.8;
      float wave2 = sin(pos.z * 0.015 + uTime * 0.2) * 0.6;
      float wave3 = sin((pos.x + pos.z) * 0.01 + uTime * 0.15) * 0.4;
      
      // Atenuación suave desde los bordes
      float distance = length(pos.xz);
      float attenuation = smoothstep(50.0, 0.0, distance);
      
      float elevation = (wave1 + wave2 + wave3) * attenuation * 0.3;
      pos.y += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;
    uniform float uTime;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      // Gradiente suave basado en posición
      float mixFactor = (vElevation + 0.5) * 0.5;
      vec3 color = mix(uColor2, uColor1, mixFactor);
      
      // Efecto de distancia para profundidad
      float distance = length(vPosition.xz);
      float alpha = uOpacity * smoothstep(50.0, 20.0, distance);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60vh] z-0 pointer-events-none">
      <Canvas
        camera={{ 
          position: [0, 15, 20], 
          fov: 60
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Iluminación muy suave */}
        <ambientLight intensity={0.8} color="#ffffff" />
        
        {/* Ondas suaves */}
        <SoftWaves />
        
        {/* Niebla sutil para profundidad */}
        <fog attach="fog" args={['#10b981', 25, 80]} />
      </Canvas>
    </div>
  );
};
