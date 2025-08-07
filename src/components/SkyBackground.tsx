// src/components/SkyBackground.tsx
import React, { useEffect, useRef } from "react";

/*
SkyBackground pulido:
- Movimiento más suave (menor amplitud y frecuencia en path).
- Color grading estabilizado (ligero ajuste de mezcla para evitar lavados).
- Dither sutil para reducir banding en gradientes (8x8 blue-noise low-cost).
- Calidad adaptativa estable: límites 48–64 pasos, cambios lentos para evitar “pumps”.
- DPR objetivo 1.25–1.5 según hardware, sin saltos bruscos.
*/

export const SkyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uLocsRef = useRef<{
    u_time: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_noise: WebGLUniformLocation | null;
    u_quality: WebGLUniformLocation | null;
  } | null>(null);
  const noiseTexRef = useRef<WebGLTexture | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const dprRef = useRef<number>(1.25);
  const qualityRef = useRef<number>(64);
  const visibleRef = useRef<boolean>(true);
  const inViewRef = useRef<boolean>(true);
  const emaRef = useRef<number>(16.7);
  const changeCooldownRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        preserveDrawingBuffer: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) as WebGLRenderingContext) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    if (!gl) return;
    glRef.current = gl;

    const vsSource = `
      attribute vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;

    // Ajustes clave:
    // - path: menor amplitud y frecuencia -> cámara más estable
    // - mezcla color: leve rebalanceo para evitar “lavado” y exceso de highlights
    // - dither: patrón 8x8 para romper banding sutil sin ruido visible
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_noise;
      uniform float u_quality;

      // 8x8 blue-noise like dither (simple hash)
      float dither8x8(vec2 p) {
        // hash rápido
        vec2 k = vec2(0.06711056, 0.00583715);
        float f = fract(52.9829189 * fract(dot(p, k)));
        return f * (1.0/255.0); // intensidad muy baja
      }

      vec3 hash33(vec3 p){ 
        return texture2D(u_noise, p.xy * p.z * 256.0).rgb;
      }
      mat2 rot2(float a){
        vec2 v = sin(vec2(1.570796, 0.0) + a);
        return mat2(v, -v.y, v.x);
      }
      float pn(in vec3 p) {
        vec3 i = floor(p); 
        p -= i; 
        p *= p*(3.0 - 2.0*p);
        p.xy = texture2D(u_noise, (p.xy + i.xy + vec2(37.0, 17.0)*i.z + 0.5)/256.0, -100.0).yx;
        return mix(p.x, p.y, p.z);
      }
      float trigNoise3D(in vec3 p) {
        float res = 0.0;
        float n = pn(p*8.0 + u_time*0.08); // ligeramente más lento
        vec3 t = sin(p*3.14159265 + cos(p*3.14159265+1.57/2.0))*0.5 + 0.5;
        p = p*1.35 + (t - 1.35); // un poco menos agresivo
        res += (dot(t, vec3(0.333)));
        t = sin(p.yzx*3.14159265 + cos(p.zxy*3.14159265+1.57/2.0))*0.5 + 0.5;
        res += (dot(t, vec3(0.333)))*0.7071;    
        return ((res/1.7071))*0.85 + n*0.15;
      }
      float world(vec3 p) {
        float n = trigNoise3D(p * 0.095) * 9.5; // un toque más suave
        p.y += n;
        return p.y - 3.0;
      }
      vec3 path(float p) {
        // amplitudes menores para suavidad
        return vec3(sin(p*0.038)*8.0, cos(p*0.24)*0.85, p);
      }

      void main() {
        vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0);
        vec2 uv = (2.0*gl_FragCoord.xy/u_resolution.xy - 1.0)*aspect;

        float modtime = u_time * 1.85; // movimiento general más sereno
        vec3 movement = path(modtime);
        
        vec3 lookAt = vec3(0.0, -0.18, 0.0) + path(modtime + 0.9);
        vec3 camera_position = vec3(0.0, 0.0, -1.0) + movement;

        vec3 forward = normalize(lookAt - camera_position);
        vec3 right = normalize(vec3(forward.z, 0.0, -forward.x ));
        vec3 up = normalize(cross(forward,right));

        float FOV = 0.78; // leve ajuste FOV para estabilidad visual

        vec3 ro = camera_position; 
        vec3 rd = normalize(forward + FOV*uv.x*right + FOV*uv.y*up);
        rd.xy = rot2( movement.x * 0.035 ) * rd.xy;

        vec3 lp = vec3( 0.0, -10.0, 10.5) + ro;

        float density = 0.0;
        float dist = 1.0;
        float travelled = 0.0;

        const float distanceThreshold = 0.3;

        vec3 col = vec3(0.0);
        vec3 sp;

        int steps = int(clamp(u_quality, 48.0, 64.0));

        for (int i=0; i<64; i++) {
          if (i >= steps) break;
          if ((density>1.0) || travelled>80.0) {
            travelled = 80.0;
            break;
          }

          sp = ro + rd*travelled;
          dist = world(sp);
          if(dist < 0.3) dist = 0.25;

          float local_density = (distanceThreshold - dist)*step(dist, distanceThreshold);
          float weighting = (1.0 - density)*local_density;

          density += weighting*(1.0 - distanceThreshold)*1.0/dist*0.1;

          vec3 ld = lp-sp;
          float lDist = max(length(ld), 0.001);
          ld/=lDist;

          float atten = 1.0/(1.0 + lDist*0.125 + lDist*lDist*0.55);
          col += weighting*atten*1.22; // leve ajuste para highlights más equilibrados
          travelled += max(dist*0.2, 0.02);
        }
        
        vec3 sunDir = normalize(lp-ro);
        float sunF = 1.0 - dot(rd,sunDir);

        // Mezclas refinadas (menos lavado, sombras ligeramente más profundas)
        col = mix(
          mix(vec3(0.48), vec3(1.0), col * density * 4.7),
          vec3(0.02, 0.03, 0.05),
          col
        );
        col = mix(col, vec3(3.6), (5.0 - density)*0.009*(1.0 + sunF*0.48));
        col = mix(
          col, 
          mix(
            vec3(0.42, 0.32, 0.22)*2.8,
            vec3(0.2, 0.42, 0.74)*0.88,
            sunF*sunF*1.0
          ),
          travelled*0.009
        );
        
        col *= col*col*2.0;

        // Dither sutil para reducir banding perceptible
        float d = dither8x8(gl_FragCoord.xy);
        col += d;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh) || "Shader compile error");
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program) || "Program link error");
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    const quad = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
       1, -1,  1,  1,  -1, 1
    ]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const locPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const u_time = gl.getUniformLocation(program, "u_time");
    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_noise = gl.getUniformLocation(program, "u_noise");
    const u_quality = gl.getUniformLocation(program, "u_quality");
    uLocsRef.current = { u_time, u_resolution, u_noise, u_quality };

    // Noise texture
    const noiseTex = gl.createTexture()!;
    noiseTexRef.current = noiseTex;
    gl.bindTexture(gl.TEXTURE_2D, noiseTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, noiseTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resize(true);
      startRef.current = performance.now();
      loop();
    };

    // DPR objetivo estable
    const targetDPR = () => {
      const hw = navigator.hardwareConcurrency || 4;
      return hw >= 8 ? 1.5 : 1.25;
    };

    const resize = (initial = false) => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, targetDPR());
      const w = Math.floor(window.innerWidth * dprRef.current);
      const h = Math.floor(window.innerHeight * dprRef.current);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      if (uLocsRef.current?.u_resolution) {
        gl.uniform2f(uLocsRef.current.u_resolution, w, h);
      }
      if (initial && uLocsRef.current?.u_quality) {
        gl.uniform1f(uLocsRef.current.u_quality, qualityRef.current);
      }
    };

    let lastTS = performance.now();

    const loop = () => {
      if (!visibleRef.current || !inViewRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      const dt = now - lastTS;
      lastTS = now;

      // EMA del tiempo por frame
      emaRef.current = 0.9 * emaRef.current + 0.1 * dt;

      // Cambios de calidad con cooldown para evitar “bombeo”
      if (changeCooldownRef.current > 0) changeCooldownRef.current -= dt;

      if (changeCooldownRef.current <= 0) {
        if (emaRef.current > 22 && qualityRef.current > 48) {
          qualityRef.current = Math.max(48, qualityRef.current - 8);
          if (uLocsRef.current?.u_quality) gl.uniform1f(uLocsRef.current.u_quality, qualityRef.current);
          changeCooldownRef.current = 1000; // 1s
        } else if (emaRef.current < 17 && qualityRef.current < 64) {
          qualityRef.current = Math.min(64, qualityRef.current + 8);
          if (uLocsRef.current?.u_quality) gl.uniform1f(uLocsRef.current.u_quality, qualityRef.current);
          changeCooldownRef.current = 1200; // 1.2s
        }
      }

      const t = (now - startRef.current) * 0.0015 - 11200.0;
      gl.useProgram(program);
      if (uLocsRef.current?.u_time) gl.uniform1f(uLocsRef.current.u_time, t);
      if (uLocsRef.current?.u_noise) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, noiseTexRef.current);
        gl.uniform1i(uLocsRef.current.u_noise, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(loop);
    };

    const onResize = () => {
      cancelAnimationFrame(rafRef.current!);
      resize();
      rafRef.current = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        lastTS = performance.now();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewRef.current = e.isIntersecting;
        }
      },
      { root: null, threshold: 0.01 }
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, false);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (programRef.current) gl.deleteProgram(programRef.current);
      if (noiseTexRef.current) gl.deleteTexture(noiseTexRef.current);
      glRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block w-full h-full"
      style={{ display: "block", width: "100vw", height: "100vh" }}
      aria-hidden
    />
  );
};

export default SkyBackground;
