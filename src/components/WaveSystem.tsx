// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ondas ultra-optimizadas: geometría reducida, shaders simplificados para rendimiento máximo sin perder belleza
const SoftWaves = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#34d399') }, // Verde suave
    uColor2: { value: new THREE.Color('#10b981') }, // Verde más oscuro
    uOpacity: { value: 0.6 }
  }), []);

  // Vertex shader optimizado: menos cálculos sin, atenuación simplificada
  const vertexShader = `
    uniform float uTime;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Ondas simplificadas: solo dos ondas principales para menos computations
      float wave1 = sin(pos.x * 0.018 + uTime * 0.25) * 0.7;
      float wave2 = sin(pos.z * 0.012 + uTime * 0.18) * 0.5;
      
      // Atenuación más eficiente
      float distance = length(pos.xz);
      float attenuation = smoothstep(40.0, 0.0, distance);
      
      float elevation = (wave1 + wave2) * attenuation * 0.25;
      pos.y += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Fragment shader optimizado: menos operaciones, alpha directo
  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      float mixFactor = (vElevation + 0.5) * 0.5;
      vec3 color = mix(uColor2, uColor1, mixFactor);
      
      float distance = length(vPosition.xz);
      float alpha = uOpacity * smoothstep(40.0, 15.0, distance);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80, 32, 32]} /> {/* Resolución reducida: de 50x50 a 32x32 para ~36% menos vértices */}
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false} {/* Optimización: no escribe depth para overlays transparentes */}
      />
    </mesh>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50vh] z-0 pointer-events-none"> {/* Altura reducida para menos área de render */}
      <Canvas
        camera={{ 
          position: [0, 12, 18],  // Cámara más cercana para menos computations
          fov: 50  // FOV reducido para menos geometría visible
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          precision: 'mediump'  // Precisión media para shaders más rápidos en mobile
        }}
      >
        {/* Iluminación minimalista */}
        <ambientLight intensity={0.6} color="#ffffff" />
        
        {/* Ondas optimizadas */}
        <SoftWaves />
        
        {/* Niebla optimizada: rangos más cortos */}
        <fog attach="fog" args={['#10b981', 20, 60]} />
      </Canvas>
    </div>
  );
};
