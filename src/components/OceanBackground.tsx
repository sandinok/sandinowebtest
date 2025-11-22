import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Ocean = () => {
    const mesh = useRef<THREE.Mesh>(null);

    // Shader optimizado para el estilo "Liquid"
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            // Colores más profundos y elegantes para contrastar con el Glass
            uColorStart: { value: new THREE.Color('#0f172a') }, // Slate 900
            uColorEnd: { value: new THREE.Color('#1e293b') },   // Slate 800
        }),
        []
    );

    useFrame((state) => {
        const { clock } = state;
        if (mesh.current) {
            (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            {/* Optimización: Reducido de 128 a 64 segmentos para mejor rendimiento */}
            <planeGeometry args={[100, 100, 64, 64]} />
            <shaderMaterial
                vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Olas más suaves y lentas (Estilo Zen/iOS)
            float elevation = sin(pos.x * 1.5 + uTime * 0.3) * 0.3
                            + sin(pos.y * 1.0 + uTime * 0.2) * 0.3
                            + sin((pos.x + pos.y) * 0.5 + uTime * 0.5) * 0.1;

            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
                fragmentShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform vec3 uColorStart;
          uniform vec3 uColorEnd;

          void main() {
            float mixStrength = (vElevation + 0.8) * 0.6;
            vec3 color = mix(uColorStart, uColorEnd, mixStrength);
            
            // Espuma sutil en las crestas
            float highlight = smoothstep(0.5, 0.8, vElevation);
            color = mix(color, vec3(0.6, 0.7, 0.9), highlight * 0.15);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
                uniforms={uniforms}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
};

export const OceanBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#020617] transition-opacity duration-1000 ease-in-out">
            <Canvas 
                camera={{ position: [0, 3, 6], fov: 45 }}
                dpr={[1, 2]} // Optimización para pantallas Retina
                gl={{ antialias: false }} // Rendimiento extra
            >
                <fog attach="fog" args={['#020617', 5, 25]} />
                <ambientLight intensity={0.5} />
                
                {/* Estrellas sutiles */}
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                
                {/* Partículas flotantes (Efecto mágico) */}
                <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.5} color="#94a3b8" />

                {/* Nubes distantes para profundidad */}
                <Cloud opacity={0.2} speed={0.2} width={10} depth={1.5} segments={10} position={[0, 5, -15]} color="#1e293b" />

                <Ocean />
            </Canvas>
        </div>
    );
};

export default OceanBackground;