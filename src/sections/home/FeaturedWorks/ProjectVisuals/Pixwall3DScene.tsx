import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';
import { createStudioEnvironment } from './sharedEnv';

export function Pixwall3DScene({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let isVisible = true;
    const reducedMotion = prefersReducedMotion();

    // Check WebGL availability
    const canvasTest = document.createElement('canvas');
    const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
    if (!gl) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    // 2. High Dynamic Range Renderer with Responsive Pixel Ratio Capping
    const isMobile = window.innerWidth < 768;
    const dprCap = isMobile ? 1.25 : 1.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // 3. Studio HDR Environment Map for Anodized Metal and Glazing Reflections
    const studioEnv = createStudioEnvironment(renderer, {
      zenithIntensity: 10.5,
      equatorIntensity: 14.0,
      horizonColor: [17.0, 18.0, 19.0],
      baseColor: [0.003, 0.003, 0.004],
    });
    scene.environment = studioEnv.texture;

    // 4. Generate High-Fidelity Procedural Poster Artwork Canvas Texture
    const artCanvas = document.createElement('canvas');
    artCanvas.width = 1024;
    artCanvas.height = 1320;
    const ctx = artCanvas.getContext('2d');

    if (ctx) {
      // Warm museum cotton-rag paper background
      ctx.fillStyle = '#EAE6DD';
      ctx.fillRect(0, 0, 1024, 1320);

      // Fine archival paper fiber stippling texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      for (let i = 0; i < 3500; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1320;
        ctx.fillRect(x, y, 1.2, 1.2);
      }

      // Poster Editorial Double Border
      ctx.strokeStyle = 'rgba(20, 24, 22, 0.18)';
      ctx.lineWidth = 2;
      ctx.strokeRect(64, 64, 896, 1192);

      ctx.strokeStyle = 'rgba(20, 24, 22, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(72, 72, 880, 1176);

      // Header Editorial Typography
      ctx.fillStyle = '#141715';
      ctx.font = '700 24px monospace';
      ctx.fillText('PIXWALL ATELIER', 84, 112);
      ctx.font = '500 18px monospace';
      ctx.fillStyle = 'rgba(20, 24, 22, 0.65)';
      ctx.fillText('SERIES NO. 04 // MONOLITH', 580, 112);

      ctx.strokeStyle = 'rgba(20, 24, 22, 0.15)';
      ctx.beginPath();
      ctx.moveTo(84, 132);
      ctx.lineTo(940, 132);
      ctx.stroke();

      // Central Bauhaus Graphic: Architectural Monolith & Color Blocks
      // Charcoal Primary Monolith Column
      ctx.fillStyle = '#181C1A';
      ctx.fillRect(260, 280, 240, 680);

      // Slate Secondary Monolith
      ctx.fillStyle = '#2C3530';
      ctx.fillRect(520, 360, 220, 600);

      // Hash Neon Green Geometric Accent Bar
      ctx.fillStyle = '#35E85B';
      ctx.fillRect(482, 220, 18, 780);

      // Hairline Specular Gold Rule
      ctx.fillStyle = '#E6C687';
      ctx.fillRect(230, 480, 540, 3);

      // Minimalist Geometry Disc
      ctx.beginPath();
      ctx.arc(630, 290, 70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(20, 24, 22, 0.7)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Sub-grid Accent Lines
      ctx.strokeStyle = 'rgba(20, 24, 22, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 300; y <= 900; y += 100) {
        ctx.beginPath();
        ctx.moveTo(180, y);
        ctx.lineTo(240, y);
        ctx.stroke();
      }

      // Footer Metadata Typography
      ctx.strokeStyle = 'rgba(20, 24, 22, 0.15)';
      ctx.beginPath();
      ctx.moveTo(84, 1175);
      ctx.lineTo(940, 1175);
      ctx.stroke();

      ctx.fillStyle = '#141715';
      ctx.font = '600 20px monospace';
      ctx.fillText('EDITION: 18 / 50', 84, 1215);
      ctx.fillStyle = 'rgba(20, 24, 22, 0.65)';
      ctx.fillText('ARCHITECTURAL DIGITAL MONOLITH', 520, 1215);
    }

    const artworkTexture = new THREE.CanvasTexture(artCanvas);
    artworkTexture.colorSpace = THREE.SRGBColorSpace;
    artworkTexture.needsUpdate = true;

    // 5. Build 3D Architectural Picture Frame Assembly with True Physical Depth
    const frameGroup = new THREE.Group();
    scene.add(frameGroup);

    // Frame Overall Dimensions
    const frameW = 2.48;
    const frameH = 3.10;
    const frameD = 0.18;
    const borderThick = 0.14;

    // Outer Anodized Dark Obsidian Aluminum Frame Material
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x121514,
      metalness: 0.78,
      roughness: 0.36,
      envMapIntensity: 1.4,
    });

    // Mitered Frame Border Profile: Beveled Bars with Defined Inner & Outer Chamfers
    // Top Bar
    const topBarGeo = new THREE.BoxGeometry(frameW, borderThick, frameD);
    const topBar = new THREE.Mesh(topBarGeo, frameMat);
    topBar.position.set(0, (frameH - borderThick) / 2, 0);
    frameGroup.add(topBar);

    // Bottom Bar
    const btmBarGeo = new THREE.BoxGeometry(frameW, borderThick, frameD);
    const btmBar = new THREE.Mesh(btmBarGeo, frameMat);
    btmBar.position.set(0, -(frameH - borderThick) / 2, 0);
    frameGroup.add(btmBar);

    // Left Bar
    const sideH = frameH - borderThick * 2;
    const leftBarGeo = new THREE.BoxGeometry(borderThick, sideH, frameD);
    const leftBar = new THREE.Mesh(leftBarGeo, frameMat);
    leftBar.position.set(-(frameW - borderThick) / 2, 0, 0);
    frameGroup.add(leftBar);

    // Right Bar
    const rightBarGeo = new THREE.BoxGeometry(borderThick, sideH, frameD);
    const rightBar = new THREE.Mesh(rightBarGeo, frameMat);
    rightBar.position.set((frameW - borderThick) / 2, 0, 0);
    frameGroup.add(rightBar);

    // Physically Separated Backing Board (Closes frame rear with solid seal)
    const backGeo = new THREE.BoxGeometry(frameW - 0.04, frameH - 0.04, 0.02);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x090b0a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 0, -frameD / 2 + 0.01);
    frameGroup.add(backMesh);

    // Museum Passe-Partout (Mat Board with Physical Beveled Window Cutout)
    const matW = frameW - borderThick * 2;
    const matH = frameH - borderThick * 2;
    const artW = matW * 0.86;
    const artH = matH * 0.86;

    // Construct Mat Board with Window Hole using ExtrudeGeometry for authentic beveled edge
    const matShape = new THREE.Shape();
    matShape.moveTo(-matW / 2, -matH / 2);
    matShape.lineTo(matW / 2, -matH / 2);
    matShape.lineTo(matW / 2, matH / 2);
    matShape.lineTo(-matW / 2, matH / 2);
    matShape.closePath();

    const windowHole = new THREE.Path();
    windowHole.moveTo(-artW / 2, -artH / 2);
    windowHole.lineTo(artW / 2, -artH / 2);
    windowHole.lineTo(artW / 2, artH / 2);
    windowHole.lineTo(-artW / 2, artH / 2);
    windowHole.closePath();
    matShape.holes.push(windowHole);

    const matGeo = new THREE.ExtrudeGeometry(matShape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3efe6,
      roughness: 0.95,
      metalness: 0.01,
      envMapIntensity: 0.45,
    });
    const matMesh = new THREE.Mesh(matGeo, matMaterial);
    matMesh.position.set(0, 0, -0.015);
    frameGroup.add(matMesh);

    // Framed Poster Artwork Plane (Physically mounted inside the mat board window cutout)
    const artGeo = new THREE.PlaneGeometry(artW + 0.04, artH + 0.04);
    const artMat = new THREE.MeshStandardMaterial({
      map: artworkTexture,
      roughness: 0.88,
      metalness: 0.02,
      envMapIntensity: 0.65,
    });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.set(0, 0, -0.018);
    frameGroup.add(artMesh);

    // Tactile 3D Relief Accent: Floating Precision Metallic Blade Monolith
    const bladeGeo = new THREE.BoxGeometry(0.30, 0.86, 0.038);
    const bladeMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e2422,
      metalness: 0.96,
      roughness: 0.18,
      clearcoat: 0.7,
      clearcoatRoughness: 0.06,
      envMapIntensity: 2.4,
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    bladeMesh.position.set(-0.25, -0.05, 0.022);
    frameGroup.add(bladeMesh);

    // Museum Anti-Reflective Glazing Protective Glass Front
    const glassGeo = new THREE.PlaneGeometry(matW + 0.02, matH + 0.02);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.04,
      reflectivity: 0.85,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 1.6,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0, frameD / 2 - 0.008);
    frameGroup.add(glassMesh);

    // 6. Gallery Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x161a18, 1.0);
    scene.add(ambientLight);

    // Warm museum spotlight
    const warmSpotlight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    warmSpotlight.position.set(2.8, 4.0, 3.6);
    scene.add(warmSpotlight);

    // Cool ambient gallery fill light
    const coolFillLight = new THREE.DirectionalLight(0xa0b2c6, 1.0);
    coolFillLight.position.set(-3.0, -1.2, 2.8);
    scene.add(coolFillLight);

    // Subtle gallery rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 3.2, -2.5);
    scene.add(rimLight);

    // 7. Interactive Pointer Parallax Tracking (Desktop Only)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = normX * 0.38;
      targetRotX = normY * 0.28;
    };

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      container.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // 8. High-Efficiency Animation Loop with Zero Idle GPU Overhead
    let clock = 0;
    let isRunning = false;

    const renderStaticFrame = () => {
      renderer.render(scene, camera);
    };

    const startAnimation = () => {
      if (reducedMotion) {
        renderStaticFrame();
        return;
      }
      if (isRunning || isDisposed || !isVisible) return;
      isRunning = true;

      const loop = () => {
        if (isDisposed || !isVisible) {
          isRunning = false;
          return;
        }
        animFrameRef.current = requestAnimationFrame(loop);

        clock += 0.01;

        // Smooth gentle floating gallery levitation
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        frameGroup.position.y = Math.sin(clock * 0.9) * 0.038;
        frameGroup.rotation.x = Math.cos(clock * 0.6) * 0.05 + currentRotX;
        frameGroup.rotation.y = Math.sin(clock * 0.7) * 0.09 + currentRotY;
        frameGroup.rotation.z = Math.sin(clock * 0.4) * 0.015;

        // Subtle specular gleam shift on the 3D relief blade
        bladeMesh.position.z = 0.022 + Math.sin(clock * 1.3) * 0.005;

        renderer.render(scene, camera);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };

    // IntersectionObserver: Only render when element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Initial kickstart
    startAnimation();

    // Handle container resize
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderStaticFrame();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Comprehensive Teardown & Resource Disposal
    return () => {
      isDisposed = true;
      stopAnimation();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (!isTouch) {
        container.removeEventListener('mousemove', handlePointerMove);
      }

      // Dispose Geometries
      topBarGeo.dispose();
      btmBarGeo.dispose();
      leftBarGeo.dispose();
      rightBarGeo.dispose();
      backGeo.dispose();
      matGeo.dispose();
      artGeo.dispose();
      bladeGeo.dispose();
      glassGeo.dispose();

      // Dispose Materials & Textures
      frameMat.dispose();
      backMat.dispose();
      matMaterial.dispose();
      artMat.dispose();
      bladeMat.dispose();
      glassMat.dispose();
      artworkTexture.dispose();

      studioEnv.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-auto ${className}`}
      aria-label="Interactive 3D Architectural Framed Art Atelier"
    />
  );
}
