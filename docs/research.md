# Reference research and glow architecture

Reviewed on 5 November 2026. Links below pin the inspected source revisions; these are architectural findings, not runtime compatibility tests of the reference extensions.

## Established themes

| Reference | Implementation and workflow | Lesson for Ectoplasma |
| --- | --- | --- |
| One Monokai | A manifest contributes one static JSON theme. The JSON combines workbench `colors` with broad and language-specific TextMate `tokenColors`; no explicit semantic opt-in or semantic rule block appears in the inspected file. No runtime entrypoint or build scripts in its manifest. | Closest fit for a single editable foundation. Add explicit semantic support. |
| One Dark Pro | TypeScript generators emit multiple theme JSON variants. Theme construction merges token configurations, emits workbench colors, enables semantics, and adds explicit semantic selectors. Its development workflow builds Sass, themes, TypeScript, and a web bundle; packaging uses vsce. The extension also provides runtime customization. | Coordinate semantic and TextMate rules, but defer generators, variants, runtime settings, and bundlers until needed. |
| GitHub Theme | JavaScript maps Primer colors to workbench and TextMate rules and generates multiple dark/light/contrast/colorblind JSON variants. Semantic highlighting is enabled; the inspected main theme builder relies on TextMate scope fallback rather than an explicit `semanticTokenColors` block. A nodemon source watcher, build script, and vsce support development and packaging. | Derive surfaces from shared design tokens when the Ectoplasma palette is agreed; one handwritten file is sufficient now. |

Sources:

