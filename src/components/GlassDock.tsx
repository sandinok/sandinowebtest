// src/components/GlassDock.tsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Youtube, Play, Lightbulb, User, Mail } from "lucide-react";
import { useSounds } from "../context/SoundContext";
import { useWindows } from "../context/WindowContext";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

type IconType = React.ComponentType<{ className?: string; size?: number }>;

interface DockItem {
  id: string;
  icon: IconType;
  label: string;
  color: string;
  sound: string;
  gradient: string;
  imageUrl: string;
}

const LiquidGlassPanel: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const texture = useTexture(imageUrl);
  const { size } = useThree();

  const shaderArgs = useMemo(() => {
    const texW = (texture as any)?.source?.data?.width || 1;
    const texH = (texture as any)?.source?.data?.height || 1;

    return {
      uniforms: {
        uMouse: { value: { x: 0.0, y: 0.0 } }, // fijo, sin puntero
        uRes: { value: { x: size.width, y: size.height } },
        uTexRes: { value: { x: texW, y: texH } },
        uTexture: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec2 uRes;
        uniform vec2 uTexRes;
        uniform vec2 uMouse;
        uniform sampler2D uTexture;

        #define PI    3.14159265
        #define S     smoothstep
        #define R     uRes
        #define PX(a) a / R.y

        vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
          float rs = s.x / s.y;
          float ri = i.x / i.y;
          vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
          vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st;
          return u * s / st + o;
        }

        mat2 Rot(float a) {
          return mat2(cos(a), -sin(a), sin(a), cos(a));
        }

        float Box(vec2 p, vec2 b) {
          vec2 d = abs(p) - b;
          return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
        }

        float IconPhoto(vec2 uv) {
          float c = 0.;
          for (float i = 0.; i < 1.; i += 1. / 8.) {
            vec2 u = uv;
            u *= Rot(i * 2. * PI);
            u += vec2(0., PX(40.));
            float b = Box(u, vec2(PX(0.), PX(13.)));
            c += S(PX(1.5), 0., b - PX(15.)) * .2;
          }
          return c;
        }

        vec4 LiquidGlassSample(sampler2D tex, vec2 uv, float direction, float quality, float size) {
          vec2 radius = size / R;
          vec4 color = texture2D(tex, uv);
          for (float d = 0.; d < PI; d += PI / direction) {
            for (float i = 1. / quality; i <= 1.; i += 1. / quality) {
              color += texture2D(tex, uv + vec2(cos(d), sin(d)) * radius * i);
            }
          }
          color /= quality * direction;
          return color;
        }

        vec4 Icon(vec2 uv) {
          float box = Box(uv, vec2(PX(50.)));
          float boxShape = S(PX(1.5), 0., box - PX(50.));
          float boxDisp  = S(PX(35.), 0., box - PX(25.));
          float boxLight = boxShape * S(0., PX(30.), box - PX(40.));
          float icon     = IconPhoto(uv);
          return vec4(boxShape, boxDisp, boxLight, icon);
        }

        void main() {
          vec2 uv = CoverUV(vUv, uRes, uTexRes);

          vec2 st = (gl_FragCoord.xy - 0.5 * R) / R.y;
          vec2 M  = uMouse * 0.0; // fijo, sin interacción
          M.x *= uRes.x / uRes.y;

          vec3 tex = texture2D(uTexture, uv).rgb;

          vec4 icon = Icon(st - M);

          vec2 uv2 = uv - M;
          uv2 *= S(-0.6, 1.0, icon.y);
          uv2 += M;

          vec3 col = mix(
            tex * 0.8,
            0.1 + LiquidGlassSample(uTexture, uv2, 10.0, 10.0, 20.0).rgb * 0.7,
            icon.x
          );
          col += icon.z * 0.9 + icon.w;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: false,
    };
  }, [size, texture]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export const GlassDock: React.FC = () => {
  const { playSound } = useSounds();
  const { openWindow } = useWindows();

  const dockItems: DockItem[] = [
    {
      id: "portfolio",
      icon: Palette,
      label: "PORTFOLIO",
      color: "from-blue-500 to-blue-700",
      sound: "click1",
      gradient:
        "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "youtube",
      icon: Youtube,
      label: "YOUTUBE",
      color: "from-red-500 to-pink-600",
      sound: "click2",
      gradient:
        "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "animations",
      icon: Play,
      label: "ANIMATIONS",
      color: "from-teal-500 to-cyan-600",
      sound: "click3",
      gradient:
        "linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0891b2 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "inspiration",
      icon: Lightbulb,
      label: "INSPIRATION",
      color: "from-green-500 to-emerald-600",
      sound: "click4",
      gradient:
        "linear-gradient(135deg, #22c55e 0%, #10b981 50%, #059669 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1529245019870-59b249281fd5?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "about",
      icon: User,
      label: "ABOUT ME",
      color: "from-cyan-500 to-blue-600",
      sound: "click5",
      gradient:
        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "contact",
      icon: Mail,
      label: "CONTACT",
      color: "from-purple-500 to-indigo-600",
      sound: "click6",
      gradient:
        "linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const handleIconClick = (item: DockItem) => {
    playSound(item.sound);
    openWindow(item.id, item.label);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 150,
          damping: 22,
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          <div className="absolute top-full left-0 right-0 h-16 overflow-hidden pointer-events-none">
            <div
              className="w-full h-16 rounded-[2.5rem] opacity-25"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
                transform: "scaleY(-1) translateY(2px)",
                filter: "blur(6px)",
                maskImage: "linear-gradient(to bottom, black 30%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 30%, transparent)",
              }}
            />
          </div>

          <motion.div
            className="relative px-6 py-5 rounded-[2.5rem] border border-white/20 backdrop-blur-3xl"
            style={{
              background: `
                radial-gradient(80% 70% at 50% 0%, 
                  rgba(255, 255, 255, 0.4) 0%, 
                  rgba(255, 255, 255, 0.2) 50%, 
                  rgba(255, 255, 255, 0.1) 100%
                ),
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.05) 100%
                )`,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 8px 12px -4px rgba(255, 255, 255, 0.3),
                inset 0 -8px 12px -4px rgba(0, 0, 0, 0.1)
              `,
            }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="absolute inset-0 rounded-[2.5rem] opacity-60 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    60% 60% at 50% 0%, 
                    rgba(255, 255, 255, 0.8) 0%, 
                    transparent 100%
                  )`,
                filter: "blur(2px)",
              }}
            />

            <div className="flex items-end gap-3 relative z-10">
              {dockItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{ y: -20, zIndex: 10 }}
                >
                  <motion.div
                    className="relative cursor-pointer"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleIconClick(item)}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0"
                      animate={{
                        opacity: 0.7,
                        scale: 1.25,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: item.gradient,
                        filter: "blur(16px)",
                      }}
                    />
                    <div
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border border-white/20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
                        boxShadow: `
                          0 8px 20px -4px rgba(0,0,0,0.2),
                          inset 0 2px 2px rgba(255,255,255,0.4),
                          inset 0 -2px 2px rgba(0,0,0,0.1)
                        `,
                      }}
                    >
                      <div className="absolute inset-0">
                        <Canvas dpr={[1, 1]}>
                          <LiquidGlassPanel imageUrl={item.imageUrl} />
                        </Canvas>
                      </div>
                      <item.icon className="text-white drop-shadow-lg relative z-10" size={24} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
