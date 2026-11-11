import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';

export function ExperimentalChromeScene({ className = '' }: { className?: string }) {
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

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    // 2. High Dynamic Range Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Procedural Studio Reflection Map for Automotive Chrome
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envW = 512;
    const envH = 256;
    const envData = new Float32Array(envW * envH * 4);

    // Studio base obsidian void
    for (let i = 0; i < envW * envH; i++) {
      envData[i * 4] = 0.003;
      envData[i * 4 + 1] = 0.003;
      envData[i * 4 + 2] = 0.004;
      envData[i * 4 + 3] = 1.0;
    }

    // Add zenith softbox + sharp horizon gleam
    for (let y = 0; y < envH; y++) {
      for (let x = 0; x < envW; x++) {
        const idx = (y * envW + x) * 4;
        // Overhead softbox
        if (y > 30 && y < 90) {
          const dy = 1.0 - Math.abs(y - 60) / 30;
          envData[idx] += 12.0 * dy * dy;
          envData[idx + 1] += 12.0 * dy * dy;
          envData[idx + 2] += 13.0 * dy * dy;
        }
        // Equator razor gleam
        if (y >= 118 && y <= 126) {
          envData[idx] += 18.0;
          envData[idx + 1] += 18.0;
          envData[idx + 2] += 20.0;
        }
        // Subtle lower bounce
        if (y > 200) {
          const dy = (y - 200) / 56;
          envData[idx] += 1.5 * dy;
          envData[idx + 1] += 1.8 * dy;
          envData[idx + 2] += 2.0 * dy;
        }
      }
    }

    const hdrTexture = new THREE.DataTexture(envData, envW, envH, THREE.RGBAFormat, THREE.FloatType);
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    hdrTexture.needsUpdate = true;
    const renderTarget = pmremGenerator.fromEquirectangular(hdrTexture);
    scene.environment = renderTarget.texture;

    // 4. Liquid Chrome Material
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf2f6fa),
      metalness: 1.0,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      reflectivity: 1.0,
      envMapIntensity: 2.4,
    });

    // 5. Sculptural Liquid Torus Knot Manifold
    const knotGeo = new THREE.TorusKnotGeometry(1.05, 0.30, 160, 36, 2, 3);
    const knotMesh = new THREE.Mesh(knotGeo, chromeMaterial);
    scene.add(knotMesh);

    // 6. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0c1015, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.0, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 1.4);
    rimLight.position.set(-3.5, -2.0, -2.5);
    scene.add(rimLight);

    // Pointer Parallax Tracking (Desktop Only)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = normX * 0.45;
      targetRotX = normY * 0.45;
    };

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      container.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // 7. High-Efficiency Animation Loop with Zero Idle GPU Overhead
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

        clock += 0.008;

        // Gentle continuous organic fluid rotation
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        knotMesh.rotation.x = Math.sin(clock * 0.5) * 0.25 + currentRotX;
        knotMesh.rotation.y = clock * 0.8 + currentRotY;
        knotMesh.rotation.z = Math.cos(clock * 0.3) * 0.15;

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

    // Initial kickstart if visible
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

    // 8. Complete Resource Teardown
    return () => {
      isDisposed = true;
      stopAnimation();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (!isTouch) {
        container.removeEventListener('mousemove', handlePointerMove);
      }

      knotGeo.dispose();
      chromeMaterial.dispose();
      renderTarget.dispose();
      hdrTexture.dispose();
      pmremGenerator.dispose();
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
      aria-label="Interactive 3D Liquid Chrome Sculptural Manifold"
    />
  );
}

