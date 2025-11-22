import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const Ocean = () => {
    const mesh = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorStart: { value: new THREE.Color('#0f172a') }, // Color oscuro
            uColorEnd: { value: new THREE.Color('#334155') },   // Color más claro
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
            <planeGeometry args={[100, 100, 64, 64]} />
            <shaderMaterial
                vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
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
            gl_FragColor = vec4(color, 1.0);
          }
        `}
                uniforms={uniforms}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
};

export const OceanBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            {/* Fallback HTML por si 3D falla */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-[-1]" />

            <Canvas camera={{ position: [0, 3, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
                <Ocean />
            </Canvas>
        </div>
    );
};