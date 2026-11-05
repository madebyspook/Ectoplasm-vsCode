import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { colors } from '../src/workbench.js';
import { tokenColors, semanticTokenColors } from '../src/syntax.js';

const theme = {
  $schema: 'vscode://schemas/color-theme',
  name: 'Ectoplasm',
  type: 'dark',
  semanticHighlighting: true,
  colors,
  tokenColors,
  semanticTokenColors,
};

const output = new URL('../themes/Ectoplasm-color-theme.json', import.meta.url);
const content = `${JSON.stringify(theme, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (current !== content) {
    console.error('Generated theme is missing or outdated. Run npm run build.');
    process.exitCode = 1;
  }
} else {
  await mkdir(new URL('../themes/', import.meta.url), { recursive: true });
  await writeFile(output, content);
  console.log('Generated themes/Ectoplasm-color-theme.json');
}
