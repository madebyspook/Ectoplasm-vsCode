# Changelog

## 0.6.1

- Removed the automated test suite and npm test script; retained theme builds, JSON validation, packaging, and local installation.

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
