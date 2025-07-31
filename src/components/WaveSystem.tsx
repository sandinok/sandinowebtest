// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Configuración limpia y elegante
const CONFIG = {
  waveIntensity: 0.4,
  waveSpeed: 0.8,
  particleCount: 60,
  colors: {
    wave: '#10b981',
    waveDeep: '#065f46',
    particles: '#34d399',
    glow: '#6ee7b7'
  }
};

// Partículas mágicas hermosas
const MagicalParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesData = useRef<Array<{
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    phase: number;
    size: number;
    type: 'glow' | 'crystal' | 'light';
    hue: number;
    life: number;
  }>>([]);

  // Crear partículas con diferentes tipos y materiales
  useMemo(() => {
    particlesData.current = [];
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const type = ['glow', 'crystal', 'light'][Math.floor(Math.random() * 3)] as 'glow' | 'crystal' | 'light';
      const hue = Math.random() * 60 + 160; // Verdes y azules
      const size = Math.random() * 0.3 + 0.1;
      
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;
      
      switch (type) {
        case 'glow':
          geometry = new THREE.SphereGeometry(size, 8, 6);
          material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue / 360, 0.7, 0.6),
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
          });
          break;
          
        case 'crystal':
          geometry = new THREE.OctahedronGeometry(size * 0.8);
          material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(hue / 360, 0.8, 0.7),
            transparent: true,
            opacity: 0.8,
            shininess: 100,
            emissive: new THREE.Color().setHSL(hue / 360, 0.5, 0.1)
          });
          break;
          
        case 'light':
          geometry = new THREE.PlaneGeometry(size * 2, size * 2);
          material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue / 360, 0.6, 0.8),
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
          });
          break;
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 10 + 1,
        (Math.random() - 0.5) * 50
      );
      
      particlesData.current.push({
        mesh,
        position: mesh.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          Math.random() * 0.003 + 0.001,
          (Math.random() - 0.5) * 0.008
        ),
        phase: Math.random() * Math.PI * 2,
        size,
        type,
        hue,
        life: Math.random() * 1000
      });
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    particlesData.current.forEach((particle, i) => {
      particle.life += 1;
      
      // Movimiento fluido y orgánico
      particle.position.add(particle.velocity);
      
      // Flotación con diferentes patrones según el tipo
      switch (particle.type) {
        case 'glow':
          particle.position.y += Math.sin(time * 0.6 + particle.phase) * 0.003;
          particle.position.x += Math.sin(time * 0.3 + particle.phase) * 0.002;
          break;
        case 'crystal':
          particle.position.y += Math.cos(time * 0.4 + particle.phase) * 0.004;
          particle.mesh.rotation.x += 0.01;
          particle.mesh.rotation.y += 0.008;
          break;
        case 'light':
          particle.position.y += Math.sin(time * 0.8 + particle.phase) * 0.002;
          particle.mesh.rotation.z += 0.02;
          particle.mesh.lookAt(state.camera.position);
          break;
      }
      
      // Efecto de respiración (pulsing)
      const pulse = 0.7 + Math.sin(time * 2 + particle.phase) * 0.3;
      particle.mesh.scale.setScalar(pulse);
      
      // Cambio sutil de color
      if (particle.type === 'glow') {
        const newHue = (particle.hue + time * 10) % 360;
        (particle.mesh.material as THREE.MeshBasicMaterial).color.setHSL(
          newHue / 360, 0.7, 0.6 + Math.sin(time + particle.phase) * 0.2
        );
      }
      
      // Ciclo de vida y reaparición
      if (particle.position.y > 15 || particle.life > 800) {
        particle.position.set(
          (Math.random() - 0.5) * 50,
          -2,
          (Math.random() - 0.5) * 50
        );
        particle.life = 0;
        particle.hue = Math.random() * 60 + 160;
      }
      
      // Límites suaves
      if (Math.abs(particle.position.x) > 30) {
        particle.velocity.x *= -0.5;
      }
      if (Math.abs(particle.position.z) > 30) {
        particle.velocity.z *= -0.5;
      }
      
      particle.mesh.position.copy(particle.position);
    });
  });

  return (
    <group ref={groupRef}>
      {particlesData.current.map((particle, i) => (
        <primitive key={i} object={particle.mesh} />
      ))}
    </group>
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
        
        {/* Partículas mágicas */}
        <MagicalParticles />
        
        {/* Burbujas que suben */}
        <RisingBubbles />
        
        {/* Niebla sutil */}
        <fog attach="fog" args={['#0f766e', 30, 60]} />
      </Canvas>
    </div>
  );
};
