# Ectoplasm

A lightweight VS Code dark theme foundation in the **Ectoplasm-vsCode** project. Both the extension display name and the theme picker label are **Ectoplasm**.

The workbench uses the configurable Ectoplasm design tokens for surfaces, text, borders, and interactions. Syntax defaults to primary text, with green strings, muted comments, and primary-colored string punctuation. Existing Discord and Notion projects are not changed.

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
4. Edit `src/palette.js` for shared colors, `src/workbench.js` for interface mappings, or `src/syntax.js` for TextMate and semantic rules. With watch mode running, saved changes rebuild the JSON and update the development host live. Re-run Enable Glow and reload after changing glow or palette sources; the installed glow script is a separate snapshot. For a one-off rebuild, run `npm run build`.

`themes/Ectoplasm-color-theme.json` and `glow/ectoplasm-glow.js` are tracked generated output. Do not edit them manually; include the rebuilt files with source changes.

`colors` controls the workbench; `tokenColors` controls TextMate scopes; `semanticTokenColors` refines language-service tokens. Semantic highlighting is enabled where a language provider supports it. Use **Developer: Inspect Editor Tokens and Scopes** to identify actual scopes before adding rules.

## Ectoplasm design tokens

`src/palette.js` exports `tokens` and `createTokens(overrides)` for workbench and
syntax colors. `synGlow`, `synKeyword`, `synConstant`, `synString`, and `synParameter`
color functions, keywords/types, constants, strings, and parameters respectively.
Primary, secondary, and muted text are excluded from glow.

Primary surfaces use `bgPrimary`, sidebar and panels use `bgSecondary`, and inputs, menus, and widgets use `bgTertiary`.
Hover and selection overlays use `bgInteract`, separators use `border`, and
active indicators use `accent`. Interface text uses the primary, secondary,
muted, and neon tokens according to its state. Terminal ANSI and diagnostic
colors retain VS Code defaults.

Edit `paletteConfig` to set `accent` (default `#3C86FF`, in `#RRGGBB` format),
`bgBrightness` (`0.075`), and `bgSaturation` (`0.1`). Brightness and saturation
are HSL values from 0 to 1. All three surfaces use the accent hue, with
brightness scaled by 1 / 1.25 / 1.5 and saturation by 1 / 2 / 2.5;
scaled values are clamped to 1. These approximate the Notion relationships.
At very low saturation, 8-bit rounding can hide hue changes on surfaces.
Text uses nested RGB mixes: the first weight belongs to the accent, and the
second to the intermediate color. Each mix rounds to the nearest RGB byte.
Interactive backgrounds and borders add 10% and 25% alpha, rounded to hex bytes.

`createTokens({ accent: '#FF6633' })` derives an independent palette with
partial overrides. The small RGB, HSL, and alpha helpers live in `palette.js`;
there are no color dependencies or CSS conversion machinery.

TextMate and semantic highlighting share the same syntax colors. General code,
string punctuation, operators, and comments retain their existing primary,
secondary, or muted foregrounds. Glow does not change any foreground colors.

Coverage depends on each grammar and semantic provider. A grammar that includes
quotation marks in the string contents (such as the bundled Python grammar), or a
semantic provider that includes them in a string token, cannot color those marks
separately through a theme. Interpolation must also expose an embedded-expression
or punctuation scope for the primary reset to apply.
Use `samples/` to compare languages and inspect scopes.

## Validate and package locally

```sh
npm run build
npm run check
npm run package
npm run install:local
```

Packaging creates the ignored `ectoplasm.vsix` using the official `@vscode/vsce` development tool. Its `minimatch` dependency is overridden to patched version 11.0.1; remove that override when the packager updates its dependency. `npm run install:local` first packages the current source, then installs it using `code --install-extension ectoplasm.vsix --force`, including when reinstalling the same version. A build, validation, or packaging failure stops installation. Alternatively, run `npm run package`, then **Extensions: Install from VSIX…** and choose that file. Select **Ectoplasm** afterward; use **Developer: Reload Window** if an open window still displays the previous theme. Nothing is published to the Marketplace. If `code` is missing, run **Shell Command: Install 'code' command in PATH** from VS Code, or use its UI.

`npm run build` regenerates the theme and optional glow renderer. `npm run check` validates color formats, TextMate and semantic token structures, the extension manifest, and configuration JSON without writing files, and fails if generated output is missing or stale. Packaging runs the build and validation before creating the VSIX, so stale JSON is not packaged.

For manual checks, open the JavaScript, TypeScript, Python, HTML/CSS, and Markdown samples; compare semantic highlighting on/off using `editor.semanticHighlighting.enabled`; inspect selections, search matches, diagnostics, terminal, sidebar, tabs, panels, and menus. Automated checks cover JSON, contribution paths, color values, token settings, glow exclusions, and the optional runtime manifest; they do not replace visual review or verify every language grammar.

