import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Ocean = () => {
    const mesh = useRef<THREE.Mesh>(null);

    // Custom shader for a stylized ocean
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorStart: { value: new THREE.Color('#0b1026') },
            uColorEnd: { value: new THREE.Color('#1a4d40') },
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
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100, 128, 128]} />
            <shaderMaterial
                vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Simple wave equation
            float elevation = sin(pos.x * 2.0 + uTime * 0.5) * 0.2
                            + sin(pos.y * 1.5 + uTime * 0.3) * 0.2
                            + sin((pos.x + pos.y) * 1.0 + uTime * 0.8) * 0.1;

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
            float mixStrength = (vElevation + 0.5) * 0.8;
            vec3 color = mix(uColorStart, uColorEnd, mixStrength);
            
            // Add "foam" or highlight at peaks
            float highlight = smoothstep(0.4, 0.6, vElevation);
            color = mix(color, vec3(1.0), highlight * 0.1);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
};

export const OceanBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#050814]">
            <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                <fog attach="fog" args={['#050814', 0, 20]} />
                <ambientLight intensity={0.5} />

                {/* Stars & Atmosphere */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

                {/* Clouds for depth */}
                <Cloud opacity={0.3} speed={0.2} segments={20} position={[0, 5, -10]} color="#1a2035" />

                {/* The Ocean */}
                <Ocean />
            </Canvas>
        </div>
    );
};
