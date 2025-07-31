// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Configuración limpia y elegante
const CONFIG = {
  waveIntensity: 0.4,
  waveSpeed: 0.8,
  particleCount: 80,
  colors: {
    wave: '#10b981',
    waveDeep: '#065f46',
    particles: '#34d399',
    glow: '#6ee7b7'
  }
};

// Partículas flotantes súper elegantes
const FloatingOrbs = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesData = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    phase: number;
    size: number;
    opacity: number;
  }>>([]);

  // Inicializar partículas con distribución orgánica
  useMemo(() => {
    particlesData.current = Array.from({ length: CONFIG.particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 60
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.01
      ),
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.6 + 0.4
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    particlesData.current.forEach((particle, i) => {
      // Movimiento orgánico y suave
      particle.position.add(particle.velocity);
      
      // Flotación vertical suave
      particle.position.y += Math.sin(time * 0.5 + particle.phase) * 0.002;
      
      // Deriva horizontal sutil
      particle.position.x += Math.sin(time * 0.2 + particle.phase) * 0.001;
      particle.position.z += Math.cos(time * 0.15 + particle.phase * 1.3) * 0.001;

      // Wrapping suave
      if (particle.position.y > 12) particle.position.y = -2;
      if (particle.position.y < -3) particle.position.y = 12;
      if (Math.abs(particle.position.x) > 35) particle.position.x *= -0.8;
      if (Math.abs(particle.position.z) > 35) particle.position.z *= -0.8;

      // Actualizar instancia
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size * (0.8 + Math.sin(time + particle.phase) * 0.2));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CONFIG.particleCount]}>
      <sphereGeometry args={[0.08, 12, 8]} />
      <meshBasicMaterial
        color={CONFIG.colors.particles}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

// Ondas principales súper fluidas
const FluidWaves = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: CONFIG.waveIntensity },
    uSpeed: { value: CONFIG.waveSpeed },
    uColor1: { value: new THREE.Color(CONFIG.colors.wave) },
    uColor2: { value: new THREE.Color(CONFIG.colors.waveDeep) }
  }), []);

  const vertexShader = `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      float time = uTime * uSpeed;
      
      // Ondas principales más suaves
      float wave1 = sin(pos.x * 0.08 + time) * uIntensity;
      float wave2 = sin(pos.z * 0.06 + time * 1.2) * uIntensity * 0.7;
      float wave3 = sin((pos.x + pos.z) * 0.04 + time * 0.6) * uIntensity * 0.5;
      
      // Ondas circulares suaves
      float dist = length(pos.xz);
      float ripple = sin(dist * 0.05 - time * 1.5) * uIntensity * 0.3;
      
      // Atenuación suave desde el centro
      float attenuation = smoothstep(30.0, 0.0, dist);
      
      float finalHeight = (wave1 + wave2 + wave3 + ripple) * attenuation;
      pos.y += finalHeight;
      vElevation = finalHeight;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec2 vUv;
    
    void main() {
      // Color basado en elevación
      float heightFactor = (vElevation + 0.5) * 0.5;
      vec3 color = mix(uColor2, uColor1, heightFactor);
      
      // Efecto de transparencia elegante
      float alpha = 0.8;
      
      // Suave glow en los bordes
      float edge = 1.0 - smoothstep(0.0, 0.3, abs(vElevation));
      color += edge * vec3(0.2, 0.4, 0.3);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80, 60, 60]} />
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

// Efectos de profundidad elegantes
const DepthGlow = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color={CONFIG.colors.glow}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Burbujas elegantes que suben
const RisingBubbles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const bubblesData = useRef<Array<{
    mesh: THREE.Mesh;
    speed: number;
    phase: number;
    initialY: number;
  }>>([]);

  useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.05, 8, 6);
    const material = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    bubblesData.current = Array.from({ length: 15 }, () => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 5 - 3,
        (Math.random() - 0.5) * 40
      );
      
      return {
        mesh,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        initialY: mesh.position.y
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    bubblesData.current.forEach((bubble) => {
      bubble.mesh.position.y += bubble.speed;
      bubble.mesh.position.x += Math.sin(time * 0.5 + bubble.phase) * 0.002;
      
      if (bubble.mesh.position.y > 8) {
        bubble.mesh.position.y = bubble.initialY;
        bubble.mesh.position.x = (Math.random() - 0.5) * 40;
        bubble.mesh.position.z = (Math.random() - 0.5) * 40;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bubblesData.current.map((bubble, i) => (
        <primitive key={i} object={bubble.mesh} />
      ))}
    </group>
  );
};

export const WaveSystem = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[75vh] z-10 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ 
          position: [0, 8, 25], 
          fov: 50,
          near: 0.1,
          far: 200
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false
        }}
        performance={{ min: 0.8 }}
      >
        {/* Iluminación suave y elegante */}
        <ambientLight intensity={0.4} color="#e6fffa" />
        <directionalLight 
          position={[10, 15, 5]} 
          intensity={1.0} 
          color="#ffffff"
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={0.3}
          color={CONFIG.colors.glow}
          distance={25}
        />
        
        {/* Ondas principales */}
        <FluidWaves />
        
        {/* Glow de profundidad */}
        <DepthGlow />
        
        {/* Partículas flotantes */}
        <FloatingOrbs />
        
        {/* Burbujas que suben */}
        <RisingBubbles />
        
        {/* Niebla sutil */}
        <fog attach="fog" args={['#0f766e', 30, 60]} />
      </Canvas>
    </div>
  );
};