- One Monokai: [manifest](https://github.com/azemoh/vscode-one-monokai/blob/42444827bc178f289285bb9acc79066ecff18f83/package.json), [theme](https://github.com/azemoh/vscode-one-monokai/blob/42444827bc178f289285bb9acc79066ecff18f83/themes/OneMonokai-color-theme.json).
- One Dark Pro: [manifest and scripts](https://github.com/Binaryify/OneDark-Pro/blob/75c80ab18d90655e05ad837bb8d89f5e68d5ce53/package.json), [generator](https://github.com/Binaryify/OneDark-Pro/blob/75c80ab18d90655e05ad837bb8d89f5e68d5ce53/scripts/generate-theme.ts), [workbench and syntax construction](https://github.com/Binaryify/OneDark-Pro/blob/75c80ab18d90655e05ad837bb8d89f5e68d5ce53/src/themes/Theme.ts).
- GitHub Theme: [manifest and scripts](https://github.com/primer/github-vscode-theme/blob/cd78e5e4e7bcf132a6f428ae0f32264bb1b729cf/package.json), [variant generation](https://github.com/primer/github-vscode-theme/blob/cd78e5e4e7bcf132a6f428ae0f32264bb1b729cf/src/index.js), [workbench and syntax mapping](https://github.com/primer/github-vscode-theme/blob/cd78e5e4e7bcf132a6f428ae0f32264bb1b729cf/src/theme.js).

## Glow implementations

**Code Glow** registers enable/disable commands that write a script alongside VS Code's workbench and modify `workbench.html` to load it. That script reads `.vscode-tokens-styles`, targets a fixed list of generated `.mtkN` classes, and applies layered CSS `text-shadow`, with mutation observers for style changes. Those numeric classes represent generated color assignments, not stable language token identities. Its webpack/TypeScript extension and HTML-parser dependency are implementation choices Ectoplasma does not need. Sources: [installation patch](https://github.com/Xav1erSue/code-glow/blob/27134e3deb3b2d434df99ea2ea40d879d6aefe4c/src/extension.ts), [glow implementation](https://github.com/Xav1erSue/code-glow/blob/27134e3deb3b2d434df99ea2ea40d879d6aefe4c/src/script.js), [manifest](https://github.com/Xav1erSue/code-glow/blob/27134e3deb3b2d434df99ea2ea40d879d6aefe4c/package.json).

**SynthWave '84** contributes a normal standalone dark theme plus optional Neon Dreams commands. Enabling generates an injected script and patches the installed workbench HTML. The script gates effects on its theme, finds token stylesheet rules by selected colors, and adds text shadows and editor chrome CSS. It exposes brightness and disable-glow settings. Its source handles multiple internal workbench paths; its README explicitly describes file-write permissions, corruption warnings, and re-enabling after VS Code updates. Sources: [manifest and options](https://github.com/robb0wen/synthwave-vscode/blob/ecfa2fe1279f7233663fa3f98a96e6756000567b/package.json), [patch and removal commands](https://github.com/robb0wen/synthwave-vscode/blob/ecfa2fe1279f7233663fa3f98a96e6756000567b/src/extension.js), [theme-gated rendering](https://github.com/robb0wen/synthwave-vscode/blob/ecfa2fe1279f7233663fa3f98a96e6756000567b/src/js/theme_template.js), [limitations](https://github.com/robb0wen/synthwave-vscode/blob/ecfa2fe1279f7233663fa3f98a96e6756000567b/README.md).

Both use unsupported workbench modification. Code Glow's fixed file path and token classes, and SynthWave's DOM/style assumptions, create maintenance risks when VS Code changes internals. The same installation-file integrity concern applies to either patching approach; that is an inference from their write operations, not a tested Code Glow warning. Commands registered through the official API do not make the underlying injection supported.

## Recommendation

Keep the distributed Ectoplasma theme declarative and fully functional without glow. Supported workbench colors, TextMate styles, and semantic styles offer foreground colors and limited text formatting, with no supported token text-shadow/glow property. Brighter accents can suggest luminosity but cannot produce actual halo effects. See Microsoft's [color theme guide](https://code.visualstudio.com/api/extension-guides/color-theme), [semantic styling rules](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#theming), and [theme color reference](https://code.visualstudio.com/api/references/theme-color).

If actual glow is later approved, isolate it in a separate experimental companion project/package, disabled by default and absent from this VSIX. First agree on a user-controlled loading mechanism; do not add an installation patcher to the theme. Scope any experiment to the Ectoplasma editor and a few approved syntax categories, preserve the underlying foreground colors, and provide explicit enable/disable and removal steps. Avoid hardcoded numeric token classes; discovering runtime color rules is still fragile and can affect unrelated tokens that share a color.

No current approach examined provides actual editor text glow through supported theme APIs. A companion depending on custom CSS still has these limitations:

- Workbench CSS/scripts execute in a privileged renderer context and must be reviewed as code; this is not a sandboxed webview effect.
- Installation patching can trigger integrity warnings and require write permissions. Do not suppress checks, rewrite checksums, or recommend elevation as the normal workflow.
- DOM/style generation and application updates can break selectors or erase patches; desktop, web, remote, Stable, and Insiders behavior must be assessed separately.
- Glow needs readability and performance checks at different zoom levels, with semantic highlighting both on and off, and must cleanly disappear when disabled or another theme is selected.

This phase implements no injector, patch command, custom CSS, glow toggle, or runtime extension code.

## Next design phase

Read-only inspection of the local Discord `src/abstracts/_configuration.scss` and `_variables.scss`, and Notion `src/abstracts/_variables.scss`, confirms a shared `#3C86ff` accent, accent-derived surfaces/text, and selective glow. These projects remain unchanged. VS Code theme files accept hexadecimal colors, so CSS `oklch()` and `color-mix()` expressions will need conversion to concrete values after the palette is approved.

The starter deliberately uses a limited set of familiar VS Code Dark Modern/Dark+ colors instead of inventing Ectoplasma's final palette. Unspecified workbench colors retain VS Code's dark defaults. No reference theme was copied wholesale.

Remaining decisions: final surface/syntax token mapping and priority languages; whether to approve a separate glow experiment; a distribution license and verified Marketplace publisher only if public extension distribution is planned.
