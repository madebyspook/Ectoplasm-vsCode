# Ectoplasm

A lightweight VS Code dark theme foundation in the **Ectoplasm-vsCode** project. Both the extension display name and the theme picker label are **Ectoplasm**.

The current colors are provisional VS Code Dark Modern/Dark+ values, with a small editable set of workbench and syntax rules. This is not the final Ectoplasm palette. The next phase will map the existing Discord and Notion themes to blue-hued surfaces, readable text, and restrained accents. Existing projects are not changed.

## Develop and preview

Requires VS Code 1.85+ and Node.js 22+ with npm.

```sh
npm ci
npm run build
code .
```

1. Run `npm run watch` in a terminal to rebuild automatically when source modules change. Watch mode also builds once on startup; press Ctrl+C to stop it.
2. Press **F5** (or Run and Debug → **Preview Ectoplasm**) to build the theme and open an Extension Development Host with the `samples/` folder.
3. Run **Preferences: Color Theme** in that window and select **Ectoplasm**.
4. Edit `src/palette.js` for shared colors, `src/workbench.js` for interface mappings, or `src/syntax.js` for TextMate and semantic rules. With watch mode running, saved changes rebuild the JSON and update the development host live. For a one-off rebuild, run `npm run build`.

`themes/Ectoplasm-color-theme.json` is tracked generated output. Do not edit it manually; include the rebuilt file with source changes.

`colors` controls the workbench; `tokenColors` controls TextMate scopes; `semanticTokenColors` refines language-service tokens. Semantic highlighting is enabled where a language provider supports it. Use **Developer: Inspect Editor Tokens and Scopes** to identify actual scopes before adding rules.

## Ectoplasm design tokens

`src/palette.js` has two layers: `designTokens` contains the derived Ectoplasm
colors; the existing `palette` export supplies the provisional VS Code mappings.
The design tokens are available for future mapping and do not change the current theme.

Edit `paletteConfig` to set `accent` (default `#3C86FF`, in `#RRGGBB` format),
`bgBrightness` (`0.2`), and `bgSaturation` (`0.008`). Brightness and saturation
are HSL values from 0 to 1. All three surfaces use the accent hue, with
brightness scaled by 1 / 1.1 / 1.3 and saturation by 1 / 1.75 / 2.5;
scaled values are clamped to 1. These approximate the Notion relationships.
At the default low saturation, 8-bit rounding can hide hue changes on surfaces.
Text uses nested RGB mixes: the first weight belongs to the accent, and the
second to the intermediate color. Each mix rounds to the nearest RGB byte.
Interactive backgrounds and borders add 10% and 25% alpha, rounded to hex bytes.

`createDesignTokens({ accent: '#FF6633' })` derives an independent palette with
partial overrides. The small RGB, HSL, and alpha helpers live in `palette.js`;
there are no color dependencies or CSS conversion machinery.

## Test and package locally

```sh
npm test
npm run package
npm run install:local
```

Packaging creates the ignored `ectoplasm.vsix` using the official `@vscode/vsce` development tool. Its `minimatch` dependency is overridden to patched version 11.0.1; remove that override when the packager updates its dependency. Installation uses `code --install-extension`; alternatively, run **Extensions: Install from VSIX…** and choose that file. Select **Ectoplasm** afterward. Nothing is published to the Marketplace. If `code` is missing, run **Shell Command: Install 'code' command in PATH** from VS Code, or use its UI.

`npm test` rebuilds and validates the generated theme, runs focused design-token tests, and checks the original theme output remains byte-identical. `npm run check` checks it without writing files and fails if output is missing or stale. Packaging runs the same rebuild and validation before creating the VSIX, so stale JSON is not packaged.

For manual checks, open the TypeScript, HTML/CSS, and Markdown samples; compare semantic highlighting on/off using `editor.semanticHighlighting.enabled`; inspect selections, search matches, diagnostics, terminal, sidebar, tabs, panels, and menus. Automated checks cover JSON, contribution paths, color values, token settings, and the declarative extension boundary; they do not verify visual contrast or every language grammar.

## Project files

- `package.json` — extension contribution and development scripts; no runtime dependencies.
- `src/palette.js` — configuration, derived design tokens, and existing mapping colors; `src/workbench.js` — interface mappings; `src/syntax.js` — TextMate and semantic rules.
- `scripts/build.mjs` — deterministic theme generation and stale-output check; `npm run watch` uses Node's built-in watch mode.
- `themes/Ectoplasm-color-theme.json` — generated theme consumed by VS Code.
- `.vscode/` — preview launch configuration and validation task.
- `samples/` — local visual checks; `scripts/check.mjs` — dependency-free validation.
- `docs/research.md` — reference findings and optional glow recommendation.
- `.vscodeignore` — packages only the manifest, theme, README, changelog, and license.

Glow is not implemented. The supported theme remains fully usable without it; any future CSS experiment requires separate approval. See [research and glow architecture](docs/research.md).

The local publisher identifier is `madebyspook`; Marketplace ownership is not verified. Licensing remains **UNLICENSED / all rights reserved** until an explicit license is chosen. Neither blocks local VSIX use.

Official guidance: [color themes](https://code.visualstudio.com/api/extension-guides/color-theme), [semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide), [VSIX packaging](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions).
