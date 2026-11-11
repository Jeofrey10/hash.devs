import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';
import { createStudioEnvironment } from './sharedEnv';

export function VoxAI3DScene({ className = '' }: { className?: string }) {
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
    camera.position.set(0, 0.35, 5.0);
    camera.lookAt(0, 0, 0);

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

    // 3. Studio HDR Environment Map for Precision Anodized Aluminum Reflections
    const studioEnv = createStudioEnvironment(renderer, {
      zenithIntensity: 12.0,
      equatorIntensity: 16.0,
      horizonColor: [18.0, 20.0, 19.0],
      baseColor: [0.003, 0.003, 0.004],
    });
    scene.environment = studioEnv.texture;

    // 4. Generate Procedural CNC Acoustic Micro-Perforation Depth, Bump & Roughness Maps
    const perfW = 1024;
    const perfH = 512;

    // A. Color / Albedo Map
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = perfW;
    colorCanvas.height = perfH;
    const cCtx = colorCanvas.getContext('2d');

    // B. Bump Map (True geometric depth gradient with chamfered rim)
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = perfW;
    bumpCanvas.height = perfH;
    const bCtx = bumpCanvas.getContext('2d');

    // C. Roughness Map (High roughness inside bore, low sleek roughness on aluminum surface)
    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = perfW;
    roughCanvas.height = perfH;
    const rCtx = roughCanvas.getContext('2d');

    if (cCtx && bCtx && rCtx) {
      // Base aluminum surface
      cCtx.fillStyle = '#1B221E';
      cCtx.fillRect(0, 0, perfW, perfH);

      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, perfW, perfH);

      rCtx.fillStyle = '#454545'; // ~0.27 roughness on aluminum face
      rCtx.fillRect(0, 0, perfW, perfH);

      // Acoustic circular drill holes grid
      const rows = 14;
      const cols = 56;
      const xSpacing = perfW / cols;
      const ySpacing = perfH / rows;

      for (let r = 0; r < rows; r++) {
        const rowOffset = (r % 2) * (xSpacing / 2);
        for (let c = 0; c < cols; c++) {
          const cx = c * xSpacing + rowOffset;
          const cy = r * ySpacing + ySpacing / 2;

          // 1. Chamfer Rim (Specular highlight reflection)
          cCtx.beginPath();
          cCtx.arc(cx, cy, 5.6, 0, Math.PI * 2);
          cCtx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          cCtx.fill();

          bCtx.beginPath();
          bCtx.arc(cx, cy, 5.6, 0, Math.PI * 2);
          bCtx.fillStyle = '#A0A0A0';
          bCtx.fill();

          // 2. Bore Cavity Wall (Occlusion shadow gradient)
          cCtx.beginPath();
          cCtx.arc(cx, cy, 4.4, 0, Math.PI * 2);
          cCtx.fillStyle = '#090E0B';
          cCtx.fill();

          bCtx.beginPath();
          bCtx.arc(cx, cy, 4.4, 0, Math.PI * 2);
          bCtx.fillStyle = '#202020';
          bCtx.fill();

          // 3. Deep Acoustic Core (Pitch black void with zero specular shine)
          cCtx.beginPath();
          cCtx.arc(cx, cy, 3.2, 0, Math.PI * 2);
          cCtx.fillStyle = '#020403';
          cCtx.fill();

          bCtx.beginPath();
          bCtx.arc(cx, cy, 3.2, 0, Math.PI * 2);
          bCtx.fillStyle = '#000000';
          bCtx.fill();

          rCtx.beginPath();
          rCtx.arc(cx, cy, 4.4, 0, Math.PI * 2);
          rCtx.fillStyle = '#F0F0F0'; // ~0.94 roughness inside deep bore
          rCtx.fill();
        }
      }
    }

    const perfTexture = new THREE.CanvasTexture(colorCanvas);
    perfTexture.colorSpace = THREE.SRGBColorSpace;
    perfTexture.wrapS = THREE.RepeatWrapping;
    perfTexture.wrapT = THREE.ClampToEdgeWrapping;
    perfTexture.needsUpdate = true;

    const perfBumpTexture = new THREE.CanvasTexture(bumpCanvas);
    perfBumpTexture.wrapS = THREE.RepeatWrapping;
    perfBumpTexture.wrapT = THREE.ClampToEdgeWrapping;
    perfBumpTexture.needsUpdate = true;

    const perfRoughTexture = new THREE.CanvasTexture(roughCanvas);
    perfRoughTexture.wrapS = THREE.RepeatWrapping;
    perfRoughTexture.wrapT = THREE.ClampToEdgeWrapping;
    perfRoughTexture.needsUpdate = true;

    // 5. Build 3D Precision Industrial Chassis Assembly
    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // Anodized 6061-T6 Aluminum Material
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0x1c231f,
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 2.0,
    });

    // Dark Gunmetal Precision Base Foot with Machined Bevel
    const baseGeo = new THREE.CylinderGeometry(0.82, 0.86, 0.16, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0e1310,
      metalness: 0.92,
      roughness: 0.35,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -1.05, 0);
    deviceGroup.add(baseMesh);

    // Lower Main Cylinder Chassis
    const lowerGeo = new THREE.CylinderGeometry(0.86, 0.86, 0.85, 64);
    const lowerMesh = new THREE.Mesh(lowerGeo, aluminumMat);
    lowerMesh.position.set(0, -0.55, 0);
    deviceGroup.add(lowerMesh);

    // Inner Acoustic Damper Cloth (Sits inside the perforated grille)
    const innerDamperGeo = new THREE.CylinderGeometry(0.852, 0.852, 0.88, 64);
    const innerDamperMat = new THREE.MeshBasicMaterial({ color: 0x050706 });
    const innerDamperMesh = new THREE.Mesh(innerDamperGeo, innerDamperMat);
    innerDamperMesh.position.set(0, 0.22, 0);
    deviceGroup.add(innerDamperMesh);

    // Middle CNC Acoustic Micro-Perforation Grille Band
    const perfGeo = new THREE.CylinderGeometry(0.864, 0.864, 0.88, 64);
    const perfMat = new THREE.MeshStandardMaterial({
      map: perfTexture,
      bumpMap: perfBumpTexture,
      bumpScale: 0.024,
      roughnessMap: perfRoughTexture,
      metalness: 0.85,
      roughness: 0.30,
      envMapIntensity: 1.9,
    });
    const perfMesh = new THREE.Mesh(perfGeo, perfMat);
    perfMesh.position.set(0, 0.22, 0);
    deviceGroup.add(perfMesh);

    // Diamond-Cut Chamfer Upper Transition Ring
    const chamferGeo = new THREE.CylinderGeometry(0.88, 0.864, 0.08, 64);
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f8f6,
      metalness: 1.0,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.6,
    });
    const chamferMesh = new THREE.Mesh(chamferGeo, chromeMat);
    chamferMesh.position.set(0, 0.70, 0);
    deviceGroup.add(chamferMesh);

    // Active 360° Beamforming Neon-Green LED Ring (Restrained Premium Emissive)
    const ledRingGeo = new THREE.TorusGeometry(0.872, 0.020, 16, 64);
    ledRingGeo.rotateX(Math.PI / 2);
    const ledRingMat = new THREE.MeshStandardMaterial({
      color: 0x35E85B,
      emissive: 0x35E85B,
      emissiveIntensity: 2.2, // Controlled intensity to eliminate excessive bloom
      roughness: 0.25,
      toneMapped: true,
    });
    const ledRingMesh = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRingMesh.position.set(0, 0.74, 0);
    deviceGroup.add(ledRingMesh);

    // Top Cap Body
    const topCapGeo = new THREE.CylinderGeometry(0.85, 0.88, 0.14, 64);
    const topCapMesh = new THREE.Mesh(topCapGeo, aluminumMat);
    topCapMesh.position.set(0, 0.81, 0);
    deviceGroup.add(topCapMesh);

    // Top Recessed Machined Metal Rotary Dial Wheel with Defined Bevels
    const dialGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.05, 64);
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x121714,
      metalness: 0.94,
      roughness: 0.20,
      envMapIntensity: 1.8,
    });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.set(0, 0.88, 0);
    deviceGroup.add(dialMesh);

    // Rotary Dial Active Status Dot
    const dotGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.02, 16);
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0x35E85B,
      emissive: 0x35E85B,
      emissiveIntensity: 2.5,
      toneMapped: true,
    });
    const dotMesh = new THREE.Mesh(dotGeo, dotMat);
    dotMesh.position.set(0.48, 0.91, 0);
    deviceGroup.add(dotMesh);

    // Holographic Soundwave Acoustic Orbital Waveguides (Controlled, Subtle Elegance)
    const wave1Geo = new THREE.TorusGeometry(1.35, 0.007, 16, 80);
    wave1Geo.rotateX(Math.PI / 2.3);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x35E85B,
      transparent: true,
      opacity: 0.18,
    });
    const wave1Mesh = new THREE.Mesh(wave1Geo, waveMat);
    wave1Mesh.position.set(0, 0.2, 0);
    deviceGroup.add(wave1Mesh);

    const wave2Geo = new THREE.TorusGeometry(1.68, 0.005, 16, 80);
    wave2Geo.rotateX(Math.PI / 2.1);
    const wave2Mesh = new THREE.Mesh(wave2Geo, waveMat);
    wave2Mesh.position.set(0, 0.2, 0);
    deviceGroup.add(wave2Mesh);

    // 6. Studio Lighting Rig: Large Softbox Key + Precise Metallic Rim Highlights
    const ambientLight = new THREE.AmbientLight(0x0c120e, 0.95);
    scene.add(ambientLight);

    // Large softbox key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.2, 4.0, 3.2);
    scene.add(keyLight);

    // Narrow cool metallic rim light
    const coolRimLight = new THREE.DirectionalLight(0xa5b4fc, 1.3);
    coolRimLight.position.set(-3.5, 2.0, -2.4);
    scene.add(coolRimLight);

    // Subtle Hash neon green fill kick
    const neonKickLight = new THREE.DirectionalLight(0x35E85B, 1.1);
    neonKickLight.position.set(-2.5, -1.0, 2.5);
    scene.add(neonKickLight);

    // 7. Interactive Pointer Parallax Tracking (Desktop Only)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = normX * 0.40;
      targetRotX = normY * 0.30;
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

        clock += 0.009;

        // Controlled Product Turntable Rotation & Smooth Pointer Parallax
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        deviceGroup.rotation.y = clock * 0.45 + currentRotY;
        deviceGroup.rotation.x = currentRotX + 0.04;
        deviceGroup.position.y = Math.sin(clock * 0.8) * 0.025;

        // Subtle acoustic orbital waveguides counter-rotation
        wave1Mesh.rotation.z = -clock * 0.6;
        wave2Mesh.rotation.z = clock * 0.45;

        // Subtle dial status pulsing
        dialMesh.rotation.y = Math.sin(clock * 0.3) * 0.2;

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
      baseGeo.dispose();
      lowerGeo.dispose();
      innerDamperGeo.dispose();
      perfGeo.dispose();
      chamferGeo.dispose();
      ledRingGeo.dispose();
      topCapGeo.dispose();
      dialGeo.dispose();
      dotGeo.dispose();
      wave1Geo.dispose();
      wave2Geo.dispose();

      // Dispose Materials & Textures
      aluminumMat.dispose();
      baseMat.dispose();
      innerDamperMat.dispose();
      perfMat.dispose();
      chromeMat.dispose();
      ledRingMat.dispose();
      dialMat.dispose();
      dotMat.dispose();
      waveMat.dispose();

      perfTexture.dispose();
      perfBumpTexture.dispose();
      perfRoughTexture.dispose();

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
      aria-label="Interactive 3D Precision Industrial Hardware Chassis"
    />
  );
}
