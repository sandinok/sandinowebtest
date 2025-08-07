// src/components/SkyBackground.tsx
import React, { useEffect, useRef } from "react";

/*
Optimized, dependency-free WebGL background:
- Ports your provided Three.js shader to raw WebGL for a compact, production-safe build.
- Removes mouse interaction, CCapture, and external script tags.
- Single full-screen draw call, DPR-aware resize, GPU-accelerated.
*/

export const SkyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uLocsRef = useRef<{
    u_time: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_noise: WebGLUniformLocation | null;
  } | null>(null);
  const noiseTexRef = useRef<WebGLTexture | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

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

    // Shaders
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader: direct port of your code (mouse/capture removed), same visuals
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_noise;

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
        float n = pn(p*8.0 + u_time*0.1);
        vec3 t = sin(p*3.14159265 + cos(p*3.14159265+1.57/2.0))*0.5 + 0.5;
        p = p*1.5 + (t - 1.5);
        res += (dot(t, vec3(0.333)));
        t = sin(p.yzx*3.14159265 + cos(p.zxy*3.14159265+1.57/2.0))*0.5 + 0.5;
        res += (dot(t, vec3(0.333)))*0.7071;    
        return ((res/1.7071))*0.85 + n*0.15;
      }

      float world(vec3 p) {
        float n = trigNoise3D(p * 0.1) * 10.0;
        p.y += n;
        return p.y - 3.0;
      }
      
      vec3 path(float p) {
        return vec3(sin(p*0.05)*10.0, cos(p * 0.3), p);
      }

      void main() {
        vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0);
        vec2 uv = (2.0*gl_FragCoord.xy/u_resolution.xy - 1.0)*aspect;

        float modtime = u_time * 2.0;
        vec3 movement = path(modtime);
        
        vec3 lookAt = vec3(0.0, -0.2, 0.0) + path(modtime + 1.0);
        vec3 camera_position = vec3(0.0, 0.0, -1.0) + movement;

        vec3 forward = normalize(lookAt - camera_position);
        vec3 right = normalize(vec3(forward.z, 0.0, -forward.x ));
        vec3 up = normalize(cross(forward,right));

        float FOV = 0.8;

        vec3 ro = camera_position; 
        vec3 rd = normalize(forward + FOV*uv.x*right + FOV*uv.y*up);
        rd.xy = rot2( movement.x * 0.04 ) * rd.xy;

        vec3 lp = vec3( 0.0, -10.0, 10.5) + ro;

        float density = 0.0;
        float dist = 1.0;
        float travelled = 0.0;

        const float distanceThreshold = 0.3;

        vec3 col = vec3(0.0);
        vec3 sp;

        for (int i=0; i<64; i++) {
          if((density>1.0) || travelled>80.0) {
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
          col += weighting*atten*1.25 ;
          travelled += max(dist*0.2, 0.02);
        }
        
        vec3 sunDir = normalize(lp-ro);
        float sunF = 1.0 - dot(rd,sunDir);

        col = mix(
          mix(vec3(0.5), vec3(1.0), col * density * 5.0),
          vec3(0.0),
          col
        );
        col = mix(col, vec3(4.0), (5.0 - density)*0.01*(1.0 + sunF*0.5));
        col = mix(
          col, 
          mix(
            vec3(0.4, 0.3, 0.2)*3.0,
            vec3(0.2, 0.4, 0.7)*0.9,
            sunF*sunF*1.0
          ),
          travelled*0.01
        );
        
        col *= col*col*col*2.0;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Compile
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

    // Quad
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

    // Uniforms
    const u_time = gl.getUniformLocation(program, "u_time");
    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_noise = gl.getUniformLocation(program, "u_noise");
    uLocsRef.current = { u_time, u_resolution, u_noise };

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
      resize();
      startRef.current = performance.now();
      loop();
    };

    // DPR-aware resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      if (uLocsRef.current?.u_resolution) {
        gl.uniform2f(uLocsRef.current.u_resolution, w, h);
      }
    };

    // Render loop
    const loop = () => {
      const now = performance.now();
      const t = (now - startRef.current) * 0.0015 - 11200.0; // keep original curve
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
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      if (uLocsRef.current?.u_resolution) {
        gl.uniform2f(uLocsRef.current.u_resolution, w, h);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
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
    />
  );
};

export default SkyBackground;
