import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createDesignTokens, createSyntaxColors, syntaxColors } from '../src/palette.js';
import { tokenColors, semanticTokenColors } from '../src/syntax.js';
import { colors } from '../src/workbench.js';

test('syntax generation returns opaque colors across accent hue sectors and boundaries', () => {
  for (const accent of ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#000000', '#FFFFFF']) {
    const generated = createSyntaxColors(createDesignTokens({ accent }));
    assert.ok(Object.keys(generated).length > 0);
    for (const color of Object.values(generated)) assert.match(color, /^#[0-9A-F]{6}$/i);
  }
  assert.deepEqual(createSyntaxColors(), syntaxColors);
});

test('generated theme matches the current workbench and syntax sources', async () => {
  const theme = JSON.parse(await readFile(new URL('../themes/Ectoplasm-color-theme.json', import.meta.url), 'utf8'));
  assert.deepEqual(theme.colors, colors);
  assert.deepEqual(theme.tokenColors, tokenColors);
  assert.deepEqual(theme.semanticTokenColors, semanticTokenColors);
});
