# Ectoplasm
A dark VS Code theme built around a configurable accent color, subtle backgrounds, and distinct syntax highlighting.
Includes optional neon syntax glow inspired by [SynthWave '84](https://github.com/robb0wen/synthwave-vscode).

## Installation
Requires VS Code 1.85+, Node.js 22+, and npm.
```bash
npm ci
npm run install:local
```

Select **Ectoplasm** under **Preferences: Color Theme**.
The extension is currently available for local installation only.

## Development
The theme uses a shared palette to generate workbench and syntax highlighting colors.
- `src/palette.js` — Colors and design tokens.
- `src/workbench.js` — VS Code interface colors.
- `src/syntax.js` — Syntax highlighting rules.
- `src/glow.js` — Optional syntax glow.
- `samples/` — Files for manually previewing syntax highlighting.

To rebuild automatically during development:
```bash
npm run watch
```

Press **F5** to preview the theme in an Extension Development Host.

To validate and package:
```bash
npm run check
npm run package
```

Generated theme and glow files should not be edited directly.
`npm run check` validates generated-output freshness, theme JSON syntax, and
glow/runtime JavaScript syntax. Packaging validates extension metadata through `vsce`.

## Optional Glow
Ectoplasm supports optional neon syntax and editor cursor glow on macOS.
To enable it, open the Command Palette and run **Ectoplasm: Enable Glow**, then reload VS Code.
To disable it, run **Ectoplasm: Disable Glow** and reload.
Glow applies selectively to syntax highlighting and adds a stronger electric-blue halo around the editor cursor, whose foreground uses the near-white `neon` token. Both effects are scoped to Ectoplasm.

**Important:** VS Code does not officially support syntax glow. Enabling it modifies VS Code's workbench files and may trigger an **[Unsupported]** warning. Disable glow before uninstalling the extension. VS Code or extension updates may require enabling glow again.

## Credits
Syntax glow inspired by [SynthWave '84 by Robb Owen](https://github.com/robb0wen/synthwave-vscode).
Ectoplasm is an independent project and is not affiliated with SynthWave '84.

**License:** UNLICENSED / All rights reserved.
