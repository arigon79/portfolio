export function clampReveal(value) {
  return Math.min(100, Math.max(0, value));
}

export function revealFromPointer(clientY, bounds) {
  if (!bounds.height) return 0;
  return clampReveal(((clientY - bounds.top) / bounds.height) * 100);
}

export function revealFromKey(key, current, step = 5) {
  if (key === 'ArrowDown' || key === 'ArrowRight') return clampReveal(current + step);
  if (key === 'ArrowUp' || key === 'ArrowLeft') return clampReveal(current - step);
  if (key === 'Home') return 0;
  if (key === 'End') return 100;
  return null;
}
