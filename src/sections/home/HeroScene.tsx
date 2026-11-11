import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/animations';
import { EMBLEM_SEGMENTS } from './emblemData';

export interface HeroSceneProps {
  scrollProgress?: number;
  className?: string;
  isMobileInline?: boolean;
}

/**
 * Checks if WebGL is supported by the client browser
 */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Constructs the 8 distinct sculptural aerodynamic segments
 * faithfully reproducing the custom HASH.DEVS brand emblem.
 * Uses a dual-tiered CNC-machined architecture with three surface regions:
 * 1. Main convex metallic face (domed cushion cap)
 * 2. Precision-machined outer bevel
 * 3. Narrow recessed perimeter groove
 * Generating controlled double-ridge specular highlights and authentic physical volume.
 */
function createEmblemMeshes(
  chromeFaceMaterial: THREE.Material,
  chromeSidewallMaterial: THREE.Material,
  greenFaceMaterial: THREE.Material,
  greenSidewallMaterial: THREE.Material
): THREE.Group {
  const emblemGroup = new THREE.Group();

  // Tier 1: Outer Machined Frame Chassis & Sidewalls (Solid physical depth)
  const baseExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.10,
    bevelEnabled: true,
    bevelSegments: 8,
    bevelThickness: 0.028,
    bevelSize: 0.024,
    curveSegments: 1,
  };

  // Tier 2: Domed Cushion Face (Projects forward with smooth curvature and double-ridge highlight)
  const innerExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 16,
    bevelThickness: 0.052,
    bevelSize: 0.036,
    curveSegments: 1,
  };

  EMBLEM_SEGMENTS.forEach((seg) => {
    const segGroup = new THREE.Group();
    const faceMat = seg.isGreen ? greenFaceMaterial : chromeFaceMaterial;
    const sideMat = seg.isGreen ? greenSidewallMaterial : chromeSidewallMaterial;

    // 1. Base Outer Machined Frame (Chassis sidewalls + perimeter bevel rim)
    const outerShape = new THREE.Shape();
    outerShape.moveTo(seg.outer[0][0], seg.outer[0][1]);
    for (let i = 1; i < seg.outer.length; i++) {
      outerShape.lineTo(seg.outer[i][0], seg.outer[i][1]);
    }
    outerShape.closePath();

    const baseGeo = new THREE.ExtrudeGeometry(outerShape, baseExtrudeSettings);
    baseGeo.computeVertexNormals();
    const baseMesh = new THREE.Mesh(baseGeo, sideMat);
    segGroup.add(baseMesh);

    // 2. Inner Pillowed Cushion Cap (Projects forward at z = 0.085, creating recessed stepped channel)
    const innerShape = new THREE.Shape();
    innerShape.moveTo(seg.inner[0][0], seg.inner[0][1]);
    for (let i = 1; i < seg.inner.length; i++) {
      innerShape.lineTo(seg.inner[i][0], seg.inner[i][1]);
    }
    innerShape.closePath();

    const innerGeo = new THREE.ExtrudeGeometry(innerShape, innerExtrudeSettings);
    innerGeo.computeVertexNormals();
    const innerMesh = new THREE.Mesh(innerGeo, faceMat);
    innerMesh.position.z = 0.085;
    segGroup.add(innerMesh);

    emblemGroup.add(segGroup);
  });

  return emblemGroup;
}

/**
 * Creates a high-fidelity 1024x512 procedural automotive studio HDR environment.
 * Generates true 32-bit floating-point radiance values convolved into a GGX PMREM cubemap:
 * - Large overhead softbox (Zenith Bank)
 * - Frontal reflection softboxes (+Z camera-facing)
 * - Razor-sharp horizontal equator gleam
 * - Deep negative-fill black flags (zebra reflection bands)
 * - Dual vertical strip softboxes (outer rim contours)
 * - Lower nadir floor bounce card
 * - Localized upper-right green accent reflection
 */
