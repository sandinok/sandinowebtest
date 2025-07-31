// src/components/WaveSystem.tsx
import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Configuración optimizada con LOD (Level of Detail)
const WAVE_CONFIG = {
  // Geometría adaptativa
  segments: {
    high: 120,
    medium: 80,
    low: 40
  },
  size: 60,
  // Física de ondas
  amplitude: 0.8,
  frequency: 0.12,
  speed: 0.4,
  // Partículas
  particleCount: {
    high: 200,
    medium: 120,
    low: 60
  },
  // Rendimiento
  updateThreshold: 16.67, // 60fps
  lodDistance: 30
};

// Shader personalizado para ondas realistas con caustics
const waveVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vElevation;
  varying vec2 vUv;
  
  // Función de ruido mejorada
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    float time = uTime * uSpeed;
    vec3 pos = position;
    
    // Múltiples capas de ondas con diferentes frecuencias
    float wave1 = sin(pos.x * uFrequency + time) * uAmplitude;
    float wave2 = sin(pos.z * uFrequency * 0.8 + time * 1.3) * uAmplitude * 0.7;
    float wave3 = sin((pos.x + pos.z) * uFrequency * 0.6 + time * 0.7) * uAmplitude * 0.5;
    
    // Ondas circulares (ripples)
    float distance = length(pos.xz);
    float ripple = sin(distance * uFrequency * 2.0 - time * 2.0) * uAmplitude * 0.3;
    
    // Ruido para variación orgánica
    float noise = snoise(vec3(pos.xz * 0.1, time * 0.1)) * uAmplitude * 0.2;
    
    // Atenuación basada en distancia al centro
    float attenuation = max(0.0, 1.0 - distance * 0.015);
    
    // Combinación final de ondas
    float finalElevation = (wave1 + wave2 + wave3 + ripple + noise) * attenuation;
    
    pos.y += finalElevation;
    vElevation = finalElevation;
    
    // Calcular normal aproximada para lighting
    float delta = 0.1;
    float elevationX = sin((pos.x + delta) * uFrequency + time) * uAmplitude * attenuation;
    float elevationZ = sin((pos.z + delta) * uFrequency + time) * uAmplitude * attenuation;
    
    vec3 tangentX = normalize(vec3(delta, elevationX - finalElevation, 0.0));
    vec3 tangentZ = normalize(vec3(0.0, elevationZ - finalElevation, delta));
    vNormal = normalize(cross(tangentX, tangentZ));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uShallowColor;
  uniform vec3 uDeepColor;
  uniform float uAlpha;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vElevation;
  varying vec2 vUv;
  
  void main() {
    // Color basado en elevación para efecto de profundidad
    float normalizedElevation = (vElevation + 1.0) * 0.5;
    vec3 color = mix(uDeepColor, uShallowColor, normalizedElevation);
    
    // Fresnel effect para realismo
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(0.0, dot(viewDirection, vNormal));
    fresnel = pow(fresnel, 2.0);
    
    // Caustics effect simulado
    float caustics = sin(vPosition.x * 10.0 + uTime) * sin(vPosition.z * 10.0 + uTime * 1.3);
    caustics = abs(caustics) * 0.3;
    
    // Combinación final
    color = mix(color, vec3(1.0), fresnel * 0.3);
    color += caustics * vec3(0.8, 1.0, 1.0);
    
    // Foam en las crestas
    float foam = smoothstep(0.4, 0.8, vElevation);
    color = mix(color, vec3(1.0), foam * 0.7);
    
    gl_FragColor = vec4(color, uAlpha);
  }
