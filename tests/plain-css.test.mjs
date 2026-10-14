import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../src/plain.css', import.meta.url), 'utf8')

test('profile portrait floats gently when motion is allowed', () => {
  assert.match(css, /@keyframes\s+portrait-float/)
  assert.match(css, /\.research-portrait-frame\s*\{[^}]*animation:\s*portrait-float/s)
})

test('profile portrait animation is disabled for reduced motion', () => {
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.research-portrait-frame\s*\{[^}]*animation:\s*none/s,
  )
})
