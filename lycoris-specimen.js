/**
 * Lycoris Specimen — Red Chrome Spider Lily 3D Type Specimen
 * Procedural WebGL 3D + scroll scrubbed timeline
 * Brand: HarshGuruJi | URL: webguruji.online
 * Adapted from Kedhareswer's 21st.dev Lycoris Specimen
 */

(function () {
  'use strict';

  // ---- Vector Math & Procedural Curves --------------------------------------
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  };

  const rng = (seed) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const HEART = [0, 0.25, 0];

  const buildCurves = (florets, seed) => {
    const F = Math.max(3, Math.min(8, Math.round(florets)));
    const r = rng(seed);
    const curves = [];
    const up = [0, 1, 0];

    for (let i = 0; i < F; i++) {
      const phi = (i / F) * Math.PI * 2 + (r() - 0.5) * 0.3;
      const tilt = 1.05 + (r() - 0.5) * 0.25;
      const radial = [Math.cos(phi), 0, Math.sin(phi)];
      const u = norm([Math.sin(tilt) * radial[0], Math.cos(tilt), Math.sin(tilt) * radial[2]]);
      const base = [radial[0] * 0.13, 0.07, radial[2] * 0.13];
      const e1 = norm(cross(u, Math.abs(u[1]) > 0.9 ? [1, 0, 0] : up));
      const e2 = cross(u, e1);
      const stagger = i / F;
      const common = { base, stagger };

      // pedicel
      const ped = [];
      for (let k = 0; k <= 10; k++) {
        const s = k / 10;
        ped.push([radial[0] * 0.13 * s, 0.07 * Math.sin((s * Math.PI) / 2), radial[2] * 0.13 * s]);
      }
      curves.push({ pts: ped, kind: 2, w: 0.022, t: 0, lat: e1, twist: 0, bulb: false, phase: 0, ...common });

      // 6 tepals + stamens
      for (let j = 0; j < 6; j++) {
        const th = (j / 6) * Math.PI * 2 + i * 0.7 + (r() - 0.5) * 0.35;
        const d = add(mul(e1, Math.cos(th)), mul(e2, Math.sin(th)));
        const lat = norm(cross(d, u));
        const phase = r() * Math.PI * 2;

        const L = 1.35 + r() * 0.3;
        const b0 = 0.45 + r() * 0.2;
        const b1 = 2.75 + r() * 0.45;
        const pts = [base];
        let p = base;
        const steps = 48;
        for (let k = 1; k <= steps; k++) {
          const s = k / steps;
          const b = b0 + (b1 - b0) * Math.pow(s, 1.2);
          p = add(p, mul(add(mul(d, Math.sin(b)), mul(u, Math.cos(b))), L / steps));
          pts.push(p);
        }
        for (let k = 1; k <= steps; k++) {
          const s = k / steps;
          pts[k] = add(pts[k], mul(lat, Math.sin(s * Math.PI * 2.4 + phase) * 0.05 * s));
        }
        curves.push({
          pts, kind: 0, w: 0.075 + r() * 0.02, t: 0.02, lat, twist: 0.2 + r() * 0.35,
          bulb: false, phase, ...common,
        });

        const d2 = add(mul(e1, Math.cos(th + 0.52)), mul(e2, Math.sin(th + 0.52)));
        const dh = norm([d2[0], 0, d2[2]]);
        const start = norm(add(u, mul(d2, 0.25)));
        const end = norm(add(add(mul(radial, 0.85), mul(dh, 0.5)), [0, -0.95, 0]));
        const Ls = 1.75 + r() * 0.45;
        const sp = [base];
        p = base;
        for (let k = 1; k <= 44; k++) {
          const s = k / 44;
          const m = Math.pow(s, 1.15);
          p = add(p, mul(norm(add(mul(start, 1 - m), mul(end, m))), Ls / 44));
          sp.push(p);
        }
        curves.push({
          pts: sp, kind: 1, w: 0.012, t: 0, lat, twist: 0, bulb: true,
          phase: phase + 1.3, ...common,
        });
      }

      // style
      {
        const end = norm(add(mul(radial, 0.9), [0, -0.35, 0]));
        const sp = [base];
        let p = base;
        const Ls = 2.2 + r() * 0.3;
        for (let k = 1; k <= 44; k++) {
          const s = k / 44;
          p = add(p, mul(norm(add(mul(u, 1 - s), mul(end, s))), Ls / 44));
          sp.push(p);
        }
        curves.push({
          pts: sp, kind: 1, w: 0.009, t: 0, lat: e1, twist: 0, bulb: false,
          phase: r() * 6, ...common,
        });
      }
    }

    // scape
    const stem = [];
    for (let k = 0; k <= 40; k++) {
      const s = k / 40;
      const y = 0.04 - s * 4.6;
      stem.push([Math.sin(s * 2.2) * 0.07, y, Math.sin(s * 1.3) * 0.03]);
    }
    curves.push({
      pts: stem, kind: 2, w: 0.05, t: 0, lat: [1, 0, 0], twist: 0, bulb: false,
      phase: 0, stagger: 0, base: [0, 0, 0],
    });

    let radius = 0;
    for (const c of curves) {
      if (c.kind === 2) continue;
      for (const q of c.pts) {
        radius = Math.max(radius, Math.hypot(q[0] - HEART[0], q[1] - HEART[1], q[2] - HEART[2]));
      }
    }
    return { curves, radius };
  };

  const STRIDE = 13;

  const buildMesh = (curves) => {
    const v = [];
    const idx = [];
    let count = 0;
    const push = (p, n, s, c) => {
      v.push(p[0], p[1], p[2], n[0], n[1], n[2], s, c.phase, c.kind, c.stagger, c.base[0], c.base[1], c.base[2]);
      return count++;
    };
    const tangent = (pts, i) =>
      norm(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]));

    for (const c of curves) {
      const n = c.pts.length;
      if (c.kind === 0) {
        const rings = [];
        let first = [];
        let last = [];
        let T0 = [0, 1, 0];
        let T1 = [0, 1, 0];
        for (let i = 0; i < n; i++) {
          const s = i / (n - 1);
          const T = tangent(c.pts, i);
          let N = norm(cross(T, c.lat));
          let W = cross(N, T);
          const a = c.twist * Math.sin(Math.PI * s);
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          const W2 = add(mul(W, ca), mul(N, sa));
          N = sub(mul(N, ca), mul(W, sa));
          W = W2;
          const hw = c.w * (0.42 + 0.58 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + s * 0.9)), 0.6))
            * (1 + 0.1 * Math.sin(s * 34 + c.phase));
          const p = c.pts[i];
          const k0 = add(add(p, mul(W, hw)), mul(N, c.t));
          const k1 = add(sub(p, mul(W, hw)), mul(N, c.t));
          const k2 = sub(sub(p, mul(W, hw)), mul(N, c.t));
          const k3 = sub(add(p, mul(W, hw)), mul(N, c.t));
          const mW = mul(W, -1);
          const mN = mul(N, -1);
          rings.push([
            push(k0, N, s, c), push(k1, N, s, c),
            push(k1, mW, s, c), push(k2, mW, s, c),
            push(k2, mN, s, c), push(k3, mN, s, c),
            push(k3, W, s, c), push(k0, W, s, c),
          ]);
          if (i === 0) { first = [k0, k1, k2, k3]; T0 = T; }
          if (i === n - 1) { last = [k0, k1, k2, k3]; T1 = T; }
        }
        for (let i = 0; i < n - 1; i++) {
          const a = rings[i];
          const b = rings[i + 1];
          for (let f = 0; f < 4; f++) {
            const x = f * 2;
            idx.push(a[x], a[x + 1], b[x], a[x + 1], b[x + 1], b[x]);
          }
        }
        const cap = (q, nrm, s) => {
          const o = q.map((p) => push(p, nrm, s, c));
          idx.push(o[0], o[1], o[2], o[0], o[2], o[3]);
        };
        cap(first, mul(T0, -1), 0);
        cap(last, T1, 1);
      } else {
        const seg = c.kind === 2 ? 10 : 6;
        let N = norm(cross(tangent(c.pts, 0), c.kind === 2 ? [0, 0, 1] : c.lat));
        const rings = [];
        for (let i = 0; i < n; i++) {
          const s = i / (n - 1);
          const T = tangent(c.pts, i);
          N = norm(sub(N, mul(T, dot(N, T))));
          const B = cross(T, N);
          let rad = c.w * (c.kind === 1 ? 1 - 0.35 * s : 1);
          if (c.bulb && s > 0.9) rad = c.w * (0.65 + 2.1 * Math.sin(((s - 0.9) / 0.1) * Math.PI * 0.92));
          if (c.kind === 1 && i === n - 1) rad *= 0.3;
          rings.push(count);
          for (let k = 0; k <= seg; k++) {
            const a = (k / seg) * Math.PI * 2;
            const nr = add(mul(N, Math.cos(a)), mul(B, Math.sin(a)));
            push(add(c.pts[i], mul(nr, rad)), nr, s, c);
          }
        }
        for (let i = 0; i < n - 1; i++) {
          for (let k = 0; k < seg; k++) {
            const a = rings[i] + k;
            const b = rings[i + 1] + k;
            idx.push(a, a + 1, b, a + 1, b + 1, b);
          }
        }
      }
    }
    return { data: new Float32Array(v), index: new Uint16Array(idx), vertices: count };
  };

  // ---- Matrix Mathematics ---------------------------------------------------
  const perspective = (fovy, aspect, near, far) => {
    const f = 1 / Math.tan(fovy / 2);
    const m = new Float32Array(16);
    m[0] = f / aspect;
    m[5] = f;
    m[10] = (far + near) / (near - far);
    m[11] = -1;
    m[14] = (2 * far * near) / (near - far);
    return m;
  };

  const lookAt = (eye, at) => {
    const z = norm(sub(eye, at));
    const x = norm(cross([0, 1, 0], z));
    const y = cross(z, x);
    const m = new Float32Array(16);
    m[0] = x[0]; m[4] = x[1]; m[8] = x[2];
    m[1] = y[0]; m[5] = y[1]; m[9] = y[2];
    m[2] = z[0]; m[6] = z[1]; m[10] = z[2];
    m[12] = -dot(x, eye); m[13] = -dot(y, eye); m[14] = -dot(z, eye); m[15] = 1;
    return m;
  };

  const multiply = (a, b) => {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] =
          a[r] * b[c * 4] +
          a[4 + r] * b[c * 4 + 1] +
          a[8 + r] * b[c * 4 + 2] +
          a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  };

  const rotY = (t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  };

  const rotX = (t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  };

  const hexToLinear = (hex) => {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) return [0.8, 0.02, 0.03];
    const ch = (v) => Math.pow(v / 255, 2.2);
    return [ch((n >> 16) & 255), ch((n >> 8) & 255), ch(n & 255)];
  };

  // ---- GLSL Shaders ---------------------------------------------------------
  const VERT = `
attribute vec3 a_pos;
attribute vec3 a_nrm;
attribute vec4 a_aux;
attribute vec3 a_base;
uniform mat4 u_vp;
uniform mat4 u_model;
uniform vec2 u_offset;
uniform float u_time;
uniform float u_bloom;
uniform float u_sway;
uniform float u_stem;
varying vec3 v_n;
varying vec3 v_w;
varying float v_s;
void main() {
  vec3 p = a_pos;
  float k = a_aux.z;
  if (k < 1.5) {
    float g = clamp(u_bloom * 1.6 - a_aux.w * 0.6, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    p = a_base + (p - a_base) * g;
    float amp = (k < 0.5 ? 0.03 : 0.06) * u_sway * a_aux.x * a_aux.x;
    p += amp * vec3(sin(u_time * 0.9 + a_aux.y), 0.5 * sin(u_time * 1.3 + a_aux.y * 1.7), cos(u_time * 0.7 + a_aux.y * 1.3));
  } else if (p.y < 0.0) {
    p.y *= u_stem;
  }
  vec4 w = u_model * vec4(p, 1.0);
  v_w = w.xyz;
  v_n = (u_model * vec4(a_nrm, 0.0)).xyz;
  v_s = a_aux.x;
  gl_Position = u_vp * w;
  gl_Position.xy += u_offset * gl_Position.w;
}
`;

  const FRAG = `
precision highp float;
uniform vec3 u_eye;
uniform vec3 u_red;
uniform vec3 u_hot;
uniform float u_alpha;
varying vec3 v_n;
varying vec3 v_w;
varying float v_s;
float studio(vec3 r) {
  float key = pow(max(dot(r, normalize(vec3(-0.45, 0.85, 0.35))), 0.0), 14.0) * 2.6;
  float strip = smoothstep(0.55, 0.8, r.x) * smoothstep(-0.7, 0.3, r.y) * 1.4;
  float rim = smoothstep(0.55, 0.95, -r.z) * smoothstep(-0.2, 0.5, r.y) * 0.9;
  float hz = exp(-abs(r.y - 0.05) * 7.0) * 0.4;
  return key + strip + rim + hz;
}
void main() {
  vec3 n = normalize(v_n);
  vec3 v = normalize(u_eye - v_w);
  if (dot(n, v) < 0.0) n = -n;
  vec3 r = reflect(-v, n);
  float e = studio(r);
  float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  float dif = max(dot(n, normalize(vec3(-0.3, 0.8, 0.6))), 0.0);
  vec3 col = u_red * (0.04 + 0.22 * dif);
  col += u_red * e * 1.15;
  col += u_hot * pow(e, 3.0) * 0.3;
  col += u_red * fr * 1.1;
  col *= 0.8 + 0.2 * smoothstep(0.0, 0.25, v_s);
  col = col / (1.0 + col);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * u_alpha, u_alpha);
}
`;

  // ---- Camera Keyframes -----------------------------------------------------
  const KEYS = [
    { spin: 0.2, el: 9, size: 0.86, ox: 0, oy: 0.3, stem: 1 },
    { spin: 1.4, el: 88, size: 0.58, ox: 0, oy: 0, stem: 0 },
    { spin: 2.3, el: 12, size: 0.27, ox: 0, oy: 0.4, stem: 0.3 },
    { spin: 3.1, el: -30, size: 0.86, ox: 0, oy: -0.34, stem: 0.06 },
    { spin: 4.1, el: 16, size: 1.02, ox: 0.66, oy: 0.2, stem: 1 },
    { spin: 5.0, el: -74, size: 0.86, ox: 0, oy: 1.02, stem: 0.04 },
  ];

  const KEYS_TALL = [
    { size: 0.9, oy: 0.36 },
    { size: 0.56 },
    { size: 0.34, oy: 0.44 },
    { size: 0.95, oy: -0.2 },
    { size: 0.86, ox: 0.5, oy: 0.46 },
    { size: 0.96, oy: 1.0 },
  ];

  const SCENES = KEYS.length;
  const HOLD = 0.34;

  const keyAt = (coord, tall) => {
    const i = Math.max(0, Math.min(SCENES - 1, Math.floor(coord)));
    const j = Math.min(SCENES - 1, i + 1);
    const f = coord - i;
    const a = { ...KEYS[i], ...(tall ? KEYS_TALL[i] : {}) };
    const b = { ...KEYS[j], ...(tall ? KEYS_TALL[j] : {}) };
    const l = (x, y) => x + (y - x) * f;
    return {
      spin: l(a.spin, b.spin), el: l(a.el, b.el), size: l(a.size, b.size),
      ox: l(a.ox, b.ox), oy: l(a.oy, b.oy), stem: l(a.stem, b.stem),
    };
  };

  // ---- Scroll Math ----------------------------------------------------------
  const clamp01 = (x) => (x <= 0 ? 0 : x > 1 ? 1 : x);
  const smoothstep = (a, b, x) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const progressFrom = (top, height, viewport) => {
    const travel = height - viewport;
    if (travel <= 0) return 0;
    return clamp01(-top / travel);
  };

  const sceneCoord = (p, n, hold) => {
    if (n <= 1) return 0;
    const t = clamp01(p) * (n - 1);
    const i = Math.min(Math.floor(t), n - 2);
    const h = hold / 2;
    return i + easeInOut(clamp01((t - i - h) / (1 - 2 * h)));
  };

  const reveal = (coord, scene, delay) => {
    const d = coord - scene;
    const lag = d < 0 ? delay : 1 - delay;
    return clamp01((0.6 - Math.abs(d) - lag * 0.2) / 0.25);
  };

  // ---- Main Initialization --------------------------------------------------
  function initLycorisSpecimen() {
    const root = document.getElementById("lycoris-specimen-root");
    const stage = document.getElementById("lys-stage");
    const canvas = document.getElementById("lys-canvas");
    const glow = document.getElementById("lys-glow");
    const word = document.getElementById("lys-word");
    if (!root || !stage || !canvas || !glow || !word) return;

    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
      reduced = e.matches;
    });

    const crimson = "#e3131b";
    const alive = true;
    const florets = 6;
    const seed = 7;

    const { curves, radius } = buildCurves(florets, seed);
    const mesh = buildMesh(curves);

    // Setup WebGL
    let gl = null;
    let ctx2d = null;
    let prog = null;
    let vbo = null;
    let ibo = null;
    const loc = {};

    function initGL() {
      try {
        gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
        if (!gl) return false;

        const compile = (type, src) => {
          const sh = gl.createShader(type);
          gl.shaderSource(sh, src);
          gl.compileShader(sh);
          return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
        };

        const vs = compile(gl.VERTEX_SHADER, VERT);
        const fs = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) return false;

        prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;

        gl.useProgram(prog);
        vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
        ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.index, gl.STATIC_DRAW);

        const attr = (n, size, off) => {
          const a = gl.getAttribLocation(prog, n);
          if (a < 0) return;
          gl.enableVertexAttribArray(a);
          gl.vertexAttribPointer(a, size, gl.FLOAT, false, STRIDE * 4, off * 4);
        };
        attr("a_pos", 3, 0);
        attr("a_nrm", 3, 3);
        attr("a_aux", 4, 6);
        attr("a_base", 3, 10);

        for (const n of ["u_vp", "u_model", "u_offset", "u_time", "u_bloom", "u_sway", "u_stem", "u_eye", "u_red", "u_hot", "u_alpha"]) {
          loc[n] = gl.getUniformLocation(prog, n);
        }

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 0);
        return true;
      } catch (err) {
        console.warn("Lycoris WebGL fallback to 2D:", err);
        return false;
      }
    }

    if (!initGL()) {
      gl = null;
      ctx2d = canvas.getContext("2d");
    }

    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      gl = null;
    });
    canvas.addEventListener("webglcontextrestored", () => {
      if (!initGL()) gl = null;
    });

    // Measurements & ResizeObserver
    let W = 1;
    let H = 1;
    let dpr = 1;
    const chars = Array.from(word.querySelectorAll("[data-ch]"));
    const firstIdx = 0;
    const lastIdx = chars.length - 1;
    let nat = [];

    const measure = () => {
      const sr = stage.getBoundingClientRect();
      W = Math.max(1, sr.width);
      H = Math.max(1, sr.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(W * dpr);
      const ch = Math.round(H * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const saved = chars.map((c) => c.style.transform);
      chars.forEach((c) => (c.style.transform = "none"));
      nat = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2 - sr.left, y: r.top + r.height / 2 - sr.top, w: r.width };
      });
      chars.forEach((c, i) => (c.style.transform = saved[i]));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    measure();
    if (document.fonts) {
      document.fonts.ready.then(measure);
    }

    // Interactive elements
    const items = Array.from(stage.querySelectorAll("[data-sc]")).map((el) => ({
      el,
      scene: Number(el.dataset.sc),
      fx: el.dataset.fx || "rise",
      delay: Number(el.dataset.d) || 0,
      last: -1,
    }));

    // Pointer tilt & drag
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let spin = 0;
    let spinVel = 0;
    let drag = null;

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (drag && drag.id === e.pointerId) {
        spinVel += (e.clientX - drag.x) * 0.0022;
        drag.x = e.clientX;
      }
    };

    const onDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const t = e.target;
      if (t.closest("a, button, [contenteditable], .lys-g")) return;
      drag = { id: e.pointerId, x: e.clientX };
      stage.style.cursor = "grabbing";
    };

    const onUp = () => {
      drag = null;
      stage.style.cursor = "";
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // Nav jumps
    const navButtons = Array.from(stage.querySelectorAll(".lys-nav button"));
    navButtons.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const r = root.getBoundingClientRect();
        const travel = r.height - stage.clientHeight;
        const delta = (idx / (SCENES - 1)) * travel + r.top;
        window.scrollBy({ top: delta, behavior: reduced ? "auto" : "smooth" });
      });
    });

    // Glyph hover inspector
    const inspectChar = document.getElementById("lys-inspect-char");
    const inspectCode = document.getElementById("lys-inspect-code");
    stage.addEventListener("pointerover", (e) => {
      const g = e.target.dataset?.g;
      if (g && inspectChar && inspectCode) {
        inspectChar.textContent = g;
        inspectChar.classList.add("active");
        inspectCode.textContent = "U+" + (g.codePointAt(0) || 0).toString(16).toUpperCase().padStart(4, "0");
      }
    });
    stage.addEventListener("pointerleave", () => {
      if (inspectChar && inspectCode) {
        inspectChar.textContent = "& ?";
        inspectChar.classList.remove("active");
        inspectCode.textContent = "HOVER A GLYPH";
      }
    });

    // Ligature button toggle
    const ligaBtn = document.getElementById("lys-liga-btn");
    if (ligaBtn) {
      ligaBtn.addEventListener("click", () => {
        const isPressed = ligaBtn.getAttribute("aria-pressed") === "true";
        ligaBtn.setAttribute("aria-pressed", isPressed ? "false" : "true");
        ligaBtn.classList.toggle("no-liga", isPressed);
      });
    }

    // Animation Loop
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    const born = last;
    let time = 0;
    let prog01 = -1;
    let shownScene = -1;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const moving = alive && !reduced;
      if (moving) time += dt;

      const r = root.getBoundingClientRect();
      const p = progressFrom(r.top, r.height, H);
      prog01 = prog01 < 0 || reduced ? p : prog01 + (p - prog01) * (1 - Math.exp(-dt * 9));
      const coord = sceneCoord(prog01, SCENES, HOLD);
      const scene = Math.round(coord);

      if (scene !== shownScene) {
        shownScene = scene;
        navButtons.forEach((btn, idx) => {
          if (idx === scene) btn.setAttribute("aria-current", "step");
          else btn.removeAttribute("aria-current");
        });
      }

      // Camera calculations
      const tall = H > W * 1.05;
      const k = keyAt(coord, tall);
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 4));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 4));

      if (moving) {
        spin += spinVel + dt * 0.1;
        spinVel *= Math.exp(-dt * 3);
      } else {
        spin += spinVel;
        spinVel = 0;
      }

      const px = moving ? pointer.x : 0;
      const py = moving ? pointer.y : 0;
      const fov = (30 * Math.PI) / 180;
      const minDim = Math.min(W, H);
      const dist = (radius * H) / (k.size * minDim * Math.tan(fov / 2));
      const el = Math.max(-88, Math.min(88, k.el + py * 9)) * (Math.PI / 180);
      const eye = [HEART[0], HEART[1] + Math.sin(el) * dist, HEART[2] + Math.cos(el) * dist];
      const proj = perspective(fov, W / H, Math.max(0.05, dist - 6), dist + 8);
      const vp = multiply(proj, lookAt(eye, HEART));
      const model = multiply(rotY(k.spin + spin + px * 0.35), rotX(py * 0.05));
      const bloom = reduced ? 1 : clamp01((now - born) / 2600);

      // Red haze glow
      const gx = (0.5 + k.ox / 2) * W;
      const gy = (0.5 - k.oy / 2) * H;
      const gr = k.size * minDim * 1.25;
      glow.style.transform = "translate(" + (gx - gr).toFixed(1) + "px," + (gy - gr).toFixed(1) + "px)";
      glow.style.width = glow.style.height = (gr * 2).toFixed(1) + "px";

      // Render WebGL
      if (gl && prog) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const red = hexToLinear(crimson);
        gl.uniformMatrix4fv(loc.u_vp, false, vp);
        gl.uniformMatrix4fv(loc.u_model, false, model);
        gl.uniform2f(loc.u_offset, k.ox, k.oy);
        gl.uniform1f(loc.u_time, time);
        gl.uniform1f(loc.u_bloom, bloom);
        gl.uniform1f(loc.u_sway, moving ? 1 : 0);
        gl.uniform1f(loc.u_stem, k.stem);
        gl.uniform3f(loc.u_eye, eye[0], eye[1], eye[2]);
        gl.uniform3f(loc.u_red, red[0] * 2.2, red[1] * 2.2, red[2] * 2.2);
        gl.uniform3f(loc.u_hot, 1, 0.55 + red[1], 0.5 + red[2]);
        gl.uniform1f(loc.u_alpha, 1);
        gl.drawElements(gl.TRIANGLES, mesh.index.length, gl.UNSIGNED_SHORT, 0);
      } else if (ctx2d) {
        // 2D Canvas Fallback
        const c = ctx2d;
        const mvp = multiply(vp, model);
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        c.lineCap = "round";
        c.strokeStyle = crimson;
        c.shadowColor = crimson;
        c.shadowBlur = 12;
        for (const cv of curves) {
          c.beginPath();
          cv.pts.forEach((q, i) => {
            const y = cv.kind === 2 && q[1] < 0 ? q[1] * k.stem : q[1];
            const cx = mvp[0] * q[0] + mvp[4] * y + mvp[8] * q[2] + mvp[12];
            const cy = mvp[1] * q[0] + mvp[5] * y + mvp[9] * q[2] + mvp[13];
            const cw = mvp[3] * q[0] + mvp[7] * y + mvp[11] * q[2] + mvp[15];
            const sx = ((cx / cw + k.ox) * 0.5 + 0.5) * W;
            const sy = (0.5 - (cy / cw + k.oy) * 0.5) * H;
            if (i === 0) c.moveTo(sx, sy);
            else c.lineTo(sx, sy);
          });
          c.lineWidth = cv.kind === 0 ? (minDim * k.size) / 22 : cv.kind === 1 ? 1.2 : 3;
          c.stroke();
        }
      }

      // Frame text transitions
      const still = reduced;
      for (const it of items) {
        const v = reveal(coord, it.scene, it.delay);
        const q = Math.round(v * 500) / 500;
        if (q === it.last) continue;
        it.last = q;
        const s = it.el.style;
        const dir = coord < it.scene ? 1 : -1;
        s.visibility = q <= 0 ? "hidden" : "";
        if (it.fx === "draw") {
          s.setProperty("--v", String(q));
          s.opacity = String(Math.min(1, q * 3));
          continue;
        }
        if (it.fx === "line") {
          s.transform = "scaleX(" + q + ")";
          s.opacity = String(Math.min(1, q * 2));
          continue;
        }
        s.opacity = String(q);
        if (still || it.fx === "fade") continue;
        if (it.fx === "clip") {
          const hid = ((1 - q) * 100).toFixed(1);
          s.clipPath = dir > 0 ? "inset(0 0 " + hid + "% 0)" : "inset(" + hid + "% 0 0 0)";
          s.transform = "translateY(" + ((1 - q) * 0.4 * dir).toFixed(3) + "em)";
        } else {
          s.transform = "translateY(" + ((1 - q) * 34 * dir).toFixed(1) + "px)";
          s.filter = q > 0.995 ? "" : "blur(" + ((1 - q) * 8).toFixed(1) + "px)";
        }
      }

      // Morph Cover Word into Crown
      const m = easeInOut(clamp01(coord));
      const out = clamp01(coord - 1);
      const r1 = keyAt(1, tall).size * minDim * 0.5;
      const cy1 = (0.5 - keyAt(1, tall).oy / 2) * H;

      chars.forEach((c, i) => {
        const n0 = nat[i];
        if (!n0) return;
        const flank = i === firstIdx || i === lastIdx;
        if (flank && firstIdx !== lastIdx) {
          const side = i === firstIdx ? -1 : 1;
          const lw = n0.w;
          const tx = W / 2 + side * (r1 + lw * 0.55 + minDim * 0.02);
          const dx = (tx - n0.x) * m;
          const dy = (cy1 - n0.y) * m - out * 60;
          const o = coord < 1 ? 1 : 1 - smoothstep(0.1, 0.45, out);
          c.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
          c.style.opacity = String(o);
          c.style.filter = still || out < 0.05 ? "" : "blur(" + (out * 14).toFixed(1) + "px)";
        } else {
          const dx = (W / 2 - n0.x) * m * 0.75;
          const dy = (cy1 - n0.y) * m;
          const o = 1 - smoothstep(0.0, 0.4, m);
          c.style.transform = still
            ? ""
            : "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + (1 - m * 0.7).toFixed(3) + ")";
          c.style.opacity = String(o);
          c.style.filter = still || m < 0.02 ? "" : "blur(" + (m * 12).toFixed(1) + "px)";
        }
        c.style.visibility = coord > 1.6 ? "hidden" : "";
      });
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLycorisSpecimen);
  } else {
    initLycorisSpecimen();
  }
})();