function createStudioEnvironmentTexture(renderer: THREE.WebGLRenderer): {
  envMap: THREE.Texture;
  dispose: () => void;
} {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const w = 1024;
  const h = 512;
  const data = new Float32Array(w * h * 4);

  // 1. Studio Obsidian Void Base (pure dark negative fill)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = 0.0015;
    data[i * 4 + 1] = 0.002;
    data[i * 4 + 2] = 0.0018;
    data[i * 4 + 3] = 1.0;
  }

  // Softbox generator with smooth cosine falloff & spherical wrapping
  const addSoftbox = (
    cx: number,
    cy: number,
    bw: number,
    bh: number,
    peakRadiance: number,
    color: [number, number, number] = [1, 1, 1],
    power: number = 2.0
  ) => {
    const hw = bw / 2;
    const hh = bh / 2;
    const minY = Math.max(0, Math.floor(cy - hh));
    const maxY = Math.min(h - 1, Math.ceil(cy + hh));
    const minX = Math.floor(cx - hw);
    const maxX = Math.ceil(cx + hw);

    for (let y = minY; y <= maxY; y++) {
      const dy = Math.abs(y - cy) / hh;
      if (dy >= 1.0) continue;
      const fy = Math.pow(Math.cos(dy * Math.PI * 0.5), power);

      for (let x = minX; x <= maxX; x++) {
        const dx = Math.abs(x - cx) / hw;
        if (dx >= 1.0) continue;
        const fx = Math.pow(Math.cos(dx * Math.PI * 0.5), power);

        const wrappedX = ((x % w) + w) % w;
        const idx = (y * w + wrappedX) * 4;
        const val = peakRadiance * fx * fy;
        data[idx] += color[0] * val;
        data[idx + 1] += color[1] * val;
        data[idx + 2] += color[2] * val;
      }
    }
  };

  // Negative-fill black flag attenuation
  const applyNegativeFill = (minY: number, maxY: number, factor: number) => {
    for (let y = Math.max(0, minY); y <= Math.min(h - 1, maxY); y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        data[idx] *= factor;
        data[idx + 1] *= factor;
        data[idx + 2] *= factor;
      }
    }
  };

  // Razor horizontal equator gleam
  const addHorizonGleam = (cy: number, thickness: number, peakRadiance: number) => {
    const halfT = thickness / 2;
    for (let y = Math.max(0, Math.floor(cy - halfT)); y <= Math.min(h - 1, Math.ceil(cy + halfT)); y++) {
      const dy = Math.abs(y - cy) / halfT;
      if (dy >= 1.0) continue;
      const fy = 1.0 - dy * dy;
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        data[idx] += peakRadiance * fy;
        data[idx + 1] += peakRadiance * fy;
        data[idx + 2] += peakRadiance * fy;
      }
    }
  };

  // --- A. Overhead Softbox (Zenith Bank - crests upper chrome contours) ---
  addSoftbox(w / 2, 60, 750, 110, 18.0, [1.0, 1.0, 1.0], 1.8);

  // --- B. Frontal Softboxes (centered at seams x = 0 / w for camera-facing +Z normals) ---
  // 1. Upper frontal softbox: broad silver highlights across upper chrome horizontal bars
  addSoftbox(0, 180, 440, 130, 22.0, [1.0, 1.0, 1.0], 1.8);
  addSoftbox(w, 180, 440, 130, 22.0, [1.0, 1.0, 1.0], 1.8);

  // 2. Mid-Lower frontal softbox: brilliant reflection across lower horizontal bar and sweeping leg
  addSoftbox(0, 310, 460, 140, 22.0, [1.0, 1.0, 1.0], 1.7);
  addSoftbox(w, 310, 460, 140, 22.0, [1.0, 1.0, 1.0], 1.7);

  // 3. Nadir frontal softbox: illuminates bottom stylized fin and lower-facing contours
  addSoftbox(0, 420, 400, 90, 16.0, [0.95, 0.98, 1.0], 1.8);
  addSoftbox(w, 420, 400, 90, 16.0, [0.95, 0.98, 1.0], 1.8);

  // --- C. Negative-Fill Panels (Deep Black Zebra Bands) ---
  applyNegativeFill(236, 268, 0.03);

  // --- D. Razor Horizon Gleam Strips ---
  addHorizonGleam(250, 5, 26.0);
  addHorizonGleam(365, 4, 18.0);

  // --- E. Vertical Strip Softboxes (Elongated highlights along curved outer boundaries) ---
  addSoftbox(220, 250, 70, 360, 18.0, [0.96, 0.98, 1.0], 2.2);
  addSoftbox(820, 250, 70, 360, 18.0, [0.96, 0.98, 1.0], 2.2);

  // --- F. Lower Floor Bounce Card ---
  addSoftbox(w / 2, 480, 700, 60, 2.5, [0.85, 0.92, 0.88], 1.5);

  // --- G. Controlled Localized Green Reflection (upper-right quadrant only) ---
  addSoftbox(880, 140, 160, 130, 6.0, [0.0, 1.0, 0.22], 1.8);

  const hdrTexture = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
  hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
  hdrTexture.needsUpdate = true;

  const renderTarget = pmremGenerator.fromEquirectangular(hdrTexture);
  const envMap = renderTarget.texture;

  return {
    envMap,
    dispose: () => {
      renderTarget.dispose();
      hdrTexture.dispose();
      pmremGenerator.dispose();
    },
  };
}

