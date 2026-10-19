function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}

const PIXEL_PALETTE = [
  [[8, 22, 36], [26, 18, 54], [8, 42, 46]],
  [[20, 83, 91], [51, 52, 116], [119, 41, 66]],
  [[40, 151, 139], [55, 112, 181], [207, 77, 88]],
  [[151, 207, 115], [240, 153, 82], [101, 191, 210]],
  [[245, 230, 150], [255, 184, 137], [190, 237, 224]],
];

function pixelHash(x, y) {
  return Math.abs((x * 17) + (y * 31));
}

export function stylizePixel(red, green, blue, x, y, phase = 0) {
  const luminance = (red * 0.2126) + (green * 0.7152) + (blue * 0.0722);
  const shade = Math.min(PIXEL_PALETTE.length - 1, Math.floor(luminance / 52));
  const hash = pixelHash(x, y);
  const shimmer = hash % 4 === 0 ? phase : 0;
  const variant = (hash + shimmer) % PIXEL_PALETTE[shade].length;

  return PIXEL_PALETTE[shade][variant];
}

export function getPixelOpacity(x, y, gridSize, progress) {
  const revealProgress = clampUnit(progress);
  if (revealProgress === 0) return 1;
  if (revealProgress === 1) return 0;

  const diagonal = (x + y) / (2 * Math.max(1, gridSize - 1));
  const jitter = ((pixelHash(x, y) % 19) / 18 - 0.5) * 0.16;
  const threshold = clampUnit(0.08 + (diagonal * 0.84) + jitter);
  const edge = clampUnit((revealProgress - threshold + 0.08) / 0.16);
  const easedEdge = edge * edge * (3 - (2 * edge));

  return 1 - easedEdge;
}

export function getCoverCrop(sourceWidth, sourceHeight, targetWidth, targetHeight, focusX = 0.5, focusY = 0.5) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const sw = sourceHeight * targetRatio;
    return {
      sx: (sourceWidth - sw) * clampUnit(focusX),
      sy: 0,
      sw,
      sh: sourceHeight,
    };
  }

  const sh = sourceWidth / targetRatio;
  return {
    sx: 0,
    sy: (sourceHeight - sh) * clampUnit(focusY),
    sw: sourceWidth,
    sh,
  };
}
