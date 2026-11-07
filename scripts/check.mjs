import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createGlowStyles } from '../src/glow.js';
import { tokens } from '../src/palette.js';
import { colors } from '../src/workbench.js';

const root = new URL('../', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await readJson('package.json');
assert.equal(manifest.displayName, 'Ectoplasm');
assert.equal(manifest.contributes.themes.length, 1);
assert.equal(manifest.main, './runtime/extension.cjs');
await readFile(new URL(manifest.main, root));
assert.equal(manifest.browser, undefined, 'Glow is desktop-only');
assert.deepEqual(manifest.extensionKind, ['ui']);
assert.deepEqual(manifest.activationEvents, ['onStartupFinished']);
assert.deepEqual(manifest.contributes.commands, [
  { command: 'ectoplasm.enableGlow', title: 'Ectoplasm: Enable Glow' },
  { command: 'ectoplasm.disableGlow', title: 'Ectoplasm: Disable Glow' },
]);
assert.equal(manifest.dependencies, undefined, 'No runtime dependencies are needed');

const contribution = manifest.contributes.themes[0];
assert.equal(contribution.label, 'Ectoplasm');
assert.equal(contribution.uiTheme, 'vs-dark');
const theme = await readJson(contribution.path);
assert.equal(theme.name, contribution.label);
assert.equal(theme.type, 'dark');
assert.equal(theme.semanticHighlighting, true);
const hex = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const checkColor = (color, label) => assert.match(color, hex, `Invalid color: ${label}`);
for (const [key, value] of Object.entries(colors)) checkColor(value, key);
for (const [key, value] of Object.entries(theme.colors)) checkColor(value, key);
assert.ok(theme.colors['editor.background']);
assert.ok(theme.colors['editor.foreground']);
assert.ok(theme.tokenColors.length > 0);
for (const rule of theme.tokenColors) {
  const scopes = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
  assert.ok(scopes.length && scopes.every((scope) => typeof scope === 'string' && scope.trim()));
  assert.ok(rule.settings && Object.keys(rule.settings).length);
  for (const [key, value] of Object.entries(rule.settings)) {
    assert.ok(['foreground', 'background', 'fontStyle'].includes(key), `Unsupported token setting: ${key}`);
    if (key === 'fontStyle') {
      assert.match(value, /^(?:(?:italic|bold|underline|strikethrough)(?: |$))*$/);
    } else checkColor(value, rule.name);
  }
}
assert.ok(Object.keys(theme.semanticTokenColors).length > 0);
for (const [selector, value] of Object.entries(theme.semanticTokenColors)) {
  // Allow custom token types/modifiers and optional language selectors.
  assert.match(selector, /^(?:\*|[\w-]+)(?:\.[\w-]+)*(?::[\w-]+)?$/, `Invalid semantic selector: ${selector}`);
  if (typeof value === 'string') checkColor(value, selector);
  else {
    assert.ok(value && typeof value === 'object' && !Array.isArray(value));
    assert.ok(Object.keys(value).length, `Empty semantic settings: ${selector}`);
    for (const [key, setting] of Object.entries(value)) {
      assert.ok(['foreground', 'bold', 'italic', 'underline', 'strikethrough'].includes(key));
      if (key === 'foreground') checkColor(setting, selector);
      else assert.equal(typeof setting, 'boolean');
    }
  }
}
for (const path of ['.vscode/launch.json', '.vscode/settings.json', '.vscode/tasks.json']) await readJson(path);
const glowStyles = createGlowStyles();
const syntaxColors = new Set([
  ...theme.tokenColors.map((rule) => rule.settings.foreground),
  ...Object.values(theme.semanticTokenColors).map((value) => typeof value === 'string' ? value : value.foreground),
].filter(Boolean).map((color) => color.toLowerCase()));
for (const name of ['synGlow', 'synKeyword', 'synConstant', 'synString', 'synParameter']) {
  assert.ok(syntaxColors.has(tokens[name].toLowerCase()), `Missing syntax color: ${name}`);
}
for (const name of ['synGlow', 'synKeyword', 'synConstant', 'synParameter']) {
  assert.ok(glowStyles[tokens[name].toLowerCase()], `Missing glow: ${name}`);
}
for (const name of ['synString', 'textPrimary', 'textSecondary', 'textMuted']) {
  assert.equal(glowStyles[tokens[name].toLowerCase()], undefined, `Text must not glow: ${name}`);
}
console.log(`Valid Ectoplasm foundation: ${Object.keys(theme.colors).length} workbench colors, ${theme.tokenColors.length} TextMate rules, ${Object.keys(theme.semanticTokenColors).length} semantic rules.`);
