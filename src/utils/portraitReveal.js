function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
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
