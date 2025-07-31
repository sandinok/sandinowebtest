// src/components/WaveSystem.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMemoizedWaveShader } from '../hooks/useMemoizedWaveShader'; // Nuevo hook

// Material de onda personalizado con shader para máximo realismo
const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0x10b981),
    uEmissive: new THREE.Color(0x059669),
    uSpecular: new THREE.Color(0xffffff),
    uShininess: 30,
    uWaterTint: new THREE.Color(0x0d9488),
    uSunDirection: new THREE.Vector3(0.5, 1, 0.7).normalize(),
    uSunColor: new THREE.Color(0xffffff),
    uFoamColor: new THREE.Color(0xe0f7fa),
  },
  // Vertex Shader
  `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDirection;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normal;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vPosition = position;
      
      // Calcular ondas combinadas
      float wave1 = sin(position.x * 0.2 + uTime * 1.2) * 0.4;
      float wave2 = sin(position.z * 0.3 + uTime * 0.9) * 0.3;
      float wave3 = sin((position.x + position.z) * 0.15 + uTime * 0.6) * 0.2;
      float wave4 = sin(sqrt(position.x * position.x + position.z * position.z) * 0.08 + uTime * 0.4) * 0.15;
      
      // Atenuación basada en distancia al centro
      float distance = sqrt(position.x * position.x + position.z * position.z);
      float attenuation = max(0.0, 1.0 - distance * 0.02);
      
      float finalHeight = (wave1 + wave2 + wave3 + wave4) * attenuation;
      
      vec3 newPosition = position + normal * finalHeight;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      
      // Dirección de vista para efectos de reflexión
      vViewDirection = cameraPosition - worldPosition.xyz;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform vec3 uSpecular;
    uniform float uShininess;
    uniform vec3 uWaterTint;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform vec3 uFoamColor;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDirection;
    varying vec3 vWorldPosition;
    
    void main() {
      // Normales interpoladas
      vec3 normal = normalize(vNormal);
      
      // Dirección de vista normalizada
      vec3 viewDirection = normalize(vViewDirection);
      
      // Calcular reflexión especular (modelo Phong)
      vec3 reflectDir = reflect(-uSunDirection, normal);
      float spec = pow(max(dot(viewDirection, reflectDir), 0.0), uShininess);
      vec3 specular = uSpecular * spec * uSunColor;
      
      // Calcular iluminación difusa
      float diff = max(dot(normal, uSunDirection), 0.0);
      vec3 diffuse = uColor * diff * uSunColor;
      
      // Color base del agua con tinte
      vec3 waterColor = mix(uWaterTint, uColor, 0.7);
      
      // Efecto de profundidad basado en posición Y
      float depthFactor = smoothstep(-2.0, 0.0, vPosition.y);
      vec3 depthColor = mix(waterColor * 0.5, waterColor, depthFactor);
      
      // Efecto de espuma en crestas
      float foam = smoothstep(0.8, 1.0, normal.y);
      vec3 foamColor = uFoamColor * foam * 0.8;
      
      // Combinar todos los efectos
      vec3 finalColor = depthColor + diffuse + specular + uEmissive + foamColor;
      
      // Atenuación con niebla
      float fogDistance = length(vWorldPosition);
      float fog = smoothstep(20.0, 60.0, fogDistance);
      finalColor = mix(finalColor, uWaterTint, fog);
      
      gl_FragColor = vec4(finalColor, 0.85);
    }
  `
);

// Registrar el material para usarlo en JSX
extend({ WaveShaderMaterial });

// Componente de partículas flotantes ultra optimizadas
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Memoizar posiciones para evitar recálculos
  const particlesData = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      
      sizes[i] = Math.random() * 0.04 + 0.02;
      
      // Colores acuáticos
      colors[i * 3] = 0.2 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }
    
    return { positions, sizes, colors, count };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animación optimizada de partículas
      for (let i = 0; i < particlesData.count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.005 + 0.005;
        
        // Resetear partículas que suben demasiado
        if (positions[i3 + 1] > 5) {
          positions[i3 + 1] = -1;
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
          count={particlesData.count}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particlesData.count}
          array={particlesData.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesData.count}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
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
      <waveShaderMaterial
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
          castShadow={false}
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
