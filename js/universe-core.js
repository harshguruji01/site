/**
 * universe-core.js - WebGuruJi / HarshGuruJi 3D Spatial Universe Engine
 * Powered by Three.js WebGL with Hardware Tiering, 3D Earth, AI Core, and Spatial Portals
 */

(function () {
  'use strict';

  // Quality & Tier Detection
  const QualityTier = {
    detect: function () {
      if (!window.WebGLRenderingContext) return 'FALLBACK';
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'FALLBACK';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

        if (isMobile) return 'LOW';
        if (/NVIDIA|Radeon|Direct3D11|Apple M/i.test(renderer) && window.devicePixelRatio >= 1.5) {
          return 'ULTRA';
        }
        if (/Intel HD|UHD|Iris/i.test(renderer)) {
          return 'MEDIUM';
        }
        return 'HIGH';
      } catch (e) {
        return 'FALLBACK';
      }
    }
  };

  let activeTier = QualityTier.detect();
  let scene, camera, renderer, clock;
  let canvasContainer, canvas;
  let animFrameId = null;

  // 3D Objects in the universe
  let aiCoreGroup, coreRings = [], coreParticles, coreEnergyPulse;
  let earthGroup, earthMesh, earthClouds, earthAtmo, earthOrbits = [];
  let starField;
  let portals = [];
  let raycaster, mouseVec;
  let hoveredPortal = null;

  // Camera choreography state
  const cameraState = {
    currentPos: { x: 0, y: 30, z: 120 },
    targetPos: { x: 0, y: 15, z: 75 },
    currentLook: { x: 0, y: 0, z: 0 },
    targetLook: { x: 0, y: 0, z: 0 },
    activeRoom: 'UNIVERSE',
    mouseParallax: { x: 0, y: 0 },
    isDraggingEarth: false,
    previousMousePosition: { x: 0, y: 0 }
  };

  // AI Core interactive state: idle, listening, processing, response
  let coreState = 'idle';
  let coreStateTimer = 0;

  // Room Camera Targets (Spatial coordinates for each 3D portal/room)
  const ROOM_POSITIONS = {
    'UNIVERSE': { pos: { x: 0, y: 15, z: 75 }, look: { x: 0, y: 0, z: 0 } },
    'ai': { pos: { x: -32, y: 8, z: 22 }, look: { x: -40, y: 8, z: 0 } },
    'tools': { pos: { x: 32, y: 8, z: 22 }, look: { x: 40, y: 8, z: 0 } },
    'gaming': { pos: { x: -38, y: -12, z: 28 }, look: { x: -45, y: -15, z: 0 } },
    'learning': { pos: { x: 38, y: -12, z: 28 }, look: { x: 45, y: -15, z: 0 } },
    'store': { pos: { x: 0, y: -28, z: 32 }, look: { x: 0, y: -35, z: 0 } },
    'search': { pos: { x: 0, y: 32, z: 28 }, look: { x: 0, y: 40, z: 0 } },
    'profile': { pos: { x: -24, y: 24, z: 25 }, look: { x: -30, y: 30, z: 0 } },
    'daily': { pos: { x: 24, y: 24, z: 25 }, look: { x: 30, y: 30, z: 0 } },
    'knowledge': { pos: { x: 38, y: 20, z: 22 }, look: { x: 48, y: 25, z: -10 } },
    'about': { pos: { x: -38, y: 20, z: 22 }, look: { x: -48, y: 25, z: -10 } },
    'contact': { pos: { x: 0, y: -35, z: 22 }, look: { x: 0, y: -45, z: -10 } }
  };

  // Initial setup
  function init() {
    canvasContainer = document.getElementById('universe-canvas-container');
    canvas = document.getElementById('universe-canvas');

    if (!canvas || !canvasContainer) return;

    if (activeTier === 'FALLBACK' || !window.THREE) {
      enable2DFallback();
      return;
    }

    try {
      clock = new THREE.Clock();
      mouseVec = new THREE.Vector2();
      raycaster = new THREE.Raycaster();

      // Scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x030712, 0.0035);

      // Camera
      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.set(cameraState.currentPos.x, cameraState.currentPos.y, cameraState.currentPos.z);
      camera.lookAt(0, 0, 0);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: activeTier === 'ULTRA' || activeTier === 'HIGH',
        alpha: true,
        powerPreference: 'high-performance'
      });

      const dpr = activeTier === 'ULTRA' ? Math.min(window.devicePixelRatio, 2) :
                  activeTier === 'HIGH' ? Math.min(window.devicePixelRatio, 1.5) : 1;
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x030712, 1);

      // Lights
      setupLighting();

      // Cosmic starfield & nebula
      buildStarfield();

      // Centerpiece: HarshGuruJi AI Core
      buildAICore();

      // Interactive 3D Earth
      buildEarth();

      // 8 Spatial Portals
      buildPortals();

      // Event Listeners
      setupInteractions();
      setupNetworkMonitor();
      setupThemeObserver();

      // Start animation loop
      animate();

      // Website opens in 2D mode by default. User can switch to 3D anytime via button or #3d
      if (window.location.hash === '#3d' || window.location.hash === '#universe-3d') {
        enter3DMode();
      } else {
        document.body.classList.add('universe-2d-mode');
      }

    } catch (err) {
      console.warn("WebGL initialization failed, falling back to 2D Mode:", err);
      enable2DFallback();
    }
  }

  // Lighting (PeachWeb Warm Sunset & Obsidian Theme)
  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x241224, 2.0);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xff6b4a, 3.5, 130);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const earthSunLight = new THREE.DirectionalLight(0xfff0e6, 2.4);
    earthSunLight.position.set(50, 20, 40);
    scene.add(earthSunLight);

    const purpleBacklight = new THREE.PointLight(0x9d4edd, 2.2, 160);
    purpleBacklight.position.set(0, -30, -40);
    scene.add(purpleBacklight);
  }

  // Starfield
  function buildStarfield() {
    const starCount = activeTier === 'ULTRA' ? 3500 : activeTier === 'HIGH' ? 2000 : 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const color1 = new THREE.Color(0xff6b4a); // Peach Coral
    const color2 = new THREE.Color(0x9d4edd); // Cosmic Violet
    const color3 = new THREE.Color(0xfff5ee); // Warm Starlight

    for (let i = 0; i < starCount; i++) {
      const radius = 300 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.6 ? color1 : Math.random() > 0.5 ? color2 : color3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    starField = new THREE.Points(geometry, material);
    scene.add(starField);
  }

  // HarshGuruJi AI Core (Centerpiece - PeachWeb Style)
  function buildAICore() {
    aiCoreGroup = new THREE.Group();
    aiCoreGroup.position.set(0, 0, 0);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff6b4a,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    aiCoreGroup.add(innerCore);

    // Solid glowing core
    const solidGeo = new THREE.SphereGeometry(2.5, 24, 24);
    const solidMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const solidCore = new THREE.Mesh(solidGeo, solidMat);
    aiCoreGroup.add(solidCore);

    // Gyroscopic Holographic Orbital Rings
    const ringRadii = [5.5, 7.2, 9.0];
    const ringColors = [0xff6b4a, 0xfeb47b, 0x9d4edd];

    ringRadii.forEach((rad, idx) => {
      const ringGeo = new THREE.TorusGeometry(rad, 0.08, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      coreRings.push(ring);
      aiCoreGroup.add(ring);
    });

    // Swirling Energy Particles
    const pCount = activeTier === 'ULTRA' ? 400 : 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2;
      const dist = 4 + Math.random() * 5;
      pPos[i * 3] = Math.cos(angle) * dist;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pPos[i * 3 + 2] = Math.sin(angle) * dist;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffa07a,
      size: 1.2,
      transparent: true,
      opacity: 0.85
    });
    coreParticles = new THREE.Points(pGeo, pMat);
    aiCoreGroup.add(coreParticles);

    // Expanding Energy Pulse Wave
    const pulseGeo = new THREE.RingGeometry(2, 2.4, 64);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xff6b4a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    coreEnergyPulse = new THREE.Mesh(pulseGeo, pulseMat);
    coreEnergyPulse.rotation.x = Math.PI / 2;
    aiCoreGroup.add(coreEnergyPulse);

    // 3D Central Holographic Title Treatment: HARSHGURUJI (Explore. Learn. Create. Play.)
    const titleCanvas = document.createElement('canvas');
    titleCanvas.width = 1024;
    titleCanvas.height = 256;
    const tCtx = titleCanvas.getContext('2d');
    if (tCtx) {
      tCtx.clearRect(0, 0, 1024, 256);
      
      const grad = tCtx.createLinearGradient(100, 0, 924, 0);
      grad.addColorStop(0, '#ff6b4a');
      grad.addColorStop(0.5, '#feb47b');
      grad.addColorStop(1, '#9d4edd');
      
      tCtx.font = 'bold 84px "Space Grotesk", -apple-system, sans-serif';
      tCtx.textAlign = 'center';
      tCtx.fillStyle = grad;
      tCtx.shadowColor = 'rgba(255, 107, 74, 0.7)';
      tCtx.shadowBlur = 25;
      tCtx.fillText('HARSHGURUJI', 512, 115);
      
      tCtx.font = '600 30px "Space Grotesk", monospace';
      tCtx.fillStyle = '#ffffff';
      tCtx.shadowColor = 'rgba(254, 180, 123, 0.4)';
      tCtx.shadowBlur = 15;
      tCtx.fillText('EXPLORE • LEARN • CREATE • PLAY', 512, 180);
      
      const titleTex = new THREE.CanvasTexture(titleCanvas);
      const titleMat = new THREE.SpriteMaterial({ map: titleTex, transparent: true, opacity: 0.95 });
      const titleSprite = new THREE.Sprite(titleMat);
      titleSprite.position.set(0, 13.5, 0);
      titleSprite.scale.set(26, 6.5, 1);
      aiCoreGroup.add(titleSprite);
    }

    scene.add(aiCoreGroup);
  }

  // Interactive 3D Earth (PeachWeb Warm Sunset & Oceanic Glow)
  function buildEarth() {
    earthGroup = new THREE.Group();
    // Positioned gracefully in the medium-distance orbit
    earthGroup.position.set(0, -6, -20);

    const earthRadius = 9;

    // Procedural Canvas Texture for Earth continents and grid
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext('2d');

    // Deep obsidian ocean
    ctx.fillStyle = '#080c18';
    ctx.fillRect(0, 0, 1024, 512);

    // Lat / Long grid lines (Warm PeachWeb Sunset Gold)
    ctx.strokeStyle = 'rgba(254, 180, 123, 0.18)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Stylized continents (Peach Coral)
    ctx.fillStyle = 'rgba(255, 126, 95, 0.45)';
    // Eurasia / Africa
    ctx.beginPath();
    ctx.ellipse(600, 200, 160, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    // Americas
    ctx.beginPath();
    ctx.ellipse(280, 240, 120, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(820, 360, 60, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Illuminated city dots
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 150; i++) {
      const cx = (Math.random() * 0.8 + 0.1) * 1024;
      const cy = (Math.random() * 0.7 + 0.15) * 512;
      ctx.fillRect(cx, cy, 2, 2);
    }

    const earthTex = new THREE.CanvasTexture(earthCanvas);
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      shininess: 30,
      specular: 0xff7e5f,
      emissive: 0x160a14,
      transparent: true,
      opacity: 0.95
    });

    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Glowing Atmospheric Halo (Sunset Peach Rim)
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.08, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xff7e5f,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    earthAtmo = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(earthAtmo);

    // Subtle cloud wireframe shell
    const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.02, 32, 32);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xfeb47b,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(earthClouds);

    // Holographic Orbital Rings with Labels
    const labels = ['AI', 'TOOLS', 'LEARNING', 'GAMING', 'TECHNOLOGY'];
    const trackRadius = 14;

    const trackGeo = new THREE.RingGeometry(trackRadius - 0.05, trackRadius + 0.05, 64);
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0xff7e5f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = Math.PI / 2.3;
    earthGroup.add(track);

    // Rotating satellites / tags
    labels.forEach((text, i) => {
      const angle = (i / labels.length) * Math.PI * 2;
      const tag = createHoloTextSprite(text);
      tag.userData = { angle: angle, radius: trackRadius, speed: 0.25 };
      earthOrbits.push(tag);
      earthGroup.add(tag);
    });

    scene.add(earthGroup);
  }

  // 8 Spatial 3D Portals (PeachWeb Color Palette)
  function buildPortals() {
    const portalConfigs = [
      { id: 'ai', title: 'AI HUB', x: -40, y: 8, z: 0, color: 0xff6b4a, icon: '🤖' },
      { id: 'tools', title: 'TOOL HUB', x: 40, y: 8, z: 0, color: 0xfeb47b, icon: '🔧' },
      { id: 'gaming', title: 'GAMING HUB', x: -45, y: -15, z: 0, color: 0x9d4edd, icon: '🎮' },
      { id: 'learning', title: 'LEARNING HUB', x: 45, y: -15, z: 0, color: 0xff8a65, icon: '📚' },
      { id: 'store', title: 'STORE', x: 0, y: -35, z: 0, color: 0xffa07a, icon: '🛍️' },
      { id: 'search', title: 'SEARCH', x: 0, y: 40, z: 0, color: 0xff6b4a, icon: '🔍' },
      { id: 'profile', title: 'PROFILE', x: -30, y: 30, z: 0, color: 0xec4899, icon: '👤' },
      { id: 'daily', title: 'DAILY SPECIAL', x: 30, y: 30, z: 0, color: 0xf59e0b, icon: '🌅' },
      { id: 'knowledge', title: 'KNOWLEDGE', x: 48, y: 22, z: -10, color: 0x38bdf8, icon: '💡' },
      { id: 'about', title: 'ABOUT', x: -48, y: 22, z: -10, color: 0x34d399, icon: 'ℹ️' },
      { id: 'contact', title: 'CONTACT', x: 0, y: -45, z: -10, color: 0xf43f5e, icon: '📞' }
    ];

    portalConfigs.forEach(cfg => {
      const portalGroup = new THREE.Group();
      portalGroup.position.set(cfg.x, cfg.y, cfg.z);
      portalGroup.userData = { id: cfg.id, title: cfg.title, originalScale: 1 };

      // Outer Portal Gateway Ring
      const ringGeo = new THREE.TorusGeometry(5, 0.25, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      portalGroup.add(ring);

      // Inner Portal Event Horizon Discus
      const innerGeo = new THREE.CircleGeometry(4.7, 32);
      const innerMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const innerDisc = new THREE.Mesh(innerGeo, innerMat);
      portalGroup.add(innerDisc);

      // Floating Hologram Text Badge
      const textSprite = createHoloTextSprite(`${cfg.icon} ${cfg.title}`);
      textSprite.position.set(0, -6.5, 0);
      portalGroup.add(textSprite);

      // Orbital particles around portal
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(60 * 3);
      for (let i = 0; i < 60; i++) {
        const rad = 5.2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        pPos[i * 3] = Math.cos(theta) * rad;
        pPos[i * 3 + 1] = Math.sin(theta) * rad;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: cfg.color,
        size: 0.8,
        transparent: true,
        opacity: 0.7
      });
      const particles = new THREE.Points(pGeo, pMat);
      portalGroup.add(particles);

      scene.add(portalGroup);
      portals.push(portalGroup);
    });
  }

  // Create Holographic Text Sprite
  function createHoloTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(12, 12, 16, 0.85)';
    ctx.roundRect(16, 16, 480, 96, 24);
    ctx.fill();

    ctx.strokeStyle = '#ff6b4a';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(8, 2, 1);
    return sprite;
  }

  // Interactions (Mouse, Touch, Raycasting)
  function setupInteractions() {
    window.addEventListener('resize', onWindowResize);

    window.addEventListener('mousemove', (e) => {
      // Parallax offset
      cameraState.mouseParallax.x = (e.clientX / window.innerWidth - 0.5) * 6;
      cameraState.mouseParallax.y = (e.clientY / window.innerHeight - 0.5) * -6;

      // Raycasting coordinates
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Earth drag
      if (cameraState.isDraggingEarth && earthGroup) {
        const deltaX = e.clientX - cameraState.previousMousePosition.x;
        const deltaY = e.clientY - cameraState.previousMousePosition.y;
        earthGroup.rotation.y += deltaX * 0.006;
        earthGroup.rotation.x += deltaY * 0.006;
      }
      cameraState.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousedown', (e) => {
      cameraState.isDraggingEarth = true;
      cameraState.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      cameraState.isDraggingEarth = false;
    });

    // Touch Support
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        cameraState.isDraggingEarth = true;
        cameraState.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (cameraState.isDraggingEarth && e.touches.length === 1 && earthGroup) {
        const deltaX = e.touches[0].clientX - cameraState.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - cameraState.previousMousePosition.y;
        earthGroup.rotation.y += deltaX * 0.008;
        earthGroup.rotation.x += deltaY * 0.008;
        cameraState.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      cameraState.isDraggingEarth = false;
    });

    // Click on 3D Portals
    canvas.addEventListener('click', () => {
      if (hoveredPortal) {
        navigateToRoom(hoveredPortal.userData.id);
      }
    });

    // Keyboard Shortcuts (1-8 to navigate portals, Esc/Home for Universe)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const keyMap = {
        '1': 'ai',
        '2': 'tools',
        '3': 'gaming',
        '4': 'learning',
        '5': 'store',
        '6': 'search',
        '7': 'profile',
        '8': 'daily',
        '9': 'knowledge',
        'a': 'about',
        'A': 'about',
        'c': 'contact',
        'C': 'contact',
        'Escape': 'UNIVERSE',
        'h': 'UNIVERSE',
        'H': 'UNIVERSE'
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        navigateToRoom(keyMap[e.key]);
      }
    });
  }

  function setupNetworkMonitor() {
    const netEl = document.getElementById('hud-network-status');
    const updateNet = (isOnline) => {
      if (netEl) {
        netEl.innerHTML = isOnline
          ? '<span class="hud-net-dot"></span> ONLINE'
          : '<span class="hud-net-dot offline"></span> OFFLINE';
      }
      if (!isOnline && window.UniverseRooms) {
        window.UniverseRooms.showToast("Network Offline - Local Cache Active", "⚠️");
      }
    };
    window.addEventListener('online', () => updateNet(true));
    window.addEventListener('offline', () => updateNet(false));
    updateNet(navigator.onLine !== false);
  }

  function setupThemeObserver() {
    const updateTheme = () => {
      const isLight = document.body.dataset.theme === 'light';
      if (renderer) {
        renderer.setClearColor(isLight ? 0xfbf7f5 : 0x030712, 1);
      }
      if (scene && scene.fog) {
        scene.fog.color.setHex(isLight ? 0xfbf7f5 : 0x030712);
      }
    };
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Camera fly-to navigation between Universe overview and dedicated 3D Rooms
  function navigateToRoom(roomId) {
    if (!ROOM_POSITIONS[roomId]) roomId = 'UNIVERSE';

    cameraState.activeRoom = roomId;
    const target = ROOM_POSITIONS[roomId];
    cameraState.targetPos = { ...target.pos };
    cameraState.targetLook = { ...target.look };

    // Audio Feedback
    if (window.UniverseSound) {
      window.UniverseSound.playWhoosh();
    }

    // Update HUD location indicator
    updateLocationHUD(roomId);

    // Sync active state on bottom dock
    syncDockActiveState(roomId);

    // Trigger DOM Room Overlay Transition
    if (window.UniverseRooms) {
      window.UniverseRooms.showRoom(roomId);
    }

    // Direct page navigation for knowledge, about, contact
    if (roomId === 'knowledge') {
      if (window.UniverseRooms) window.UniverseRooms.showToast("Opening Knowledge Hub...", "💡");
      setTimeout(() => { window.location.href = 'education.html'; }, 650);
    } else if (roomId === 'about') {
      if (window.UniverseRooms) window.UniverseRooms.showToast("Opening About Portal...", "ℹ️");
      setTimeout(() => { window.location.href = 'about.html'; }, 650);
    } else if (roomId === 'contact') {
      if (window.UniverseRooms) window.UniverseRooms.showToast("Opening Contact Terminal...", "📞");
      setTimeout(() => { window.location.href = 'contact.html'; }, 650);
    }
  }

  function updateLocationHUD(roomId) {
    const locText = document.getElementById('hud-location-text');
    if (!locText) return;

    const titles = {
      'UNIVERSE': 'CENTRAL UNIVERSE ORBIT',
      'ai': 'AI COMMAND CORE',
      'tools': 'SPATIAL TOOL MATRIX',
      'gaming': 'CYBER GAMING ARENA',
      'learning': 'DIGITAL CLASSROOM',
      'store': 'SPATIAL MARKETPLACE',
      'search': 'HOLOGRAPHIC SEARCH GATEWAY',
      'profile': 'PERSONAL COMMAND CENTER',
      'daily': 'DAILY SPECIAL STATION',
      'knowledge': 'KNOWLEDGE & EDUCATION HUB',
      'about': 'ABOUT HARSHGURUJI',
      'contact': 'CONTACT & SUPPORT TERMINAL'
    };
    locText.textContent = titles[roomId] || 'SYSTEM ONLINE';
  }

  function syncDockActiveState(roomId) {
    document.querySelectorAll('.dock-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-room') === roomId);
    });
  }

  // AI Core Reactive Visual Feedback
  function setAICoreState(state) {
    coreState = state;
    coreStateTimer = clock.getElapsedTime();
    if (window.UniverseSound) {
      if (state === 'processing') window.UniverseSound.playPulse();
      if (state === 'response') window.UniverseSound.playChime();
    }
  }

  // Render & Animation Loop
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Animate HarshGuruJi AI Core
    if (aiCoreGroup) {
      let speedMult = 1;
      if (coreState === 'listening') speedMult = 2.2;
      if (coreState === 'processing') speedMult = 4.5;
      if (coreState === 'response') speedMult = 1.6;

      coreRings.forEach((ring, i) => {
        ring.rotation.x += (0.01 + i * 0.005) * speedMult;
        ring.rotation.y += (0.015 - i * 0.003) * speedMult;
      });

      if (coreParticles) {
        coreParticles.rotation.y += 0.02 * speedMult;
      }

      // Energy pulse expansion on response
      if (coreEnergyPulse) {
        if (coreState === 'response') {
          const progress = (elapsedTime - coreStateTimer) % 1.5;
          coreEnergyPulse.scale.set(1 + progress * 8, 1 + progress * 8, 1);
          coreEnergyPulse.material.opacity = Math.max(0, 1 - (progress / 1.5));
        } else {
          coreEnergyPulse.material.opacity = 0;
        }
      }
    }

    // 2. Animate Earth & Orbital Satellites
    if (earthGroup) {
      if (!cameraState.isDraggingEarth) {
        earthMesh.rotation.y += 0.002;
        earthClouds.rotation.y += 0.0028;
      }

      earthOrbits.forEach((tag) => {
        tag.userData.angle += tag.userData.speed * delta;
        tag.position.x = Math.cos(tag.userData.angle) * tag.userData.radius;
        tag.position.z = Math.sin(tag.userData.angle) * tag.userData.radius;
        tag.position.y = Math.sin(tag.userData.angle) * 3;
      });
    }

    // 3. Animate Starfield drift
    if (starField) {
      starField.rotation.y = elapsedTime * 0.0008;
    }

    // 4. Animate Spatial Portals
    portals.forEach((p, idx) => {
      p.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.015;
      p.rotation.z += 0.005;
    });

    // 5. Raycasting for Hover Detection
    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObjects(portals, true);

    if (intersects.length > 0) {
      let hitGroup = intersects[0].object;
      while (hitGroup.parent && !hitGroup.userData.id) {
        hitGroup = hitGroup.parent;
      }
      if (hitGroup && hitGroup.userData.id) {
        if (hoveredPortal !== hitGroup) {
          if (hoveredPortal) hoveredPortal.scale.set(1, 1, 1);
          hoveredPortal = hitGroup;
          hoveredPortal.scale.set(1.15, 1.15, 1.15);
          document.body.classList.add('cursor-hover');
          if (window.UniverseSound) window.UniverseSound.playBeep(1200, 0.04);
        }
      }
    } else {
      if (hoveredPortal) {
        hoveredPortal.scale.set(1, 1, 1);
        hoveredPortal = null;
        document.body.classList.remove('cursor-hover');
      }
    }

    // 6. Smooth Camera Interpolation (Choreography Lerp)
    const lerpFactor = 0.055;
    cameraState.currentPos.x += (cameraState.targetPos.x + cameraState.mouseParallax.x - cameraState.currentPos.x) * lerpFactor;
    cameraState.currentPos.y += (cameraState.targetPos.y + cameraState.mouseParallax.y - cameraState.currentPos.y) * lerpFactor;
    cameraState.currentPos.z += (cameraState.targetPos.z - cameraState.currentPos.z) * lerpFactor;

    cameraState.currentLook.x += (cameraState.targetLook.x - cameraState.currentLook.x) * lerpFactor;
    cameraState.currentLook.y += (cameraState.targetLook.y - cameraState.currentLook.y) * lerpFactor;
    cameraState.currentLook.z += (cameraState.targetLook.z - cameraState.currentLook.z) * lerpFactor;

    camera.position.set(cameraState.currentPos.x, cameraState.currentPos.y, cameraState.currentPos.z);
    camera.lookAt(cameraState.currentLook.x, cameraState.currentLook.y, cameraState.currentLook.z);

    renderer.render(scene, camera);
  }

  // Startup Intro Sequence
  function checkStartupSequence() {
    const introOverlay = document.getElementById('universe-intro');
    const enterBtn = document.getElementById('btn-enter-universe');
    const skipBtn = document.getElementById('skip-intro-btn');

    if (!introOverlay) return;

    // Check if user already saw intro in current session
    if (sessionStorage.getItem('hg_intro_seen') === 'true') {
      introOverlay.classList.add('hidden');
      return;
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        completeStartupSequence();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        completeStartupSequence();
      });
    }
  }

  function completeStartupSequence() {
    const introOverlay = document.getElementById('universe-intro');
    if (introOverlay) {
      introOverlay.classList.add('hidden');
    }
    sessionStorage.setItem('hg_intro_seen', 'true');
    if (window.UniverseSound) {
      window.UniverseSound.playIntroSwell();
    }
    // Camera swoop into position
    cameraState.targetPos = { ...ROOM_POSITIONS.UNIVERSE.pos };
  }

  // 2D and 3D Mode Handlers
  function enter3DMode() {
    document.body.classList.remove('universe-2d-mode');
    sessionStorage.setItem('hg_view_mode', '3d');
    
    // Resize renderer and update projection matrix
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Position camera to central orbit
    cameraState.targetPos = { ...ROOM_POSITIONS.UNIVERSE.pos };
    cameraState.targetLook = { ...ROOM_POSITIONS.UNIVERSE.look };
    cameraState.activeRoom = 'UNIVERSE';
    
    // Update HUD location text
    const locText = document.getElementById('hud-location-text');
    if (locText) locText.textContent = 'CENTRAL UNIVERSE ORBIT';

    // Update active dock icon
    document.querySelectorAll('.dock-item').forEach(item => {
      item.classList.toggle('active', item.dataset.room === 'UNIVERSE');
    });
    
    // Play sound and show toast
    if (window.UniverseSound) window.UniverseSound.playWhoosh();
    if (window.UniverseRooms) window.UniverseRooms.showToast("Entered 3D Digital Universe", "🌌");
  }

  function exit3DMode() {
    document.body.classList.add('universe-2d-mode');
    sessionStorage.setItem('hg_view_mode', '2d');
    
    // Close any active 3D room overlays
    document.querySelectorAll('.universe-room').forEach(r => r.classList.remove('active'));
    const search = document.getElementById('universe-search-overlay');
    if (search) search.classList.remove('active');
    
    if (window.UniverseRooms) window.UniverseRooms.showToast("Returned to 2D Website", "📄");
  }

  function toggle2DMode() {
    if (document.body.classList.contains('universe-2d-mode')) {
      enter3DMode();
    } else {
      exit3DMode();
    }
  }

  // Fallback to 2D Mode
  function enable2DFallback() {
    document.body.classList.add('universe-2d-mode');
    const intro = document.getElementById('universe-intro');
    if (intro) intro.classList.add('hidden');
    console.log("2D Mode Enabled: Clean luxury interface active.");
  }

  // Public Interface
  window.UniverseEngine = {
    init: init,
    navigateToRoom: navigateToRoom,
    setAICoreState: setAICoreState,
    enter3DMode: enter3DMode,
    exit3DMode: exit3DMode,
    toggle2DMode: toggle2DMode,
    getActiveTier: () => activeTier,
    getActiveRoom: () => cameraState.activeRoom
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
