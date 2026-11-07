import * as THREE from 'three';

const textureCache = new Map();

/**
 * Generates high-craft procedural planetary surface textures on an offscreen HTML5 Canvas
 * so 3D planets load instantly with zero external network dependencies.
 */
export function getPlanetTexture(type, palette) {
  const cacheKey = `${type}-${palette.primary}-${palette.secondary}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base deep atmospheric gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0, palette.primary);
  baseGrad.addColorStop(0.25, palette.deep);
  baseGrad.addColorStop(0.5, palette.secondary);
  baseGrad.addColorStop(0.75, palette.deep);
  baseGrad.addColorStop(1, palette.primary);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Swirling planetary cloud bands & surface features
  for (let i = 0; i < 28; i++) {
    const y = (i / 28) * height;
    const bandHeight = 4 + (i % 5) * 4;
    ctx.globalAlpha = 0.14 + (i % 3) * 0.08;
    ctx.fillStyle = i % 2 === 0 ? palette.primary : palette.secondary;

    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= width; x += 16) {
      const wave =
        Math.sin((x / width) * Math.PI * 4 + i * 0.9) * (6 + (i % 4) * 3) +
        Math.cos((x / width) * Math.PI * 2 - i) * 4;
      ctx.lineTo(x, y + wave);
    }
    ctx.lineTo(width, y + bandHeight);
    ctx.lineTo(0, y + bandHeight);
    ctx.closePath();
    ctx.fill();
  }

  // Planet-specific surface character
  if (type === 'arcane' || type === 'singularity') {
    // Glowing runic energy fissures & storm vortices
    ctx.globalAlpha = 0.48;
    ctx.strokeStyle = palette.glow;
    ctx.lineWidth = 1.8;
    for (let k = 0; k < 14; k++) {
      const sx = ((k * 79) % width);
      const sy = 30 + ((k * 53) % (height - 60));
      ctx.beginPath();
      ctx.arc(sx, sy, 10 + (k % 4) * 7, 0, Math.PI * 1.65);
      ctx.stroke();
    }
  } else {
    // Soft luminous nebula storms & craters
    for (let k = 0; k < 22; k++) {
      const cx = ((k * 97 + 31) % width);
      const cy = 20 + ((k * 61 + 17) % (height - 40));
      const rx = 14 + (k % 5) * 8;
      const ry = 7 + (k % 3) * 4;
      const spotGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, rx);
      spotGrad.addColorStop(0, '#ffffff');
      spotGrad.addColorStop(0.4, k % 2 === 0 ? palette.primary : palette.secondary);
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}