`;

// Componente de partículas flotantes mejorado con instancing
const EnhancedFloatingParticles = ({ quality }: { quality: 'high' | 'medium' | 'low' }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleData = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    phase: number;
    size: number;
    life: number;
    maxLife: number;
  }>>([]);
  
  const particleCount = WAVE_CONFIG.particleCount[quality];
  
  // Inicializar partículas con instancing para mejor rendimiento
  const { positions, scales, dummy } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const dummy = new THREE.Object3D();
    
    particleData.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 50,
          Math.random() * 8 - 2,
          (Math.random() - 0.5) * 50
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.01 + 0.005,
          (Math.random() - 0.5) * 0.02
        ),
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.3 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200
      };
      
      particleData.current.push(particle);
      
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      scales[i] = particle.size;
    }
    
    return { positions, scales, dummy };
  }, [particleCount]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Actualizar partículas con física mejorada
    for (let i = 0; i < particleCount; i++) {
      const particle = particleData.current[i];
      
      // Física de flotación
      particle.position.add(particle.velocity);
      particle.position.y += Math.sin(time * 0.5 + particle.phase) * 0.008;
      
      // Corrientes de viento suaves
      particle.velocity.x += Math.sin(time * 0.1 + particle.phase) * 0.0001;
      particle.velocity.z += Math.cos(time * 0.1 + particle.phase * 1.3) * 0.0001;
      
      // Ciclo de vida
      particle.life++;
      if (particle.life > particle.maxLife) {
        // Reposicionar partícula
        particle.position.set(
          (Math.random() - 0.5) * 50,
          -3,
          (Math.random() - 0.5) * 50
        );
        particle.life = 0;
        particle.maxLife = Math.random() * 300 + 200;
      }
      
      // Limites del mundo
      if (particle.position.y > 10) {
        particle.position.y = -3;
      }
      
      // Actualizar instancia
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size * (1 - particle.life / particle.maxLife));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.01;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.02, 8, 6]} />
      <meshBasicMaterial
        color="#4ade80"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

// Componente principal de ondas con shaders personalizados
const RealisticWaveSystem = ({ quality }: { quality: 'high' | 'medium' | 'low' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const segments = WAVE_CONFIG.segments[quality];
  
  // Uniforms para el shader
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAmplitude: { value: WAVE_CONFIG.amplitude },
    uFrequency: { value: WAVE_CONFIG.frequency },
    uSpeed: { value: WAVE_CONFIG.speed },
    uColor: { value: new THREE.Color('#10b981') },
    uShallowColor: { value: new THREE.Color('#34d399') },
    uDeepColor: { value: new THREE.Color('#047857') },
    uAlpha: { value: 0.85 }
  }), []);
  
  // Material con shader personalizado
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending
  }), [uniforms]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    
    if (meshRef.current) {
      // Rotación sutil para dinamismo
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.01;
    }
  });
  
  return (
    <mesh 
      ref={meshRef}
      position={[0, -3, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      <planeGeometry args={[WAVE_CONFIG.size, WAVE_CONFIG.size, segments, segments]} />
      <shaderMaterial ref={materialRef} attach="material" {...material} />
    </mesh>
  );
};

// Componente de espuma y efectos de superficie
const SurfaceEffects = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(time * 0.6 + index) * 0.1 - 2.5;
        child.rotation.z = time * 0.02 + index;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            -2.5,
            (Math.random() - 0.5) * 40
          ]}
        >
          <ringGeometry args={[0.5, 1.2, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Hook para detección de rendimiento y calidad adaptativa
const usePerformanceMonitor = () => {
  const qualityRef = useRef<'high' | 'medium' | 'low'>('high');
  const frameTimeRef = useRef<number[]>([]);
  
  useFrame((state, delta) => {
    const frameTime = delta * 1000;
    frameTimeRef.current.push(frameTime);
    
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }
    
    if (frameTimeRef.current.length === 60) {
      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / 60;
      
      if (avgFrameTime > 20 && qualityRef.current !== 'low') {
        qualityRef.current = qualityRef.current === 'high' ? 'medium' : 'low';
        console.log(`Quality adjusted to: ${qualityRef.current}`);
      } else if (avgFrameTime < 12 && qualityRef.current !== 'high') {
        qualityRef.current = qualityRef.current === 'low' ? 'medium' : 'high';
        console.log(`Quality adjusted to: ${qualityRef.current}`);
      }
    }
  });
  
  return qualityRef.current;
};

// Componente de monitor de rendimiento
const PerformanceMonitor = ({ onQualityChange }: { onQualityChange: (quality: 'high' | 'medium' | 'low') => void }) => {
  const quality = usePerformanceMonitor();
  
  React.useEffect(() => {
    onQualityChange(quality);
  }, [quality, onQualityChange]);
  
  return null;
};

export const WaveSystem = () => {
  const [quality, setQuality] = React.useState<'high' | 'medium' | 'low'>('high');
  
  const handleQualityChange = useCallback((newQuality: 'high' | 'medium' | 'low') => {
    setQuality(newQuality);
  }, []);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70vh] z-10 pointer-events-none">
      <Canvas
        camera={{ 
          position: [0, 12, 35], 
          fov: 55,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true
        }}
        performance={{ 
          min: 0.8,
          max: 1,
          debounce: 200 
        }}
        frameloop="always"
        dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      >
        {/* Iluminación mejorada para realismo */}
        <ambientLight intensity={0.3} color="#e0f7fa" />
        <directionalLight 
          position={[20, 25, 10]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow={quality === 'high'}
          shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
          shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
        />
        <hemisphereLight 
          intensity={0.4} 
          groundColor="#0a7c6b" 
          color="#7dd3fc" 
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={0.5}
          color="#4ade80"
          distance={30}
        />
        
        {/* Sistema de ondas principal */}
        <RealisticWaveSystem quality={quality} />
        
        {/* Partículas flotantes */}
        <EnhancedFloatingParticles quality={quality} />
        
        {/* Efectos de superficie */}
        {quality !== 'low' && <SurfaceEffects />}
        
        {/* Niebla atmosférica */}
        <fog 
          attach="fog" 
          args={[
            '#0d9488', 
            quality === 'high' ? 30 : 25, 
            quality === 'high' ? 80 : 60
          ]} 
        />
        
        {/* Monitor de rendimiento */}
        <PerformanceMonitor onQualityChange={handleQualityChange} />
      </Canvas>
    </div>
  );
};
