import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await readJson('package.json');
assert.equal(manifest.displayName, 'Ectoplasm');
assert.equal(manifest.contributes.themes.length, 1);
assert.equal(manifest.main, undefined, 'The theme must remain declarative');
assert.equal(manifest.browser, undefined, 'The theme must remain declarative');
assert.equal(manifest.activationEvents, undefined);
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
  if (typeof value === 'string') checkColor(value, selector);
  else {
    for (const [key, setting] of Object.entries(value)) {
      assert.ok(['foreground', 'bold', 'italic', 'underline', 'strikethrough'].includes(key));
      if (key === 'foreground') checkColor(setting, selector);
      else assert.equal(typeof setting, 'boolean');
    }
  }
}
for (const path of ['.vscode/launch.json', '.vscode/settings.json', '.vscode/tasks.json']) await readJson(path);
console.log(`Valid Ectoplasm foundation: ${Object.keys(theme.colors).length} workbench colors, ${theme.tokenColors.length} TextMate rules, ${Object.keys(theme.semanticTokenColors).length} semantic rules.`);
