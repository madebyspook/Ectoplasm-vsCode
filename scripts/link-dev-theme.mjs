import { mkdir, readFile, realpath, symlink, writeFile, lstat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const extension = path.join(root, '.dev-extension');
// Pass the active profile's extensions directory for portable/Insiders installs.
const extensionsDir = path.resolve(process.argv[2] ?? path.join(homedir(), '.vscode', 'extensions'));
const link = path.join(extensionsDir, 'madebyspook.ectoplasm-dev');

async function ensureLink(target, destination) {
  const existing = await lstat(destination).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (existing) {
    if (!existing.isSymbolicLink() || await realpath(destination) !== await realpath(target)) {
      throw new Error(`Refusing to replace existing path: ${destination}`);
    }
    return;
  }
  await symlink(target, destination, 'dir');
}

await mkdir(extension, { recursive: true });
await writeFile(path.join(extension, 'package.json'), `${JSON.stringify({
  name: 'ectoplasm-dev',
  displayName: 'Ectoplasm Dev',
  publisher: manifest.publisher,
  version: manifest.version,
  engines: { vscode: manifest.engines.vscode },
  categories: ['Themes'],
  contributes: { themes: [{
    label: 'Ectoplasm Dev',
    uiTheme: 'vs-dark',
    path: './themes/Ectoplasm-color-theme.json',
    // VS Code internal opt-in: intentionally confined to this local preview.
    _watch: true,
  }] },
}, null, 2)}\n`);
await ensureLink(path.join(root, 'themes'), path.join(extension, 'themes'));
await mkdir(extensionsDir, { recursive: true });
await ensureLink(extension, link);
console.log(`Linked local preview: ${link}`);
console.log('Reload Window once, select Ectoplasm Dev, then run npm run watch.');
