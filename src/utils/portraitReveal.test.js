import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCoverCrop,
  getNextTouchReveal,
  getPixelOpacity,
  shouldRevealPortrait,
  stylizePixel,
} from './portraitReveal.js';

test('getCoverCrop leaves square images uncropped', () => {
  assert.deepEqual(getCoverCrop(400, 400, 1, 1), {
    sx: 0,
    sy: 0,
    sw: 400,
    sh: 400,
  });
});

test('getCoverCrop centers a wide image', () => {
  assert.deepEqual(getCoverCrop(800, 400, 1, 1), {
    sx: 200,
    sy: 0,
    sw: 400,
    sh: 400,
  });
});

test('getCoverCrop respects the vertical focal point for tall images', () => {
  assert.deepEqual(getCoverCrop(400, 800, 1, 1, 0.5, 0.2), {
    sx: 0,
    sy: 80,
    sw: 400,
    sh: 400,
  });
});

test('stylizePixel produces a deterministic color from the portrait luminance', () => {
  const first = stylizePixel(120, 84, 62, 7, 12, 3);
  const second = stylizePixel(120, 84, 62, 7, 12, 3);

  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  first.forEach((channel) => assert.ok(channel >= 0 && channel <= 255));
});

test('stylizePixel shifts selected blocks as the animation phase changes', () => {
  assert.notDeepEqual(
    stylizePixel(148, 112, 80, 4, 8, 0),
    stylizePixel(148, 112, 80, 4, 8, 1),
  );
});

test('getPixelOpacity fully covers the portrait before reveal and clears it after', () => {
  assert.equal(getPixelOpacity(8, 11, 30, 0), 1);
  assert.equal(getPixelOpacity(8, 11, 30, 1), 0);
});

test('getPixelOpacity reveals different blocks at different points in the wave', () => {
  const opacities = new Set([
    getPixelOpacity(2, 2, 30, 0.5),
    getPixelOpacity(15, 15, 30, 0.5),
    getPixelOpacity(27, 27, 30, 0.5),
  ]);

  assert.ok(opacities.size > 1);
});

test('touch taps toggle a persistent portrait reveal', () => {
  assert.equal(getNextTouchReveal(false, 'touch'), true);
  assert.equal(getNextTouchReveal(true, 'touch'), false);
});

test('mouse input does not toggle the touch reveal state', () => {
  assert.equal(getNextTouchReveal(false, 'mouse'), false);
  assert.equal(getNextTouchReveal(true, 'mouse'), true);
});

test('a touch toggle can reveal the portrait without hover or focus', () => {
  assert.equal(shouldRevealPortrait({
    pointerInside: false,
    focusInside: false,
    touchRevealed: true,
  }), true);
});
