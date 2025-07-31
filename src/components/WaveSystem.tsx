// src/components/WaveSystem.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Material de onda personalizado con shader
const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0x10b981),
    uEmissive: new THREE.Color(0x059669),
    uWaterTint: new THREE.Color(0x0d9488),
    uFoamColor: new THREE.Color(0xe0f7fa),
    uSpeed: 0.8,
    uFrequency: new THREE.Vector2(0.2, 0.3),
    uAmplitude: new THREE.Vector2(0.4, 0.3),
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2 uFrequency;
    uniform vec2 uAmplitude;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vWave;
    
    void main() {
      vNormal = normal;
      vPosition = position;
      
      // Calcular ondas combinadas
      float wave1 = sin(position.x * uFrequency.x + uTime * uSpeed * 1.2) * uAmplitude.x;
      float wave2 = sin(position.z * uFrequency.y + uTime * uSpeed * 0.9) * uAmplitude.y;
      float wave3 = sin((position.x + position.z) * 0.15 + uTime * uSpeed * 0.6) * 0.2;
      float wave4 = sin(sqrt(position.x * position.x + position.z * position.z) * 0.08 + uTime * uSpeed * 0.4) * 0.15;
      
      // Atenuación basada en distancia al centro
      float distance = sqrt(position.x * position.x + position.z * position.z);
      float attenuation = max(0.0, 1.0 - distance * 0.02);
      
      float finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
      vWave = finalHeight;
      
      vec3 newPosition = position + normal * finalHeight;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform vec3 uWaterTint;
    uniform vec3 uFoamColor;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vWave;
    
    void main() {
      // Normales interpoladas
      vec3 normal = normalize(vNormal);
      
      // Efecto de profundidad basado en posición Y
      float depthFactor = smoothstep(-1.0, 0.5, vPosition.y);
      vec3 depthColor = mix(uWaterTint * 0.5, uColor, depthFactor);
      
      // Efecto de espuma en crestas
      float foam = smoothstep(0.7, 1.0, normal.y);
      vec3 foamColor = uFoamColor * foam * 0.8;
      
      // Combinar todos los efectos
      vec3 finalColor = depthColor + uEmissive * 0.5 + foamColor;
      
      gl_FragColor = vec4(finalColor, 0.85);
    }
  `
);

// Registrar el material para usarlo en JSX
extend({ WaveMaterial });

// Componente de partículas flotantes optimizadas
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animación optimizada de partículas
      for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        positions[i + 1] += Math.sin(time * 0.5 + idx * 0.1) * 0.01;
        
        // Resetear partículas que suben demasiado
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
              if (i % 3 === 0) return (Math.random() - 0.5) * 40; // x
              if (i % 3 === 1) return Math.random() * 6 - 1; // y
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

// Malla de ondas realista con shader
const RealisticWave = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Actualizar tiempo en el shader
    if (materialRef.current) {
      materialRef.current.uTime = time;
    }
    
    // Rotación suave para efecto 3D
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(time * 0.08) * 0.01;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, -2.5, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[60, 60, 120, 120]} />
      <waveMaterial
        ref={materialRef}
        uColor={new THREE.Color(0x10b981)}
        uEmissive={new THREE.Color(0x059669)}
        uWaterTint={new THREE.Color(0x0d9488)}
        uFoamColor={new THREE.Color(0xe0f7fa)}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Componente principal del sistema de ondas realistas
export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[75vh] z-10 pointer-events-none">
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
        {/* Iluminación optimizada para agua realista */}
        <ambientLight intensity={0.4} color="#e0f7fa" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.8} 
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
