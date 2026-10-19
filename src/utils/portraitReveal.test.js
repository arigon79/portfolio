import test from 'node:test';
import assert from 'node:assert/strict';
import { getCoverCrop } from './portraitReveal.js';

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
