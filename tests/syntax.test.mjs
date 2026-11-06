import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createDesignTokens, createSyntaxColors, designTokens, syntaxColors } from '../src/palette.js';
import { tokenColors, semanticTokenColors } from '../src/syntax.js';
import { colors } from '../src/workbench.js';

const luminance = (hex) => {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels.reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
};

test('syntax colors derive from the accent, reuse text tokens, and remain opaque', () => {
  assert.equal(syntaxColors.comment, designTokens.textMuted);
  const [red, green, blue] = [1, 3, 5].map((offset) => parseInt(syntaxColors.string.slice(offset, offset + 2), 16));
  assert.ok(green > red && green > blue, 'Configured strings must be green');
  for (const accent of ['#FF6633', '#FF0033', '#000000', '#FFFFFF']) {
    const changed = createSyntaxColors(createDesignTokens({ accent }));
    for (const color of Object.values(changed)) assert.match(color, /^#[0-9A-F]{6}$/);
  }
  const changed = createSyntaxColors(createDesignTokens({ accent: '#FF6633' }));
  for (const key of ['keyword', 'function', 'type', 'string', 'constant', 'property', 'parameter', 'invalid']) {
    assert.notEqual(changed[key], syntaxColors[key], key);
  }
  const brighterSurfaces = createSyntaxColors(createDesignTokens({ bgBrightness: 0.2, bgSaturation: 0.2 }));
  assert.deepEqual(brighterSurfaces, syntaxColors, 'Surface controls must not change syntax colors');
});

test('syntax colors maintain readable contrast on the configured editor surface', () => {
  const background = luminance(designTokens.bgPrimary);
  for (const [name, color] of Object.entries(syntaxColors)) {
    const contrast = (luminance(color) + 0.05) / (background + 0.05);
    // Existing muted/secondary text tokens are preserved; new syntax colors meet 4.5:1.
    const minimum = ['comment', 'operator', 'punctuation'].includes(name) ? 3 : 4.5;
    assert.ok(contrast >= minimum, `${name}: ${contrast.toFixed(2)}:1`);
  }
});

test('semantic selectors use standard types/modifiers without accidental style overrides', () => {
  const types = new Set('comment keyword string regexp number operator namespace type class interface struct enum typeParameter function method macro decorator variable parameter property enumMember event'.split(' '));
  const modifiers = new Set(['readonly', 'deprecated']);
  for (const [selector, color] of Object.entries(semanticTokenColors)) {
    const [type, ...flags] = selector.split('.');
    assert.ok(type === '*' || types.has(type), selector);
    assert.ok(flags.every((flag) => modifiers.has(flag)), selector);
    assert.ok([designTokens.textPrimary, syntaxColors.comment, syntaxColors.string].includes(color), selector);
  }
  const scopes = tokenColors.flatMap((rule) => [rule.scope].flat());
  assert.equal(scopes.length, new Set(scopes).size, 'Duplicate scope definitions');
  assert.ok(tokenColors.every((rule) => Object.keys(rule.settings).join() === 'foreground'));
  assert.deepEqual(semanticTokenColors, {
    '*': designTokens.textPrimary,
    comment: designTokens.textMuted,
    string: syntaxColors.string,
  });
});

test('TextMate rules keep default syntax and string punctuation primary, strings green, and comments muted', () => {
  assert.deepEqual(tokenColors, [
    {
      name: 'Default syntax',
      scope: ['keyword', 'storage', 'constant', 'variable', 'entity', 'support', 'meta', 'punctuation', 'keyword.operator'],
      settings: { foreground: designTokens.textPrimary },
    },
    { name: 'Strings', scope: ['string'], settings: { foreground: syntaxColors.string } },
    {
      name: 'String punctuation',
      scope: ['punctuation.definition.string', 'punctuation.definition.template-expression'],
      settings: { foreground: designTokens.textPrimary },
    },
    { name: 'Comments', scope: ['comment'], settings: { foreground: designTokens.textMuted } },
  ]);
});

test('generated theme preserves the intended workbench baseline and current syntax', async () => {
  const theme = JSON.parse(await readFile(new URL('../themes/Ectoplasm-color-theme.json', import.meta.url), 'utf8'));
  assert.deepEqual(theme.colors, colors);
  assert.deepEqual(theme.tokenColors, tokenColors);
  assert.deepEqual(theme.semanticTokenColors, semanticTokenColors);
  assert.equal(createHash('sha256').update(JSON.stringify(theme.colors)).digest('hex'),
    '78e5da2f8c557dea4c8d98dc5dadd3e61b77c62399656a7804c73871479e4fe0');
});
