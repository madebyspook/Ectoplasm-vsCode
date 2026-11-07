const vscode = require('vscode');
const fs = require('node:fs/promises');
const path = require('node:path');
const { setGlow, inspect } = require('./workbench.cjs');

function activate(context) {
  const readScript = () => fs.readFile(path.join(context.extensionPath, 'glow', 'ectoplasm-glow.js'), 'utf8');
  let busy = false;
  async function toggle(enabled) {
    if (busy) return;
    if (process.platform !== 'darwin' || vscode.env.uiKind !== vscode.UIKind.Desktop) {
      await vscode.window.showErrorMessage('Ectoplasm glow currently supports macOS desktop VS Code only.');
      return;
    }
    busy = true;
    let changed;
    try {
      if (enabled) {
        const answer = await vscode.window.showWarningMessage(
          'Enable Ectoplasm glow by modifying this VS Code installation?',
          {
            modal: true,
            detail: 'There is no supported syntax text-shadow API. This adds a script and a marked loader to the installed workbench HTML, affecting all windows of this installation. VS Code may report an unsupported or corrupt installation because its files changed. Security checks and checksums will remain intact. Disable Glow removes only Ectoplasm’s patch. Updates can remove it; re-enable manually afterward. Disable glow before uninstalling Ectoplasm.',
          },
          'Enable Glow',
        );
        if (answer !== 'Enable Glow') return;
      }
      changed = await setGlow(vscode.env.appRoot, enabled, enabled ? await readScript() : undefined);
      await context.globalState.update('glowEnabled', enabled);
    } catch (error) {
      const message = ['EACCES', 'EPERM', 'EROFS'].includes(error.code)
        ? 'This VS Code installation is not writable. Use a writable, user-owned installation; Ectoplasm does not elevate permissions.'
        : error.message;
      await vscode.window.showErrorMessage(`Ectoplasm glow: ${message}`);
      return;
    } finally {
      busy = false;
    }
    // A pending reload notification must not block a later Disable command.
    const state = enabled ? 'enabled' : 'disabled';
    const answer = await vscode.window.showInformationMessage(
      `Ectoplasm glow ${state}${changed ? '' : ' (already up to date)'}. Reload every open VS Code window to apply the change.`,
      'Reload Window',
    );
    if (answer === 'Reload Window') await vscode.commands.executeCommand('workbench.action.reloadWindow');
  }
  context.subscriptions.push(
    vscode.commands.registerCommand('ectoplasm.enableGlow', () => toggle(true)),
    vscode.commands.registerCommand('ectoplasm.disableGlow', () => toggle(false)),
  );

  // Updates replace app files. Detect a missing/stale patch but never reinstall
  // it on activation. Changing the palette also requires explicit re-enabling.
  if (process.platform === 'darwin' && context.globalState.get('glowEnabled')) {
    readScript()
      .then(async (script) => {
        if (!await inspect(vscode.env.appRoot, script)) {
          const answer = await vscode.window.showInformationMessage(
            'Ectoplasm glow needs re-enabling after an app, extension, or palette update. No installation files were changed.',
            'Enable Glow',
          );
          if (answer === 'Enable Glow') await toggle(true);
        }
      })
      .catch((error) => vscode.window.showWarningMessage(`Ectoplasm could not check its glow patch: ${error.message}`));
  }
}

module.exports = { activate };
