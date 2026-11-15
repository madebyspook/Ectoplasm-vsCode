# Ectoplasm
A dark VS Code theme with a shared accent-derived palette and optional macOS syntax and cursor glow.

## Install
Requires VS Code 1.85+, Node.js 22+, and npm.
```bash
npm ci
npm run install:local
```
Select **Ectoplasm** under **Preferences: Color Theme**. Local installation builds,
packages, and installs `ectoplasm.vsix`; it does not enable glow automatically.

## Develop in the main editor window
One-time setup:
```bash
npm run dev:link
```
Run **Developer: Reload Window** once and select **Ectoplasm Dev**. Then run:
```bash
npm run watch
```
Save changes in `src/palette.js`, `src/workbench.js`, or `src/syntax.js` to update
that window automatically. Check the terminal for build errors if colors stop
updating. User/workspace color customizations can override theme rules.

The local Dev extension links directly to generated `themes/` through the ignored
`.dev-extension/` directory. It uses VS Code's internal, unsupported `_watch` flag;
future VS Code changes may affect it. For a custom extensions directory, run
`node scripts/link-dev-theme.mjs /path/to/extensions` after building.

Select **Ectoplasm** to return to production. Run `npm run install:local` when you
want to apply source changes to the installed production extension. Dev preview
has no glow; the production glow patch remains untouched.

To remove Dev preview, delete only the `~/.vscode/extensions/madebyspook.ectoplasm-dev`
link, then reload. Remove this link before moving the repository and rerun setup
afterward. The ignored `.dev-extension/` directory can also be removed.

## Build and package
- `npm run build` generates the theme JSON and separate glow script.
- `npm run check` builds and checks generated glow, runtime, and setup JavaScript syntax.
- `npm run package` validates metadata and creates `ectoplasm.vsix`.

Generated `themes/`, `glow/`, `.dev-extension/`, and VSIX files are ignored by Git.
Do not edit generated files. Packaging includes the generated theme and glow,
plus the runtime commands; source and development files are excluded.

## Optional glow
On macOS desktop VS Code, run **Ectoplasm: Enable Glow** and reload. To remove
it, run **Ectoplasm: Disable Glow** and reload. Disable glow before uninstalling.
App updates can remove the patch; changed glow colors require enabling it again.

Glow modifies VS Code's workbench files through an explicit confirmation and may
trigger an **[Unsupported]** warning. It is scoped to production **Ectoplasm**.
The standard theme works independently.

Inspired by [SynthWave '84 by Robb Owen](https://github.com/robb0wen/synthwave-vscode).
Ectoplasm is independent and unaffiliated.

**License:** UNLICENSED / All rights reserved.
