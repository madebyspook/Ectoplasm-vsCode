import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { colors } from '../src/workbench.js';
import { tokenColors, semanticTokenColors } from '../src/syntax.js';
import { createGlowScript } from '../src/glow.js';

const theme = {
  $schema: 'vscode://schemas/color-theme',
  name: 'Ectoplasm',
  type: 'dark',
  semanticHighlighting: true,
  colors,
  tokenColors,
  semanticTokenColors,
};

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const outputs = [
  ['themes/Ectoplasm-color-theme.json', `${JSON.stringify(theme, null, 2)}\n`],
  ['glow/ectoplasm-glow.js', createGlowScript(manifest)],
];

for (const [path, content] of outputs) {
  const output = new URL(`../${path}`, import.meta.url);
  if (process.argv.includes('--check')) {
    const current = await readFile(output, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (current !== content) {
      console.error(`Generated ${path} is missing or outdated. Run npm run build.`);
      process.exitCode = 1;
    }
  } else {
    await mkdir(new URL('.', output), { recursive: true });
    await writeFile(output, content);
    console.log(`Generated ${path}`);
  }
}
