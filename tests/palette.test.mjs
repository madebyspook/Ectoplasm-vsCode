import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { paletteConfig, designTokens, createDesignTokens } from '../src/palette.js';

const surfaces = ['bgPrimary', 'bgSecondary', 'bgTertiary'];

test('design tokens use the requested defaults and valid hex colors', () => {
  assert.deepEqual(paletteConfig, { accent: '#3C86FF', bgBrightness: 0.2, bgSaturation: 0.008 });
  assert.deepEqual(Object.keys(designTokens), [
    'accent', ...surfaces, 'bgInteract', 'border',
    'textNeon', 'textPrimary', 'textSecondary', 'textMuted',
  ]);
  for (const overrides of [{}, { accent: '#FF6633' }, { bgBrightness: 0 }, { bgBrightness: 1 }, { bgSaturation: 1 }]) {
    for (const color of Object.values(createDesignTokens(overrides))) {
      assert.match(color, /^#(?:[0-9A-F]{6}|[0-9A-F]{8})$/);
    }
  }
});

test('changing accent updates dependent colors and preserves the surface hue', () => {
  // The default low saturation can quantize surfaces to gray in 8-bit hex.
  const base = createDesignTokens({ bgSaturation: 0.2 });
  const changed = createDesignTokens({ accent: '#FF6633', bgSaturation: 0.2 });
  for (const key of Object.keys(base)) assert.notEqual(changed[key], base[key], key);
  const red = createDesignTokens({ accent: '#FF0000', bgSaturation: 1 });
  assert.deepEqual(surfaces.map((key) => red[key]), ['#660000', '#700000', '#850000']);
  assert.deepEqual(createDesignTokens(), designTokens);
});

test('brightness and saturation independently affect only background surfaces', () => {
  for (const overrides of [{ bgBrightness: 0.3 }, { bgSaturation: 0.2 }]) {
    const changed = createDesignTokens(overrides);
    for (const key of Object.keys(designTokens)) {
      if (surfaces.includes(key)) assert.notEqual(changed[key], designTokens[key], key);
      else assert.equal(changed[key], designTokens[key], key);
    }
  }
  const gray = createDesignTokens({ bgSaturation: 0 });
  assert.deepEqual(surfaces.map((key) => gray[key]), ['#333333', '#383838', '#424242']);
});

test('alpha and nested RGB mixes preserve the requested weights', () => {
  assert.equal(designTokens.bgInteract, '#3C86FF1A');
  assert.equal(designTokens.border, '#3C86FF40');
  const changed = createDesignTokens({ accent: '#FF6633' });
  assert.equal(changed.bgInteract, '#FF66331A');
  assert.equal(changed.border, '#FF663340');
  const black = createDesignTokens({ accent: '#000000' });
  assert.deepEqual(
    ['textNeon', 'textPrimary', 'textSecondary', 'textMuted'].map((key) => black[key]),
    ['#CECECE', '#AAAAAA', '#5C5C5C', '#404040'],
  );
});

test('generated theme remains byte-identical to the original foundation', async () => {
  const theme = await readFile(new URL('../themes/Ectoplasm-color-theme.json', import.meta.url));
  assert.equal(createHash('sha256').update(theme).digest('hex'),
    'ad025cdf9c5d95f22d1cdf8eca74f0ea2d333f50173e2ed4d6c2bc6d05914f04');
});
