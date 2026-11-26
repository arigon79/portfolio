import assert from 'node:assert/strict';
import test from 'node:test';

test('normalizeResearchGraphic preserves supported keys and falls back for unknown keys', async () => {
  let subject;

  try {
    subject = await import('./ongoingResearch.js');
  } catch {
    subject = undefined;
  }

  assert.equal(typeof subject?.normalizeResearchGraphic, 'function');
  assert.equal(subject.normalizeResearchGraphic('monocular3d'), 'monocular3d');
  assert.equal(subject.normalizeResearchGraphic('gaze'), 'gaze');
  assert.equal(subject.normalizeResearchGraphic('unknown'), 'fallback');
  assert.equal(subject.normalizeResearchGraphic(), 'fallback');
});
