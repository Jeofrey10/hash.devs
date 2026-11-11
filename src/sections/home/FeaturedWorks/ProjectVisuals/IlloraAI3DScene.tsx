import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';
import { createStudioEnvironment } from './sharedEnv';

export function IlloraAI3DScene({ className = '' }: { className?: string }) {
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
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
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

    // 3. Studio HDR Environment Map for Cybernetic Obsidian & Anodized Titanium Reflections
    const studioEnv = createStudioEnvironment(renderer, {
      zenithIntensity: 11.5,
      equatorIntensity: 14.5,
      horizonColor: [14.0, 18.0, 24.0],
      baseColor: [0.003, 0.003, 0.005],
    });
    scene.environment = studioEnv.texture;

    // 4. Multi-Agent DAG Constellation Group
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // Common Engineering Materials
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      metalness: 0.94,
      roughness: 0.22,
      envMapIntensity: 2.2,
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x1f2735,
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 1.8,
    });

    const frostedShellMat = new THREE.MeshPhysicalMaterial({
      color: 0x90b4d6,
      metalness: 0.2,
      roughness: 0.16,
      transmission: 0.65,
      transparent: true,
      opacity: 0.75,
      envMapIntensity: 1.6,
    });

    const blueCoreMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 2.4, // Controlled, restrained emissive
      roughness: 0.25,
      toneMapped: true,
    });

    const greenCoreMat = new THREE.MeshStandardMaterial({
      color: 0x35e85b,
      emissive: 0x35e85b,
      emissiveIntensity: 2.6, // Restrained Hash neon green
      roughness: 0.25,
      toneMapped: true,
    });

    const conduitMat = new THREE.MeshPhysicalMaterial({
      color: 0x243b55,
      metalness: 0.75,
      roughness: 0.18,
      transmission: 0.55,
      transparent: true,
      opacity: 0.82,
      envMapIntensity: 1.8,
    });

    // Helper: Build a precision multi-tier agent node enclosure
    const allGeos: THREE.BufferGeometry[] = [];
    const allMats: THREE.Material[] = [
      titaniumMat,
      collarMat,
      frostedShellMat,
      blueCoreMat,
      greenCoreMat,
      conduitMat,
    ];

    const createAgentNode = (coreMaterial: THREE.Material, scale = 1.0) => {
      const nodeGroup = new THREE.Group();

      // Outer Faceted Prismatic Shell (Hexagonal Cylinder)
      const shellGeo = new THREE.CylinderGeometry(0.36 * scale, 0.40 * scale, 0.38 * scale, 6);
      allGeos.push(shellGeo);
      const shell = new THREE.Mesh(shellGeo, titaniumMat);
      nodeGroup.add(shell);

      // Semi-translucent faceted shroud over upper core
      const shroudGeo = new THREE.CylinderGeometry(0.28 * scale, 0.32 * scale, 0.16 * scale, 6);
      allGeos.push(shroudGeo);
      const shroud = new THREE.Mesh(shroudGeo, frostedShellMat);
      shroud.position.set(0, 0.12 * scale, 0);
      nodeGroup.add(shroud);

      // Inner Luminous Autonomous Processing Core
      const coreGeo = new THREE.BoxGeometry(0.22 * scale, 0.22 * scale, 0.22 * scale);
      allGeos.push(coreGeo);
      const core = new THREE.Mesh(coreGeo, coreMaterial);
      nodeGroup.add(core);

      // Chamfer Edge Specular Ring
      const ringGeo = new THREE.TorusGeometry(0.42 * scale, 0.014 * scale, 12, 32);
      allGeos.push(ringGeo);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x85b8eb, transparent: true, opacity: 0.5 });
      allMats.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      nodeGroup.add(ring);

      return {
        group: nodeGroup,
        shell,
        core,
        ring,
      };
    };

    // Node 1: Primary Central Supervisor Dispatcher (Elevated Foreground Tier)
    const supervisor = createAgentNode(blueCoreMat, 1.25);
    const s1Pos = new THREE.Vector3(0, 0.85, 0.35);
    supervisor.group.position.copy(s1Pos);
    constellationGroup.add(supervisor.group);

    // Supervisor Orbital Radar Telemetry Ring
    const radarGeo = new THREE.TorusGeometry(0.70, 0.010, 16, 64);
    allGeos.push(radarGeo);
    radarGeo.rotateX(Math.PI / 2.2);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x35e85b,
      transparent: true,
      opacity: 0.35,
    });
    allMats.push(radarMat);
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    supervisor.group.add(radarMesh);

    // Node 2: Specialist Agent 1 — Synthesis & Reasoning (Midground Left)
    const agentSynthesis = createAgentNode(blueCoreMat, 0.95);
    const a1Pos = new THREE.Vector3(-1.38, -0.62, 0.12);
    agentSynthesis.group.position.copy(a1Pos);
    constellationGroup.add(agentSynthesis.group);

    // Node 3: Specialist Agent 2 — Verification & Proof (Midground Right)
    const agentVerify = createAgentNode(greenCoreMat, 0.95);
    const a2Pos = new THREE.Vector3(1.38, -0.62, 0.12);
    agentVerify.group.position.copy(a2Pos);
    constellationGroup.add(agentVerify.group);

    // Node 4: Specialist Agent 3 — Edge Distribution (Deep Background Tier)
    const agentEdge = createAgentNode(greenCoreMat, 0.85);
    const a3Pos = new THREE.Vector3(0, -1.12, -0.42);
    agentEdge.group.position.copy(a3Pos);
    constellationGroup.add(agentEdge.group);

    // 5. 3D Spline Conduits with Mechanical Anchor Collars
    const addCollar = (pos: THREE.Vector3) => {
      const cGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16);
      allGeos.push(cGeo);
      const cMesh = new THREE.Mesh(cGeo, collarMat);
      cMesh.position.copy(pos);
      constellationGroup.add(cMesh);
    };

    // Spline 1: Supervisor to Synthesis
    const p1Start = s1Pos.clone().add(new THREE.Vector3(-0.25, -0.22, 0));
    const p1End = a1Pos.clone().add(new THREE.Vector3(0.22, 0.22, 0));
    addCollar(p1Start);
    addCollar(p1End);

    const curve1 = new THREE.CatmullRomCurve3([
      p1Start,
      new THREE.Vector3(-0.65, 0.12, 0.22),
      p1End,
    ]);
    const tube1Geo = new THREE.TubeGeometry(curve1, 32, 0.018, 12, false);
    allGeos.push(tube1Geo);
    const tube1Mesh = new THREE.Mesh(tube1Geo, conduitMat);
    constellationGroup.add(tube1Mesh);

    // Spline 2: Supervisor to Verification
    const p2Start = s1Pos.clone().add(new THREE.Vector3(0.25, -0.22, 0));
    const p2End = a2Pos.clone().add(new THREE.Vector3(-0.22, 0.22, 0));
    addCollar(p2Start);
    addCollar(p2End);

    const curve2 = new THREE.CatmullRomCurve3([
      p2Start,
      new THREE.Vector3(0.65, 0.12, 0.22),
      p2End,
    ]);
    const tube2Geo = new THREE.TubeGeometry(curve2, 32, 0.018, 12, false);
    allGeos.push(tube2Geo);
    const tube2Mesh = new THREE.Mesh(tube2Geo, conduitMat);
    constellationGroup.add(tube2Mesh);

    // Spline 3: Supervisor to Edge
    const p3Start = s1Pos.clone().add(new THREE.Vector3(0, -0.28, -0.05));
    const p3End = a3Pos.clone().add(new THREE.Vector3(0, 0.25, 0.05));
    addCollar(p3Start);
    addCollar(p3End);

    const curve3 = new THREE.CatmullRomCurve3([
      p3Start,
      new THREE.Vector3(0, -0.15, -0.10),
      p3End,
    ]);
    const tube3Geo = new THREE.TubeGeometry(curve3, 32, 0.018, 12, false);
    allGeos.push(tube3Geo);
    const tube3Mesh = new THREE.Mesh(tube3Geo, conduitMat);
    constellationGroup.add(tube3Mesh);

    // 6. Traveling Data Pulses (Autonomous Token Packets)
    const pulseGeo = new THREE.SphereGeometry(0.040, 16, 16);
    allGeos.push(pulseGeo);

    const pulseGreenMat = new THREE.MeshBasicMaterial({ color: 0x35e85b });
    const pulseWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseBlueMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    allMats.push(pulseGreenMat, pulseWhiteMat, pulseBlueMat);

    const pulse1A = new THREE.Mesh(pulseGeo, pulseBlueMat);
    const pulse1B = new THREE.Mesh(pulseGeo, pulseWhiteMat);
    const pulse2A = new THREE.Mesh(pulseGeo, pulseGreenMat);
    const pulse2B = new THREE.Mesh(pulseGeo, pulseWhiteMat);
    const pulse3A = new THREE.Mesh(pulseGeo, pulseGreenMat);
    const pulse3B = new THREE.Mesh(pulseGeo, pulseBlueMat);

    constellationGroup.add(pulse1A, pulse1B, pulse2A, pulse2B, pulse3A, pulse3B);

    // 7. Studio Lighting Rig: Restrained Palette, Eliminating Garish AI Color Cast
    const ambientLight = new THREE.AmbientLight(0x0a1018, 1.0);
    scene.add(ambientLight);

    // Soft cool key light
    const coolKeyLight = new THREE.DirectionalLight(0xa5c4e8, 2.2);
    coolKeyLight.position.set(3.2, 4.0, 3.2);
    scene.add(coolKeyLight);

    // Crisp white top spotlight
    const topSpot = new THREE.DirectionalLight(0xffffff, 1.4);
    topSpot.position.set(0, 4.2, 0);
    scene.add(topSpot);

    // Subtle Hash neon green rim highlight
    const neonRim = new THREE.DirectionalLight(0x35e85b, 1.2);
    neonRim.position.set(-3.5, -2.0, 2.2);
    scene.add(neonRim);

    // 8. Interactive Pointer Parallax Tracking (Desktop Only)
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

    // 9. High-Efficiency Animation Loop with Zero Per-Frame Allocations
    let clock = 0;
    let isRunning = false;

    // Preallocated points for pulse trajectory calculation (Zero GC pressure)
    const pt1 = new THREE.Vector3();
    const pt1b = new THREE.Vector3();
    const pt2 = new THREE.Vector3();
    const pt2b = new THREE.Vector3();
    const pt3 = new THREE.Vector3();
    const pt3b = new THREE.Vector3();

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

        clock += 0.011;

        // Controlled Constellation Parallax & Yaw
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        constellationGroup.rotation.y = Math.sin(clock * 0.35) * 0.09 + currentRotY;
        constellationGroup.rotation.x = Math.cos(clock * 0.42) * 0.06 + currentRotX;
        constellationGroup.position.y = Math.sin(clock * 0.8) * 0.03;

        // Decoupled Harmonic Node Breathing & Telemetry Rotation
        supervisor.group.rotation.y = clock * 0.45;
        supervisor.core.rotation.y = -clock * 0.6;
        radarMesh.rotation.z = clock * 1.2;

        agentSynthesis.group.rotation.y = -clock * 0.38;
        agentSynthesis.group.position.y = a1Pos.y + Math.sin(clock * 1.1) * 0.025;

        agentVerify.group.rotation.y = clock * 0.38;
        agentVerify.group.position.y = a2Pos.y + Math.cos(clock * 1.0) * 0.025;

        agentEdge.group.rotation.y = -clock * 0.3;
        agentEdge.group.position.y = a3Pos.y + Math.sin(clock * 1.3 + 1.0) * 0.02;

        // Traveling Data Pulses along Spline Conduits using preallocated vectors
        const t1 = (clock * 0.45) % 1;
        const t1b = (clock * 0.45 + 0.5) % 1;
        curve1.getPointAt(t1, pt1);
        curve1.getPointAt(t1b, pt1b);
        pulse1A.position.copy(pt1);
        pulse1B.position.copy(pt1b);

        const t2 = (clock * 0.52) % 1;
        const t2b = (clock * 0.52 + 0.5) % 1;
        curve2.getPointAt(t2, pt2);
        curve2.getPointAt(t2b, pt2b);
        pulse2A.position.copy(pt2);
        pulse2B.position.copy(pt2b);

        const t3 = (clock * 0.38) % 1;
        const t3b = (clock * 0.38 + 0.5) % 1;
        curve3.getPointAt(t3, pt3);
        curve3.getPointAt(t3b, pt3b);
        pulse3A.position.copy(pt3);
        pulse3B.position.copy(pt3b);

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

    // 10. Comprehensive Teardown & Resource Disposal
    return () => {
      isDisposed = true;
      stopAnimation();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (!isTouch) {
        container.removeEventListener('mousemove', handlePointerMove);
      }

      // Dispose all accumulated geometries and materials
      allGeos.forEach((g) => g.dispose());
      allMats.forEach((m) => m.dispose());

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
      aria-label="Interactive 3D Multi-Agent DAG Constellation Architecture"
    />
  );
}
