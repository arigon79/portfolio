const SUPPORTED_GRAPHICS = new Set(['monocular3d', 'gaze']);

export function normalizeResearchGraphic(type) {
  return SUPPORTED_GRAPHICS.has(type) ? type : 'fallback';
}
