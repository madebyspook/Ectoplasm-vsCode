# Changelog

## 0.7.4

- Renamed syntax color tokens to `synParameter`, `synGlow`, and `synKeyword` without changing colors, highlighting, or glow.

## 0.7.3

- Applied the finalized blue and purple glow radii and opacity values using palette-derived colors; removed strings from glow color generation.

## 0.7.2

- Strengthened blue and purple syntax glow with denser, wider shadow layers; matched accent glow to constant strength and removed string glow without changing syntax colors.

## 0.7.1

- Fixed syntax glow selectors to match nested token spans and retain the fix when highlighting regenerates the CSS.
- Rebind glow observers after workbench/token stylesheet replacement and restore a removed glow style during theme refreshes.

## 0.7.0

- Added optional macOS syntax glow with SynthWave '84 shadow layers, generated from Ectoplasm's existing palette without changing syntax foregrounds or workbench styling.
- Added Enable Glow and Disable Glow commands, explicit installation-patch consent, reversible marked injection, and update detection without automatic reinstallation.

## 0.6.1

- Removed the automated test suite and npm test script; retained theme builds, JSON validation, packaging, and local installation.

## 0.6.0

- Simplified syntax to primary text, muted comments, and the existing accent-derived green string contents; retained primary string/interpolation punctuation and removed unused syntax colors.

## 0.5.1

- Fixed readonly variable highlighting and kept standard-library objects primary; aligned TextMate const bindings with semantic variable colors and covered Python call names.

## 0.5.0

- Applied the accent-derived syntax hierarchy to TextMate and semantic categories, with primary-colored fallback syntax, constants, properties, and string punctuation.

## 0.4.1

- Replaced visual regression expectations with technical palette and theme validation, allowing manual color adjustments without changing tests.

## 0.3.1

- Fixed local installation to rebuild, validate, and package before force-installing the current VSIX, including same-version reinstalls.
- Updated regression expectations for the current surface scales and primary syntax with green strings, muted comments, and primary string punctuation; preserved palette and workbench colors.
- Added a primary semantic fallback and restored palette input validation.

## 0.3.0

- Added accent-derived blue/cyan syntax colors with periwinkle keywords, restrained lavender types, desaturated mint strings, cyan constants, and muted red invalid/deprecated tokens with aligned TextMate and semantic categories.
- Added representative language samples and syntax validation; preserved the existing workbench colors and palette configuration.

## 0.2.0

- Applied existing Ectoplasm design tokens across editor surfaces, navigation, window chrome, panels, terminal, controls, widgets, lists, selections, and scrollbars.
- Preserved syntax rules, palette configuration, and color calculations; updated regression validation to protect syntax while allowing workbench changes.

## 0.1.0

- Added configurable Ectoplasm design tokens using small, dependency-free HSL, RGB mixing, and alpha helpers in the palette module; existing interface colors and syntax highlighting are unchanged.
- Added focused design-token and unchanged-theme regression tests to validation and packaging.

## 0.0.3

- Renamed the VS Code project, extension, theme, generated theme file, and VSIX to Ectoplasm; theme colors and highlighting are unchanged.

## 0.0.2

- Extracted palette, workbench, and syntax sources into native JavaScript modules without changing theme values.
- Added deterministic generation, native watch mode, stale-output checks, and rebuilds before preview and packaging.

## 0.0.1

- Initial declarative dark theme foundation, preview samples, validation, and local packaging workflow.
- Documented reference research and optional glow architecture; no glow implementation.
