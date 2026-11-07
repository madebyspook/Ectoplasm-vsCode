const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const scriptName = 'ectoplasm-glow.js';
const scriptHeader = '// Ectoplasm syntax glow: managed workbench script\n';
const start = '<!-- ECTOPLASM SYNTAX GLOW START -->';
const end = '<!-- ECTOPLASM SYNTAX GLOW END -->';
const injection = `${start}<script src="./${scriptName}"></script>${end}`;

async function readOptional(file) {
  try { return await fs.readFile(file, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function resolveWorkbench(appRoot) {
  for (const base of ['electron-browser', 'electron-sandbox']) {
    for (const name of ['workbench.esm.html', 'workbench.html']) {
      const html = path.join(appRoot, 'out', 'vs', 'code', base, 'workbench', name);
      if (await readOptional(html) !== null) return { html, script: path.join(path.dirname(html), scriptName) };
    }
  }
  throw new Error('Unsupported VS Code workbench layout. No files were changed.');
}

function removeInjection(html) {
  // Remove only complete, exact blocks owned by us. Never restore an old HTML
  // snapshot: doing so could overwrite a VS Code update or another extension.
  const clean = html.split(injection).join('');
  if (clean.includes(start) || clean.includes(end) || clean.includes(scriptName)) {
    throw new Error('Ectoplasm found an altered glow injection; refusing to overwrite it.');
  }
  return clean;
}

async function atomicWrite(file, content) {
  const mode = (await fs.stat(file).catch((error) => {
    if (error.code === 'ENOENT') return { mode: 0o644 };
    throw error;
  })).mode & 0o777;
  const temporary = `${file}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  try {
    await fs.writeFile(temporary, content, { flag: 'wx', mode });
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

async function inspect(appRoot, script) {
  const files = await resolveWorkbench(appRoot);
  const html = await fs.readFile(files.html, 'utf8');
  return html.includes(injection) && await readOptional(files.script) === script;
}

async function setGlow(appRoot, enabled, script) {
  if (enabled && !script?.startsWith(scriptHeader)) throw new Error('Invalid generated glow script.');
  const files = await resolveWorkbench(appRoot);
  // Serialize commands across windows. A stale lock is deliberately not stolen.
  const lockFile = `${files.html}.ectoplasm-glow.lock`;
  let lock;
  try { lock = await fs.open(lockFile, 'wx'); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Another glow operation is active. If VS Code crashed, close all VS Code windows and remove ${lockFile} before retrying.`);
    throw error;
  }
  try {
    const html = await fs.readFile(files.html, 'utf8');
    const clean = removeInjection(html);
    const previous = await readOptional(files.script);
    if (previous !== null && !previous.startsWith(scriptHeader)) {
      throw new Error('The glow script filename is occupied by an unrecognized file. No files were changed.');
    }
    if (enabled && !/<\/html\s*>\s*$/i.test(clean)) throw new Error('Unrecognized workbench HTML. No files were changed.');
    const next = enabled ? clean.replace(/(<\/html\s*>\s*)$/i, `${injection}$1`) : clean;
    const changed = html !== next || (enabled ? previous !== script : previous !== null);
    // Write the script before adding its loader. Roll back that script if the
    // HTML write fails. Disable removes the loader before deleting the script.
    if (enabled && previous !== script) await atomicWrite(files.script, script);
    try {
      if (html !== next) {
        if (await fs.readFile(files.html, 'utf8') !== html) throw new Error('Workbench changed during the operation. Retry the command.');
        await atomicWrite(files.html, next);
      }
    } catch (error) {
      if (enabled && previous !== script) {
        if (previous === null) await fs.rm(files.script, { force: true });
        else await atomicWrite(files.script, previous);
      }
      throw error;
    }
    if (!enabled && previous !== null) await fs.rm(files.script);
    return changed;
  } finally {
    await lock.close();
    await fs.rm(lockFile, { force: true });
  }
}

module.exports = { setGlow, inspect, resolveWorkbench };