export function HeroScene({ scrollProgress = 0, className, isMobileInline = false }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // References for render loop and scroll interpolation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const emblemGroupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(scrollProgress);

  // Keep scrollRef in sync
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    if (prefersReducedMotion()) {
      setReducedMotion(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene & Camera Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || (isMobileInline ? 360 : window.innerWidth);
    const height = container.clientHeight || (isMobileInline ? 300 : window.innerHeight);
    const isMobile = isMobileInline || width < 768;
    const isTablet = !isMobileInline && width >= 768 && width < 1024;

    const camera = new THREE.PerspectiveCamera(
      isMobileInline ? 42 : (isMobile ? 48 : 40),
      width / height,
      0.1,
      100
    );
    camera.position.set(0, 0, isMobileInline ? 7.5 : (isMobile ? 8.6 : 7.8));

    // --- 2. Renderer with High Dynamic Range & Physical Tone Mapping ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05; // Calibrated exposure preserving deep green saturation & chrome highlights
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // --- 3. Studio Environment Map (Custom Automotive Studio HDR PMREM) ---
    const envResource = createStudioEnvironmentTexture(renderer);
    scene.environment = envResource.envMap;

    // --- 4. Luxury Cinematic Studio Lighting Rig ---
    // Deep obsidian ambient floor
    const ambientLight = new THREE.AmbientLight(0x030403, 0.35);
    scene.add(ambientLight);

    // Main Key Light: Crisp cool-white directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3.2, 4.2, 4.8);
    scene.add(keyLight);

    // Frontal Fill: Neutral soft fill for dark metallic areas
    const frontLight = new THREE.DirectionalLight(0xedf2ee, 0.9);
    frontLight.position.set(0.0, 0.2, 5.0);
    scene.add(frontLight);

    // Secondary Light: Left vertical strip fill along curved outer boundaries
    const fillLight = new THREE.DirectionalLight(0xd5ddd7, 1.1);
    fillLight.position.set(-4.5, 0.5, 3.5);
    scene.add(fillLight);

    // Localized Neon Green Rim Point Light (Strictly behind the green segment)
    const neonRimLight = new THREE.PointLight(0x00f508, 0.6, 2.5);
    neonRimLight.position.set(1.5, 1.2, 0.9);
    scene.add(neonRimLight);

    // Overhead Rim Top Light (Rim lighting for upper silhouettes)
    const topLight = new THREE.DirectionalLight(0x28322a, 0.7);
    topLight.position.set(0, 5.5, 1.5);
    scene.add(topLight);

    // Lower Front Key Light (Highlights lower horizontal bar and sweeping leg)
    const lowerKeyLight = new THREE.DirectionalLight(0xf0f5f2, 1.2);
    lowerKeyLight.position.set(2.0, -3.0, 4.5);
    scene.add(lowerKeyLight);

    // --- 5. Automotive PBR Materials Setup ---
    // A. Main Mirror Chrome Face Material (Mirror-polished automotive liquid silver)
    const chromeFaceMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf4f6f5),
      metalness: 1.0,
      roughness: 0.038,
      clearcoat: 1.0,
      clearcoatRoughness: 0.018,
      reflectivity: 1.0,
      envMapIntensity: 2.2,
      toneMapped: true,
    });

    // B. Dark Machined Chrome Sidewall Material (Deep gunmetal alloy chassis & recessed grooves)
    const chromeSidewallMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x28302c),
      metalness: 0.98,
      roughness: 0.13,
      clearcoat: 0.6,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      envMapIntensity: 1.5,
      toneMapped: true,
    });

    // C. Signature Hash Neon Green Metallic Lacquer Face Material
    // Deep electric-green automotive lacquer (#00F508), glossy clearcoat, crisp white reflection streak
    const greenFaceMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00F508'),
      metalness: 0.05,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.025,
      reflectivity: 1.0,
      envMapIntensity: 0.45,
      toneMapped: false,
    });

    // D. Green Sidewall Material (Deep emerald shading in recessed regions)
    const greenSidewallMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#006818'),
      metalness: 0.05,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
      reflectivity: 0.8,
      envMapIntensity: 0.4,
      toneMapped: false,
    });

    // --- 6. Emblem Geometry Assembly ---
    const emblemGroup = createEmblemMeshes(
      chromeFaceMaterial,
      chromeSidewallMaterial,
      greenFaceMaterial,
      greenSidewallMaterial
    );
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // Proportional positioning across viewports:
    // Mobile Inline: perfectly centered inside dedicated responsive stage
    // Desktop: positioned cleanly to the right of hero text with zero overlap
    // Tablet: positioned centered slightly lower
    if (isMobileInline) {
      emblemGroup.position.set(0.0, 0.0, 0.0);
      emblemGroup.scale.set(0.72, 0.72, 0.72);
    } else if (isMobile) {
      emblemGroup.position.set(0.0, -0.95, -1.8);
      emblemGroup.scale.set(0.55, 0.55, 0.55);
    } else if (isTablet) {
      emblemGroup.position.set(0.0, -0.6, -1.0);
      emblemGroup.scale.set(0.65, 0.65, 0.65);
    } else {
      emblemGroup.position.set(2.2, 0.0, 0);
      emblemGroup.scale.set(0.86, 0.86, 0.86);
    }

    // --- 7. Pointer & Touch Movement Listeners ---
    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length || !container) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const normX = ((touch.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const normY = -(((touch.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // --- 8. Window Resize Handler ---
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth || (isMobileInline ? 360 : window.innerWidth);
      const newHeight = container.clientHeight || (isMobileInline ? 300 : window.innerHeight);
      if (newWidth <= 0 || newHeight <= 0) return;

      const mobileNow = isMobileInline || newWidth < 768;
      const tabletNow = !isMobileInline && newWidth >= 768 && newWidth < 1024;

      camera.aspect = newWidth / newHeight;
      camera.fov = isMobileInline ? 42 : (mobileNow ? 48 : 40);
      camera.position.z = isMobileInline ? 7.5 : (mobileNow ? 8.6 : 7.8);
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobileNow ? 1.5 : 2));

      if (emblemGroupRef.current) {
        if (isMobileInline) {
          emblemGroupRef.current.position.set(0.0, 0.0, 0.0);
          emblemGroupRef.current.scale.set(0.72, 0.72, 0.72);
        } else if (mobileNow) {
          emblemGroupRef.current.position.set(0.0, -0.95, -1.8);
          emblemGroupRef.current.scale.set(0.55, 0.55, 0.55);
        } else if (tabletNow) {
          emblemGroupRef.current.position.set(0.0, -0.6, -1.0);
          emblemGroupRef.current.scale.set(0.65, 0.65, 0.65);
        } else {
          emblemGroupRef.current.position.set(2.2, 0.0, 0);
          emblemGroupRef.current.scale.set(0.86, 0.86, 0.86);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Context loss handler
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // Tab visibility & Intersection Observer for performance optimization
    let isVisible = true;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.length) return;
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    // --- 9. Animation & Render Loop (Heavy Metal Physics) ---
    let animationFrameId: number;
    const startTime = performance.now() * 0.001;

    // Specific automotive idle physics parameters
    const floatAmplitude = isMobileInline ? 0.018 : 0.025;
    const floatSpeed = 0.35;
    const rotationAmplitude = 0.008;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !isTabVisible) return;

      const elapsedTime = performance.now() * 0.001 - startTime;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current; // 0 (hero pinnacle) to 1 (scrolled past hero)

      // Smooth pointer interpolation (gentle damping lerp: 0.035)
      mouse.x += (mouse.targetX - mouse.x) * 0.035;
      mouse.y += (mouse.targetY - mouse.y) * 0.035;

      if (emblemGroup) {
        // Heavy, manufactured metal sculpture floating in a dark studio
        // Subtle vertical floating + minimal rotational breathing
        const floatY = Math.sin(elapsedTime * floatSpeed) * floatAmplitude;
        const floatRot = Math.cos(elapsedTime * floatSpeed * 0.8) * rotationAmplitude;

        // Base continuous subtle rotation + pointer parallax
        const baseRotY = Math.sin(elapsedTime * 0.18) * 0.02;
        const baseRotX = 0.03 + Math.cos(elapsedTime * 0.14) * 0.012;
        const pointerRotY = mouse.x * (isMobileInline ? 0.14 : 0.08);
        const pointerRotX = -mouse.y * (isMobileInline ? 0.10 : 0.055);

        // Scroll-linked transition: rotates on Y/X, recedes into depth and rises
        const scrollRotY = isMobileInline ? scroll * 0.2 : scroll * Math.PI * 0.45;
        const scrollRotX = scroll * 0.35;
        const scrollY = isMobileInline ? 0 : scroll * 2.2;
        const scrollZ = isMobileInline ? 0 : -scroll * 3.5;
        const scrollScale = Math.max(0.4, 1 - scroll * 0.5);

        emblemGroup.rotation.y = baseRotY + pointerRotY + scrollRotY + floatRot;
        emblemGroup.rotation.x = baseRotX + pointerRotX + scrollRotX;
        emblemGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.008 - scroll * 0.2;

        // Combine base position with pointer parallax & scroll offset
        const mobileActive = isMobileInline || (container.clientWidth || window.innerWidth) < 768;
        const tabletActive = !isMobileInline && (container.clientWidth || window.innerWidth) >= 768 && (container.clientWidth || window.innerWidth) < 1024;
        
        let baseOffsetX = 2.2;
        let baseOffsetY = 0.0;
        let baseOffsetZ = 0.0;
        let baseScale = 0.86;

        if (isMobileInline) {
          baseOffsetX = 0.0;
          baseOffsetY = 0.0;
          baseOffsetZ = 0.0;
          baseScale = 0.72;
        } else if (mobileActive) {
          baseOffsetX = 0.0;
          baseOffsetY = -0.95;
          baseOffsetZ = -1.8;
          baseScale = 0.55;
        } else if (tabletActive) {
          baseOffsetX = 0.0;
          baseOffsetY = -0.6;
          baseOffsetZ = -1.0;
          baseScale = 0.65;
        }

        emblemGroup.position.x = baseOffsetX + mouse.x * 0.10;
        emblemGroup.position.y = baseOffsetY + floatY + mouse.y * 0.07 + scrollY;
        emblemGroup.position.z = baseOffsetZ + scrollZ;
        emblemGroup.scale.setScalar(baseScale * scrollScale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. Clean Disposal on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      emblemGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      chromeFaceMaterial.dispose();
      chromeSidewallMaterial.dispose();
      greenFaceMaterial.dispose();
      greenSidewallMaterial.dispose();

      envResource.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Static high-end SVG fallback if WebGL is unavailable or reduced motion is requested
  // Faithfully matches the exact 8-segment sculpted silhouette with the 1 signature green blade!
  if (!hasWebGL || reducedMotion) {
    if (isMobileInline) {
      return (
        <div className={`relative w-full h-[260px] xs:h-[300px] sm:h-[340px] rounded-xl border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm flex items-center justify-center p-4 ${className || ''}`}>
          <div className="relative h-44 w-44 opacity-90">
            <svg viewBox="-2.2 -2.2 4.4 4.4" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <circle cx="1.1" cy="-0.9" r="1.2" fill="#35E85B" opacity="0.18" filter="blur(20px)" />
              <defs>
                <linearGradient id="fallbackChromeGradM" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#8A928C" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="75%" stopColor="#1E2420" />
                  <stop offset="100%" stopColor="#D2DAD4" />
                </linearGradient>
                <linearGradient id="fallbackGreenGradM" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#75FF92" />
                  <stop offset="35%" stopColor="#35E85B" />
                  <stop offset="100%" stopColor="#0E4A1C" />
                </linearGradient>
              </defs>
              {EMBLEM_SEGMENTS.map((seg) => (
                <path
                  key={seg.id}
                  d={seg.svgPath}
                  fill={seg.isGreen ? 'url(#fallbackGreenGradM)' : 'url(#fallbackChromeGradM)'}
                  stroke={seg.isGreen ? '#75FF92' : '#FFFFFF'}
                  strokeWidth={seg.isGreen ? 0.03 : 0.015}
                />
              ))}
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative flex items-center justify-center pointer-events-none ${className || ''}`}>
        <div className="relative h-72 w-72 tablet:h-[420px] tablet:w-[420px] opacity-90">
          <svg viewBox="-2.2 -2.2 4.4 4.4" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="1.1" cy="-0.9" r="1.2" fill="#35E85B" opacity="0.18" filter="blur(20px)" />
            <defs>
              <linearGradient id="fallbackChromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#8A928C" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="75%" stopColor="#1E2420" />
                <stop offset="100%" stopColor="#D2DAD4" />
              </linearGradient>
              <linearGradient id="fallbackGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#75FF92" />
                <stop offset="35%" stopColor="#35E85B" />
                <stop offset="100%" stopColor="#0E4A1C" />
              </linearGradient>
            </defs>
            {EMBLEM_SEGMENTS.map((seg) => (
              <path
                key={seg.id}
                d={seg.svgPath}
                fill={seg.isGreen ? 'url(#fallbackGreenGrad)' : 'url(#fallbackChromeGrad)'}
                stroke={seg.isGreen ? '#75FF92' : '#FFFFFF'}
                strokeWidth={seg.isGreen ? 0.03 : 0.015}
              />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  if (isMobileInline) {
    return (
      <div
        ref={mountRef}
        aria-hidden="true"
        className={`relative w-full h-[260px] xs:h-[300px] sm:h-[340px] rounded-xl border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm overflow-hidden pointer-events-auto flex items-center justify-center group ${className || ''}`}
      >
        {/* Architectural Corner Reticles */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-brand-neon/60 select-none pointer-events-none">⌜</span>
        <span className="absolute top-2 right-2 font-mono text-[10px] text-brand-neon/60 select-none pointer-events-none">⌝</span>
        <span className="absolute bottom-2 left-2 font-mono text-[10px] text-brand-neon/60 select-none pointer-events-none">⌞</span>
        <span className="absolute bottom-2 right-2 font-mono text-[10px] text-brand-neon/60 select-none pointer-events-none">⌟</span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-canvas-3d overflow-hidden ${className || ''}`}
    />
  );
}
