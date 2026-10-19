import test from 'node:test';
import assert from 'node:assert/strict';
import { clampReveal, revealFromPointer, revealFromKey } from './portraitReveal.js';

test('clampReveal keeps the reveal percentage between 0 and 100', () => {
  assert.equal(clampReveal(-12), 0);
  assert.equal(clampReveal(48), 48);
  assert.equal(clampReveal(140), 100);
});

test('revealFromPointer maps vertical pointer position to a percentage', () => {
  assert.equal(revealFromPointer(100, { top: 100, height: 200 }), 0);
  assert.equal(revealFromPointer(200, { top: 100, height: 200 }), 50);
  assert.equal(revealFromPointer(350, { top: 100, height: 200 }), 100);
});

test('revealFromKey supports arrows and boundary keys', () => {
  assert.equal(revealFromKey('ArrowDown', 50), 55);
  assert.equal(revealFromKey('ArrowUp', 50), 45);
  assert.equal(revealFromKey('Home', 50), 0);
  assert.equal(revealFromKey('End', 50), 100);
  assert.equal(revealFromKey('Enter', 50), null);
});
