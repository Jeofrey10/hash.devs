import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';

export interface ServicesHero3DSceneProps {
  className?: string;
}

export function ServicesHero3DScene({ className = '' }: ServicesHero3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let isVisible = true;
    const reducedMotion = prefersReducedMotion();

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera (Exact match to AboutHero3DScene)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    // 2. High Dynamic Range WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Procedural Studio HDR Environment Map for Chrome (Identical PMREM pipeline)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envW = 512;
    const envH = 256;
    const envData = new Float32Array(envW * envH * 4);

    for (let i = 0; i < envW * envH; i++) {
      envData[i * 4] = 0.005;
      envData[i * 4 + 1] = 0.006;
      envData[i * 4 + 2] = 0.008;
      envData[i * 4 + 3] = 1.0;
    }

    // Top soft key light
    for (let y = 15; y < 90; y++) {
      for (let x = 120; x < 390; x++) {
        const idx = (y * envW + x) * 4;
        const dist = Math.hypot((x - 256) / 130, (y - 50) / 35);
        if (dist < 1.0) {
          const intensity = Math.pow(1.0 - dist, 1.8) * 4.2;
          envData[idx] += intensity * 0.95;
          envData[idx + 1] += intensity;
          envData[idx + 2] += intensity * 1.05;
        }
      }
    }

    // Neon Green architectural rim-accent in environment
    for (let y = 120; y < 190; y++) {
      for (let x = 380; x < 490; x++) {
        const idx = (y * envW + x) * 4;
        const dist = Math.hypot((x - 435) / 55, (y - 155) / 35);
        if (dist < 1.0) {
          const intensity = Math.pow(1.0 - dist, 2.0) * 3.5;
          envData[idx] += intensity * 0.21;
          envData[idx + 1] += intensity * 0.91;
          envData[idx + 2] += intensity * 0.36;
        }
      }
    }

    const dataTexture = new THREE.DataTexture(
      envData,
      envW,
      envH,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.needsUpdate = true;
    const envMap = pmremGenerator.fromEquirectangular(dataTexture).texture;
    scene.environment = envMap;
    dataTexture.dispose();
    pmremGenerator.dispose();

    // 4. Kinetic Engineered Chrome Sculpture (Exact replication of About page signature sculpture)
    const group = new THREE.Group();
    scene.add(group);

    // Primary Chrome PBR Material
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdce2de),
      metalness: 0.98,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 1.4,
    });

    // Dark Brushed Titanium Core Material
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1a211d),
      metalness: 0.88,
      roughness: 0.32,
      envMapIntensity: 0.8,
    });

    // Neon Green Accent Material
    const neonAccentMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x35e85b),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Main Object: Interlocking Torus Knot (Architectural Infinity Curve)
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.2, 0.28, 160, 32, 2, 3);
    const torusMesh = new THREE.Mesh(torusKnotGeo, chromeMaterial);
    torusMesh.castShadow = true;
    torusMesh.receiveShadow = true;
    group.add(torusMesh);

    // Outer Structure: Surrounding Precision Gyroscopic Ring
    const outerRingGeo = new THREE.TorusGeometry(2.1, 0.035, 32, 120);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, titaniumMaterial);
    group.add(outerRingMesh);

    // Inner Core: Delicate Wireframe Geodesic Core
    const innerCoreGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, neonAccentMaterial);
    group.add(innerCoreMesh);

    // Precision Floating Markers
    const markerGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x35e85b });
    const markerCount = 6;
    for (let i = 0; i < markerCount; i++) {
      const angle = (i / markerCount) * Math.PI * 2;
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
      group.add(marker);
    }

    // 5. Cinematic Directional Lighting (Exact reproduction of About studio lighting)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const neonKicker = new THREE.DirectionalLight(0x35e85b, 3.0);
    neonKicker.position.set(-4, -2, -2);
    scene.add(neonKicker);

    const ambientLight = new THREE.AmbientLight(0x101412, 1.2);
    scene.add(ambientLight);

    // 6. Smooth Pointer & Scroll Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let scrollYOffset = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = normX * 0.45;
      targetRotX = normY * 0.35;
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY * 0.0008;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. Resize Observer for Zero-Distortion Responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const entry = entries[0];
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW > 0 && newH > 0 && rendererRef.current) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 8. Intersection Observer & Tab Visibility for Performance Optimization (Pause when offscreen/hidden)
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.length) return;
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // 9. Main Animation Loop (High-precision timer without deprecated THREE.Clock)
    let lastTime = performance.now() * 0.001;
    const startTime = lastTime;

    const animate = () => {
      if (isDisposed) return;
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisible || !isTabVisible) return;

      const now = performance.now() * 0.001;
      const delta = Math.min(now - lastTime, 0.1);
      lastTime = now;
      const time = now - startTime;

      if (!reducedMotion) {
        // Natural kinetic rotation
        torusMesh.rotation.x += delta * 0.35;
        torusMesh.rotation.y += delta * 0.42;

        outerRingMesh.rotation.z += delta * 0.2;
        outerRingMesh.rotation.y = Math.sin(time * 0.4) * 0.35;

        innerCoreMesh.rotation.x -= delta * 0.25;
        innerCoreMesh.rotation.y -= delta * 0.3;

        // Smooth spring damp toward mouse position + scroll
        currentRotX += (targetRotX - currentRotX) * 0.06;
        currentRotY += (targetRotY - currentRotY) * 0.06;

        group.rotation.x = currentRotX + scrollYOffset;
        group.rotation.y = currentRotY + scrollYOffset * 0.6;

        // Floating breathing heave
        group.position.y = Math.sin(time * 0.8) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // 10. Clean Resource Disposal
    return () => {
      isDisposed = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      torusKnotGeo.dispose();
      outerRingGeo.dispose();
      innerCoreGeo.dispose();
      markerGeo.dispose();
      chromeMaterial.dispose();
      titaniumMaterial.dispose();
      neonAccentMaterial.dispose();
      markerMat.dispose();
      if (envMap) envMap.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[380px] xs:min-h-[440px] sm:min-h-[500px] laptop:min-h-[560px] flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    />
  );
}
