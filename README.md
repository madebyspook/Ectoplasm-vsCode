# Ectoplasma

A lightweight VS Code dark theme foundation in the **Ectoplasma-vsCode** project. Both the extension display name and the theme picker label are **Ectoplasma**.

The current colors are provisional VS Code Dark Modern/Dark+ values, with a small editable set of workbench and syntax rules. This is not the final Ectoplasma palette. The next phase will map the existing Discord and Notion themes to blue-hued surfaces, readable text, and restrained accents. Existing projects are not changed.

## Develop and preview

Requires VS Code 1.85+ and Node.js 22+ with npm. No build or watcher is needed for theme edits.

```sh
npm ci
code .
```

1. Press **F5** (or Run and Debug → **Preview Ectoplasma**) to open an Extension Development Host with the `samples/` folder.
2. Run **Preferences: Color Theme** in that window and select **Ectoplasma**.
3. Edit `themes/Ectoplasma-color-theme.json` and save. Theme changes update live in the development host.

`colors` controls the workbench; `tokenColors` controls TextMate scopes; `semanticTokenColors` refines language-service tokens. Semantic highlighting is enabled where a language provider supports it. Use **Developer: Inspect Editor Tokens and Scopes** to identify actual scopes before adding rules.

## Test and package locally

```sh
npm test
npm run package
npm run install:local
```

Packaging creates the ignored `ectoplasma.vsix` using the official `@vscode/vsce` development tool. Its `minimatch` dependency is overridden to patched version 11.0.1; remove that override when the packager updates its dependency. Installation uses `code --install-extension`; alternatively, run **Extensions: Install from VSIX…** and choose that file. Select **Ectoplasma** afterward. Nothing is published to the Marketplace. If `code` is missing, run **Shell Command: Install 'code' command in PATH** from VS Code, or use its UI.

For manual checks, open the TypeScript, HTML/CSS, and Markdown samples; compare semantic highlighting on/off using `editor.semanticHighlighting.enabled`; inspect selections, search matches, diagnostics, terminal, sidebar, tabs, panels, and menus. Automated checks cover JSON, contribution paths, color values, token settings, and the declarative extension boundary; they do not verify visual contrast or every language grammar.

## Project files

- `package.json` — extension contribution and development scripts; no runtime dependencies.
- `themes/Ectoplasma-color-theme.json` — directly editable theme; no generated theme artifacts.
- `.vscode/` — preview launch configuration and validation task.
- `samples/` — local visual checks; `scripts/check.mjs` — dependency-free validation.
- `docs/research.md` — reference findings and optional glow recommendation.
- `.vscodeignore` — packages only the manifest, theme, README, changelog, and license.

Glow is not implemented. The supported theme remains fully usable without it; any future CSS experiment requires separate approval. See [research and glow architecture](docs/research.md).

The local publisher identifier is `madebyspook`; Marketplace ownership is not verified. Licensing remains **UNLICENSED / all rights reserved** until an explicit license is chosen. Neither blocks local VSIX use.

Official guidance: [color themes](https://code.visualstudio.com/api/extension-guides/color-theme), [semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide), [VSIX packaging](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions).
