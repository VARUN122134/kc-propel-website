import * as THREE from "three";

/** Soft round dot used for the particle field. */
export function makeDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Radial falloff used for the nucleus halo. Normal blending so it reads on paper. */
export function makeGlowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(196,80,30,0.34)");
  g.addColorStop(0.3, "rgba(196,80,30,0.14)");
  g.addColorStop(0.65, "rgba(196,80,30,0.04)");
  g.addColorStop(1, "rgba(196,80,30,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Diagram labels (PROSPECT / ENGAGE / OPPORTUNITY) drawn white so the sprite
 * material can tint them with the section's ink colour. Returns the texture
 * plus its aspect ratio so the sprite keeps the type undistorted.
 */
export function makeLabelTexture(text: string): { texture: THREE.Texture; aspect: number } {
  const dpr = 2;
  const fontSize = 12 * dpr;
  const font = `600 ${fontSize}px Inter, "Segoe UI", system-ui, sans-serif`;
  const tracking = 0.16 * fontSize;

  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = font;
  let textWidth = 0;
  for (const char of text) textWidth += measure.measureText(char).width + tracking;

  const padX = 4 * dpr;
  const width = Math.ceil(textWidth + padX * 2);
  const height = Math.ceil(fontSize * 1.7);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  let x = padX;
  for (const char of text) {
    ctx.fillText(char, x, height / 2);
    x += ctx.measureText(char).width + tracking;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return { texture, aspect: width / height };
}
