import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const info = JSON.parse(readFileSync(new URL('./info.json', import.meta.url), 'utf8'));

test('ongoing research exposes the two complete card records', () => {
  assert.equal(info.ongoingResearch.length, 2);
  assert.deepEqual(
    info.ongoingResearch.map(({ title }) => title),
    [
      'Geometry-Controlled Interventions for Monocular 3D',
      'Gaze-Aware AI Coding Assistant',
    ],
  );

  const supportedGraphics = new Set(['monocular3d', 'gaze']);

  for (const research of info.ongoingResearch) {
    assert.equal(research.status, 'Ongoing');
    assert.ok(research.lab);
    assert.ok(research.description);
    assert.ok(research.tags.length >= 2);
    assert.ok(supportedGraphics.has(research.graphic));
  }
});
