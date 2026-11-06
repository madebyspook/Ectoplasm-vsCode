import assert from 'node:assert/strict';
import test from 'node:test';
import { paletteConfig, designTokens, createDesignTokens } from '../src/palette.js';

const rgb = (color) => [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16));

test('palette generation returns valid colors for defaults and boundary inputs', () => {
  for (const overrides of [
    {}, { accent: '#aBcDeF' }, { accent: '#000000' }, { accent: '#FFFFFF' },
    { bgBrightness: 0 }, { bgBrightness: 1 }, { bgSaturation: 0 }, { bgSaturation: 1 },
    { bgBrightness: 1, bgSaturation: 1 },
  ]) {
    const tokens = createDesignTokens(overrides);
    assert.ok(Object.keys(tokens).length > 0);
    for (const color of Object.values(tokens)) {
      assert.match(color, /^#(?:[0-9A-F]{6}|[0-9A-F]{8})$/);
    }
  }
  assert.deepEqual(createDesignTokens(), designTokens);
  assert.deepEqual(createDesignTokens(paletteConfig), designTokens);
  assert.equal(createDesignTokens({ accent: '#aBcDeF' }).accent, '#ABCDEF');
});

test('primary surface HSL calculation handles grayscale, hue sectors, and clamping', () => {
  for (const brightness of [0, 0.2, 0.5, 1]) {
    const tokens = createDesignTokens({ bgBrightness: brightness, bgSaturation: 0 });
    assert.deepEqual(rgb(tokens.bgPrimary), Array(3).fill(Math.round(brightness * 255)));
  }
  // Fully saturated HSL primaries/secondaries at 50% lightness round-trip.
  for (const accent of ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF']) {
    const tokens = createDesignTokens({ accent, bgBrightness: 0.5, bgSaturation: 1 });
    assert.equal(tokens.bgPrimary, accent);
  }
  const clipped = createDesignTokens({ bgBrightness: 1, bgSaturation: 1 });
  for (const key of ['bgPrimary', 'bgSecondary', 'bgTertiary']) assert.equal(clipped[key], '#FFFFFF');
});

test('RGB mixing is linear within byte rounding and alpha preserves RGB channels', () => {
  const black = createDesignTokens({ accent: '#000000' });
  const white = createDesignTokens({ accent: '#FFFFFF' });
  const accent = '#4280C0';
  const channels = rgb(accent);
  const mixed = createDesignTokens({ accent });
  // Check interpolation without fixing the aesthetic mixing weights.
  for (const key of ['textNeon', 'textPrimary', 'textSecondary', 'textMuted']) {
    const low = rgb(black[key]);
    const high = rgb(white[key]);
    rgb(mixed[key]).forEach((value, i) => {
      const expected = low[i] + (high[i] - low[i]) * channels[i] / 255;
      assert.ok(Math.abs(value - expected) <= 2, `${key}: channel ${i}`);
    });
  }
  for (const key of ['bgInteract', 'border']) {
    assert.match(mixed[key], /^#[0-9A-F]{8}$/);
    assert.equal(mixed[key].slice(0, 7), accent);
    assert.equal(mixed[key].slice(7), black[key].slice(7));
    assert.equal(mixed[key].slice(7), white[key].slice(7));
  }
});

test('invalid palette inputs fail before generating malformed colors', () => {
  for (const key of ['bgBrightness', 'bgSaturation']) {
    for (const value of [-0.1, 1.1, NaN, Infinity, -Infinity, '0.2', null, undefined]) {
      assert.throws(() => createDesignTokens({ [key]: value }), RangeError);
    }
  }
  for (const accent of ['#FFF', '#GG0000', '#12345678', 'blue', '', null, undefined, 123]) {
    assert.throws(() => createDesignTokens({ accent }), TypeError);
  }
});
