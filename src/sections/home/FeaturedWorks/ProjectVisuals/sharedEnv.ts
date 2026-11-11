import * as THREE from 'three';

export interface StudioEnvOptions {
  zenithIntensity?: number;
  equatorIntensity?: number;
  horizonColor?: [number, number, number];
  baseColor?: [number, number, number];
}

/**
 * Creates a procedural high-dynamic-range equirectangular studio environment map.
 * This guarantees studio-quality PBR reflections without external asset requests.
 */
export function createStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  options: StudioEnvOptions = {}
): { texture: THREE.Texture; dispose: () => void } {
  const {
    zenithIntensity = 12.0,
    equatorIntensity = 16.0,
    horizonColor = [18.0, 18.0, 20.0],
    baseColor = [0.003, 0.003, 0.004],
  } = options;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envW = 512;
  const envH = 256;
  const envData = new Float32Array(envW * envH * 4);

  // 1. Studio base obsidian void
  for (let i = 0; i < envW * envH; i++) {
    const idx = i * 4;
    envData[idx] = baseColor[0];
    envData[idx + 1] = baseColor[1];
    envData[idx + 2] = baseColor[2];
    envData[idx + 3] = 1.0;
  }

  // 2. Add overhead softbox + sharp horizon gleams
  for (let y = 0; y < envH; y++) {
    for (let x = 0; x < envW; x++) {
      const idx = (y * envW + x) * 4;

      // Overhead softbox (Zenith lighting)
      if (y > 30 && y < 90) {
        const dy = 1.0 - Math.abs(y - 60) / 30;
        const softbox = dy * dy * zenithIntensity;
        envData[idx] += softbox;
        envData[idx + 1] += softbox;
        envData[idx + 2] += softbox * 1.05;
      }

      // Equator razor gleam (Horizon reflections)
      if (y >= 118 && y <= 126) {
        envData[idx] += horizonColor[0] * (equatorIntensity / 16.0);
        envData[idx + 1] += horizonColor[1] * (equatorIntensity / 16.0);
        envData[idx + 2] += horizonColor[2] * (equatorIntensity / 16.0);
      }

      // Subtle floor bounce
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

  const dispose = () => {
    renderTarget.dispose();
    hdrTexture.dispose();
    pmremGenerator.dispose();
  };

  return {
    texture: renderTarget.texture,
    dispose,
  };
}

