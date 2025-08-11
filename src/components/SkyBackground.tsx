// src/components/SkyBackground.tsx
import React, { useEffect, useRef } from "react";

/*
Ultra-smooth background (performance-first):
- DPR fijo = 1 (evita overdraw en GPUs débiles).
- Sin lluvia, sin estrellas, sin paneles ni emisiones de eventos por frame.
- Ciclo día/tarde/noche suave y barato.
- Pasos del shader adaptativos (54–58) con control agresivo para sostener 50–60 fps.
*/

type Props = {
  enableDayNight?: boolean;
  dayNightCycleSec?: number;
  rainIntensity?: number;       // ignorado (siempre 0)
  enableAutoRain?: boolean;     // ignorado (siempre false)
  lowPowerMode?: boolean;       // por si se quiere forzar
};

export const SkyBackground: React.FC<Props> = ({
  enableDayNight = true,
  dayNightCycleSec = 120,
  // ignorados pero mantenidos para compat
  rainIntensity = 0,
  enableAutoRain = false,
  lowPowerMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uRef = useRef<{
    u_time: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_noise: WebGLUniformLocation | null;
    u_quality: WebGLUniformLocation | null;
    u_phase: WebGLUniformLocation | null;
    u_rain: WebGLUniformLocation | null;
    u_enableDayNight: WebGLUniformLocation | null;
  } | null>(null);
  const noiseTexRef = useRef<WebGLTexture | null>(null);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const lastTSRef = useRef<number>(performance.now());
  const visibleRef = useRef<boolean>(true);
  const inViewRef = useRef<boolean>(true);

  // Calidad adaptativa
  const qualityRef = useRef<number>(56); // punto de partida

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

    // Shader: sin estrellas/lluvia, solo ciclo suave con color grading ligero
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_noise;
      uniform float u_quality;         // 54..58
      uniform float u_phase;           // 0..1
      uniform float u_rain;            // 0 (no usado)
      uniform float u_enableDayNight;  // 0/1

      float dither8x8(vec2 p) {
        vec2 k = vec2(0.06711056, 0.00583715);
        float f = fract(52.9829189 * fract(dot(p, k)));
        return f * (1.0/255.0);
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
        float n = pn(p*7.6 + u_time*0.07);
        vec3 t = sin(p*3.14159265 + cos(p*3.14159265+1.57/2.0))*0.5 + 0.5;
        p = p*1.28 + (t - 1.28);
        res += (dot(t, vec3(0.333)));
        t = sin(p.yzx*3.14159265 + cos(p.zxy*3.14159265+1.57/2.0))*0.5 + 0.5;
        res += (dot(t, vec3(0.333)))*0.7071;    
        return ((res/1.7071))*0.85 + n*0.15;
      }
      float world(vec3 p) {
        float n = trigNoise3D(p * 0.09) * 8.8;
        p.y += n;
        return p.y - 3.0;
      }
      vec3 path(float p) {
        return vec3(sin(p*0.034)*6.8, cos(p*0.21)*0.75, p);
      }

      vec3 gradeBase(vec3 col, float sunF, float density, float travelled) {
        vec3 baseShadow = vec3(0.02, 0.035, 0.07);
        vec3 warm = vec3(0.40, 0.30, 0.22)*2.5;
        vec3 cool = vec3(0.20, 0.42, 0.74)*0.86;

        col = mix(
          mix(vec3(0.47), vec3(1.0), col * density * 4.2),
          baseShadow,
          col
        );
        col = mix(col, vec3(3.2), (5.0 - density)*0.009*(1.0 + sunF*0.46));
        col = mix(col, mix(warm, cool, sunF*sunF), travelled*0.0085);
        col *= col*2.0;
        return col;
      }

      vec3 applyDayNight(vec3 col, float phase) {
        if (u_enableDayNight < 0.5) return col;
        float p = fract(phase);
        float cyc = cos(p * 6.2831853);
        float day = smoothstep(-0.15, 0.6, cyc);
        float night = 1.0 - day;

        float sunrise = exp(-pow((p - 0.23) / 0.13, 2.0));
        float sunset  = exp(-pow((p - 0.77) / 0.13, 2.0));
        float golden  = clamp(sunrise + sunset, 0.0, 1.0);

        vec3 dayTint    = vec3(1.05, 1.04, 1.02);
        vec3 nightTint  = vec3(0.80, 0.90, 1.14);
        vec3 goldenTint = vec3(1.12, 1.00, 0.92);

        vec3 mixed = col * (dayTint * day + nightTint * night);
        mixed = mix(mixed, mixed * goldenTint, golden * 0.58);

        float exposure = mix(0.82, 1.06, day) + golden * 0.05;
        return mixed * exposure;
      }

      void main() {
        vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0);
        vec2 uv = (2.0*gl_FragCoord.xy/u_resolution.xy - 1.0)*aspect;

        float modtime = u_time * 1.64;
        vec3 movement = path(modtime);
        
        vec3 lookAt = vec3(0.0, -0.16, 0.0) + path(modtime + 0.84);
        vec3 camera_position = vec3(0.0, 0.0, -1.0) + movement;

        vec3 forward = normalize(lookAt - camera_position);
        vec3 right = normalize(vec3(forward.z, 0.0, -forward.x ));
        vec3 up = normalize(cross(forward,right));

        float FOV = 0.76; // ligeramente menor para ahorrar algo

        vec3 ro = camera_position; 
        vec3 rd = normalize(forward + FOV*uv.x*right + FOV*uv.y*up);
        rd.xy = rot2( movement.x * 0.03 ) * rd.xy;

        vec3 lp = vec3( 0.0, -10.0, 10.2) + ro;

        float density = 0.0;
        float dist = 1.0;
        float travelled = 0.0;
        const float distanceThreshold = 0.3;

        vec3 col = vec3(0.0);
        vec3 sp;

        int steps = int(clamp(u_quality, 54.0, 58.0));

        for (int i=0; i<58; i++) {
          if (i >= steps) break;
          if ((density>1.0) || travelled>76.0) {
            travelled = 76.0;
            break;
          }

          sp = ro + rd*travelled;
          dist = world(sp);
          if(dist < 0.3) dist = 0.25;

          float local_density = (distanceThreshold - dist)*step(dist, distanceThreshold);
          float weighting = (1.0 - density)*local_density;

          density += weighting*(1.0 - distanceThreshold)*1.0/dist*0.095;

          vec3 ld = lp-sp;
          float lDist = max(length(ld), 0.001);
          ld/=lDist;

          float atten = 1.0/(1.0 + lDist*0.12 + lDist*lDist*0.52);
          col += weighting*atten*1.15;
          travelled += max(dist*0.19, 0.02);
        }
        
        vec3 sunDir = normalize(lp-ro);
        float sunF = 1.0 - dot(rd,sunDir);

        col = gradeBase(col, sunF, density, travelled);
        col = applyDayNight(col, u_phase);

        // Pequeña vibración cromática MUY barata (vida sin jank)
        float vib = 0.018 * sin(u_time * 0.055) + 0.012 * sin(u_time * 0.1 + 1.2);
        col *= vec3(1.0 + 0.028 * vib, 1.0 + 0.018 * vib, 1.0);

        // Sin estrellas / sin lluvia
        col += dither8x8(gl_FragCoord.xy);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader) || "Shader compile error");
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vShader = compile(gl.VERTEX_SHADER, vsSource);
    const fShader = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vShader || !fShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program) || "Program link error");
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]);
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
    const u_phase = gl.getUniformLocation(program, "u_phase");
    const u_rain = gl.getUniformLocation(program, "u_rain");
    const u_enableDayNight = gl.getUniformLocation(program, "u_enableDayNight");
    uRef.current = { u_time, u_resolution, u_noise, u_quality, u_phase, u_rain, u_enableDayNight };

    // Textura de ruido en GPU
    const createNoiseTexture = (glc: WebGLRenderingContext) => {
      const size = 256;
      const pixels = new Uint8Array(size * size * 4);
      for (let i = 0; i < pixels.length; i += 4) {
        const v = Math.random() * 255;
        pixels[i + 0] = v;
        pixels[i + 1] = Math.random() * 255;
        pixels[i + 2] = Math.random() * 255;
        pixels[i + 3] = 255;
      }
      const tex = glc.createTexture()!;
      glc.bindTexture(glc.TEXTURE_2D, tex);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.REPEAT);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.REPEAT);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
      glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, size, size, 0, glc.RGBA, glc.UNSIGNED_BYTE, pixels);
      return tex;
    };

    const noiseTex = createNoiseTexture(gl);
    noiseTexRef.current = noiseTex;

    const resize = (initial = false) => {
      // DPR fijo a 1 para estabilidad
      const baseDpr = 1.0;
      const w = Math.floor(window.innerWidth * baseDpr);
      const h = Math.floor(window.innerHeight * baseDpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      if (uRef.current?.u_resolution) {
        gl.uniform2f(uRef.current.u_resolution, w, h);
      }
      if (initial) {
        if (uRef.current?.u_quality) gl.uniform1f(uRef.current.u_quality, 56);
        if (uRef.current?.u_enableDayNight) gl.uniform1f(uRef.current.u_enableDayNight, enableDayNight ? 1.0 : 0.0);
        if (uRef.current?.u_rain) gl.uniform1f(uRef.current.u_rain, 0.0); // siempre 0
      }
    };

    const loop = () => {
      if (!visibleRef.current || !inViewRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      const dt = now - lastTSRef.current;
      lastTSRef.current = now;

      // Ajuste agresivo de pasos para sostener fps
      const stepDelta = dt > 17 ? -1.0 : 0.15; // > ~58fps baja pasos, si va bien sube un poco
      qualityRef.current = Math.max(54, Math.min(58, qualityRef.current + stepDelta));
      if (uRef.current?.u_quality) gl.uniform1f(uRef.current.u_quality, qualityRef.current);

      const t = (now - startRef.current) * 0.0014 - 11200.0;

      let phaseWrap = 0.0;
      if (enableDayNight) {
        const phase = (now - startRef.current) / (dayNightCycleSec * 1000);
        phaseWrap = phase - Math.floor(phase);
        // No emitimos eventos ni CSS vars
      }

      gl.useProgram(programRef.current!);
      if (uRef.current?.u_time) gl.uniform1f(uRef.current.u_time, t);
      if (uRef.current?.u_phase) gl.uniform1f(uRef.current.u_phase, phaseWrap);
      if (uRef.current?.u_rain) gl.uniform1f(uRef.current.u_rain, 0.0);
      if (uRef.current?.u_noise) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, noiseTexRef.current);
        gl.uniform1i(uRef.current.u_noise, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(loop);
    };

    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resize();
      rafRef.current = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) lastTSRef.current = performance.now();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inViewRef.current = e.isIntersecting;
      },
      { root: null, threshold: 0.01 }
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, false);

    resize(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (programRef.current) gl.deleteProgram(programRef.current);
      if (noiseTexRef.current) gl.deleteTexture(noiseTexRef.current);
      glRef.current = null;
    };
  }, [enableDayNight, dayNightCycleSec, lowPowerMode]);

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
