import * as THREE from "three";
import { makeDotTexture, makeGlowTexture, makeLabelTexture } from "./textures";

const INK_ON_PAPER = new THREE.Color("#14161A");
const INK_ON_DARK = new THREE.Color("#EDE7DE");
const ACCENT = new THREE.Color("#C4501E");

export interface PropelObject {
  root: THREE.Group;
  /** Theme mix: 0 = dark ink on paper, 1 = light hairlines on dark sections. */
  applyTheme(mix: number): void;
  /** Global opacity multiplier driven by the scroll chapter. */
  setIntensity(v: number): void;
  /** Continuous drift + halo breathing. */
  tick(dt: number, elapsed: number): void;
  dispose(): void;
}

function circlePoints(radius: number, count: number, step = 1): Float32Array {
  const positions: number[] = [];
  let drawn = 0;
  for (let i = 0; i < count; i += step) {
    const a = (i / count) * Math.PI * 2;
    positions.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    drawn++;
  }
  return new Float32Array(positions);
}

export function buildPropelObject(quality: "high" | "low"): PropelObject {
  const root = new THREE.Group();
  const tilt = new THREE.Group();
  const orbit = new THREE.Group();

  tilt.rotation.set(-0.38, 0, -0.06);
  root.add(tilt);
  tilt.add(orbit);

  const disposables: Array<{ dispose(): void }> = [];
  type InkedMaterial = THREE.Material & { color: THREE.Color; opacity: number };
  const inkMaterials: InkedMaterial[] = [];
  /** Speckle that turns to visual noise when the stage is faint. */
  const detailMaterials = new Set<InkedMaterial>();

  const ring = (inner: number, outer: number, opacity: number, segments = 180) => {
    const geo = new THREE.RingGeometry(inner, outer, segments, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: INK_ON_PAPER.clone(),
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    disposables.push(geo, mat);
    inkMaterials.push(mat);
    orbit.add(mesh);
    return mesh;
  };

  ring(1.5, 1.5065, 0.24);
  ring(2.14, 2.148, 0.14, 220);
  ring(0.92, 0.924, 0.12, 140);

  // dotted companion ring
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.BufferAttribute(circlePoints(1.82, 180, 4), 3));
  const dotMat = new THREE.PointsMaterial({
    color: INK_ON_PAPER.clone(),
    size: 0.032,
    map: makeDotTexture(),
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    sizeAttenuation: true,
  });
  disposables.push(dotGeo, dotMat);
  inkMaterials.push(dotMat as unknown as InkedMaterial);
  detailMaterials.add(dotMat as unknown as InkedMaterial);
  orbit.add(new THREE.Points(dotGeo, dotMat));

  // diagram labels, carried over from the original SVG so the object still
  // says what it means: prospect → engage → opportunity
  const labels: Array<[string, number]> = [
    ["PROSPECT", 1.3],
    ["ENGAGE", 0.15],
    ["OPPORTUNITY", 3.95],
  ];
  for (const [text, angle] of labels) {
    const { texture, aspect } = makeLabelTexture(text);
    const mat = new THREE.SpriteMaterial({
      map: texture,
      color: INK_ON_PAPER.clone(),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    // the label canvas is 1.7× the type size, so compensate to keep the text
    // at a consistent world height
    const labelHeight = 0.08 * 1.7;
    sprite.scale.set(labelHeight * aspect, labelHeight, 1);
    sprite.position.set(Math.cos(angle) * 2.46, Math.sin(angle) * 2.46, 0.01);
    orbit.add(sprite);

    disposables.push(mat);
    inkMaterials.push(mat as unknown as InkedMaterial);
    detailMaterials.add(mat as unknown as InkedMaterial);
    disposables.push({ dispose: () => texture.dispose() });
  }

  // spokes from the inner ring to the outer ring
  const spokeAngles = [0.15, 1.3, 2.42, 3.55, 4.62, 5.55];
  const spokePositions: number[] = [];
  const nodePositions: number[] = [];
  for (const a of spokeAngles) {
    spokePositions.push(
      Math.cos(a) * 0.92, Math.sin(a) * 0.92, 0,
      Math.cos(a) * 2.14, Math.sin(a) * 2.14, 0,
    );
    nodePositions.push(Math.cos(a) * 2.14, Math.sin(a) * 2.14, 0);
  }
  const spokeGeo = new THREE.BufferGeometry();
  spokeGeo.setAttribute("position", new THREE.Float32BufferAttribute(spokePositions, 3));
  const spokeMat = new THREE.LineBasicMaterial({
    color: INK_ON_PAPER.clone(),
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  disposables.push(spokeGeo, spokeMat);
  inkMaterials.push(spokeMat as unknown as InkedMaterial);
  orbit.add(new THREE.LineSegments(spokeGeo, spokeMat));

  const nodeGeo = new THREE.SphereGeometry(0.028, 12, 12);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: INK_ON_PAPER.clone(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  disposables.push(nodeGeo, nodeMat);
  inkMaterials.push(nodeMat);
  const nodes = new THREE.Group();
  for (let i = 0; i < nodePositions.length; i += 3) {
    const n = new THREE.Mesh(nodeGeo, nodeMat);
    n.position.set(nodePositions[i], nodePositions[i + 1], nodePositions[i + 2]);
    nodes.add(n);
  }
  orbit.add(nodes);

  // depth cloud
  const particleCount = quality === "high" ? 320 : 140;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.15 + Math.random() * 2.5;
    particlePositions[i * 3] = Math.cos(a) * r;
    particlePositions[i * 3 + 1] = Math.sin(a) * r * 0.72;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.9;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: INK_ON_PAPER.clone(),
    size: 0.024,
    map: makeDotTexture(),
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    sizeAttenuation: true,
  });
  disposables.push(particleGeo, particleMat);
  inkMaterials.push(particleMat as unknown as InkedMaterial);
  detailMaterials.add(particleMat as unknown as InkedMaterial);
  const particles = new THREE.Points(particleGeo, particleMat);
  orbit.add(particles);

  // nucleus
  const coreGeo = new THREE.SphereGeometry(0.105, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: ACCENT.clone(),
    transparent: true,
    depthWrite: false,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.renderOrder = 2;
  root.add(core);

  const glowMat = new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    color: ACCENT.clone(),
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(1.32);
  root.add(glow);

  const haloGeo = new THREE.RingGeometry(0.2, 0.2035, 96);
  const haloMat = new THREE.MeshBasicMaterial({
    color: ACCENT.clone(),
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  root.add(halo);

  // capture base opacities once, before any theme is applied
  const baseOpacity = new Map<THREE.Material & { opacity: number }, number>();
  for (const mat of inkMaterials) baseOpacity.set(mat, mat.opacity);
  let themeMix = 0;
  let intensity = 1;

  const refreshInk = () => {
    for (const mat of inkMaterials) {
      mat.color.copy(INK_ON_PAPER).lerp(INK_ON_DARK, themeMix);
      // light hairlines need more weight on ink than dark ones do on paper
      const theme = 1 + themeMix * 0.45;
      const presence = detailMaterials.has(mat) ? intensity * intensity : intensity;
      mat.opacity = (baseOpacity.get(mat) ?? mat.opacity) * theme * presence;
    }
  };

  return {
    root,
    applyTheme(mix: number) {
      themeMix = THREE.MathUtils.clamp(mix, 0, 1);
      refreshInk();
      haloMat.color.copy(ACCENT);
    },
    setIntensity(v: number) {
      intensity = THREE.MathUtils.clamp(v, 0, 1);
      refreshInk();
    },
    tick(dt, elapsed) {
      // spin in-plane: a Y-spin would foreshorten the ring stack to a line
      orbit.rotation.z += dt * 0.12;
      orbit.rotation.y = Math.sin(elapsed * 0.18) * 0.06;
      tilt.rotation.z = -0.06 + Math.sin(elapsed * 0.17) * 0.03;
      // The nucleus is dense and orange: at low intensity it would read as a
      // stray dot while the hairlines vanish. Gate it so faint chapters stay
      // pure line work.
      const nucleus = THREE.MathUtils.smoothstep(intensity, 0.45, 0.8);
      const breath = 1 + Math.sin(elapsed * 1.35) * 0.05;
      glow.scale.setScalar(1.32 * breath);
      glowMat.opacity = (0.4 + Math.sin(elapsed * 1.35) * 0.05) * (1 - themeMix * 0.15) * nucleus;
      halo.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.08);
      haloMat.opacity = (0.32 + Math.sin(elapsed * 0.9) * 0.06) * (1 - themeMix * 0.2) * nucleus;
      coreMat.opacity = nucleus;
    },
    dispose() {
      for (const d of disposables) d.dispose();
      glowMat.map?.dispose();
      particleMat.map?.dispose();
    },
  };
}