## Project files

- `package.json` — extension contribution and development scripts; no runtime dependencies.
- `src/palette.js` — configuration, derived design tokens, and existing mapping colors; `src/workbench.js` — interface mappings; `src/syntax.js` — TextMate and semantic rules.
- `scripts/build.mjs` — deterministic theme generation and stale-output check; `npm run watch` uses Node's built-in watch mode.
- `themes/Ectoplasm-color-theme.json` — generated theme consumed by VS Code.
- `.vscode/` — preview launch configuration and validation task.
- `samples/` — TypeScript, JavaScript, JSON, CSS, HTML, Python, and Markdown checks; `scripts/check.mjs` — dependency-free validation.
- `docs/research.md` — reference findings and optional glow recommendation.
- `.vscodeignore` — packages the manifest, theme, optional glow renderer and runtime, README, changelog, and license.

## Optional syntax glow (macOS)

Select **Ectoplasm**, then run **Ectoplasm: Enable Glow** from the Command Palette.
The confirmation explains the unsupported installation patch. After accepting,
choose **Reload Window**; reload other open windows of this installation too.
Glow applies only to syntax spans inside Ectoplasm's editor lines, including
TextMate and semantic colors. Other themes, terminal text, menus, tabs, and
other workbench styling are excluded. The theme remains usable without glow.

Run **Ectoplasm: Disable Glow** and reload all windows to remove it. Disable
before uninstalling or disabling the extension: VS Code has no uninstall hook,
and removing the extension alone cannot remove an installation patch.

VS Code does not expose a supported syntax text-shadow API. Enabling writes one
owned `ectoplasm-glow.js` beside the workbench HTML and adds one marked script
loader. This can trigger **[Unsupported] / installation appears corrupt** because
VS Code detects changed product files. Ectoplasm never changes checksums, CSP,
or security checks and does not request administrator privileges. Use a writable,
user-owned installation. See [Microsoft's explanation](https://code.visualstudio.com/docs/supporting/faq#_installation-appears-to-be-corrupt-unsupported).

Disabling removes only Ectoplasm's exact marked blocks and owned script; it does
not restore an old workbench backup over other extensions' changes. Malformed
markers or an unrecognized file at the script path cause a refusal rather than an
overwrite. If the extension has already been removed, reinstall it and disable
glow; reinstalling VS Code also replaces patched product files, but removes any
other installation patches too. Existing warnings may require an app restart.

VS Code updates can remove the patch. Startup checks notify previously enabled
installations when the patch is missing or stale; re-run Enable Glow manually.
Extension or palette updates likewise need re-enabling and a reload. Nothing
patches automatically on activation. Patching affects every window/profile using
that app, but the renderer scopes its rules to Ectoplasm's theme identity.

The renderer targets nested token spans (`.view-line span.mtkN`) and regenerates
its rules when syntax colors or theme classes change. It also rebinds after
workbench/token stylesheet replacement and restores its style if removed.
Editing the injected CSS in DevTools is temporary: the next refresh replaces it
from the generated script. After installing a glow fix, re-run Enable Glow and
reload all open windows to update the installed script snapshot.

`synGlow` and `synKeyword` use 2/5/6/10px shadow stacks, with halo alpha
values `AA`/`88`/`44` and `AA`/`88`/`55` respectively.
`synConstant` uses 2/8/2px shadows with `AA`/`88` halo alpha;
`synParameter` uses 2/8/2px shadows with `72`/`72` halo alpha.
Strings have no glow.
Dark outlines and halos derive from `src/palette.js`; syntax foregrounds
stay unchanged. Customizations that recolor a token away from the four glowing palette colors
will exclude that token from glow. Equal neutral/glow palette colors are rejected
at build time because color-based discovery cannot distinguish them.

Supported target: macOS desktop VS Code `^1.85.0`. The patcher recognizes the
`electron-sandbox`/`electron-browser` and `workbench.html`/`workbench.esm.html`
layouts, but internal DOM and token styles are unsupported and can change within
that range. Web VS Code and non-macOS platforms have no glow support. Remote
workspaces use the local UI extension host. GPU/experimental editor rendering,
zoom, font choice, and grammar/provider differences can affect appearance;
use the normal DOM editor renderer when assessing glow.

See [reference research and architecture](docs/research.md).

The local publisher identifier is `madebyspook`; Marketplace ownership is not verified. Licensing remains **UNLICENSED / all rights reserved** until an explicit license is chosen. Neither blocks local VSIX use.

Official guidance: [color themes](https://code.visualstudio.com/api/extension-guides/color-theme), [semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide), [VSIX packaging](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions).
