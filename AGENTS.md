# AGENTS.md — Ectoplasm VS Code

## Project Overview

Ectoplasm is a custom dark Visual Studio Code theme, part of the Made by Spook ecosystem.

It shares its visual identity with the Ectoplasm themes for Discord and Notion.

- Repository: `Ectoplasm-vsCode`
- Extension display name: Ectoplasm
- Theme type: Dark
- Distribution: VS Code extension (VSIX)
- Primary platform: macOS

## Design Guidelines

- Near-black, blue-tinted backgrounds.
- Electric-blue accents with selective neon glow.
- Consistent visual identity across the Ectoplasm theme family.
- Clear visual hierarchy between editor, sidebar, panels, tabs, and menus.
- Readable syntax highlighting with distinct but balanced accent colors.
- Minimal visual clutter and unnecessary decoration.

### Color Palette

The central palette is defined in `src/palette.js`.

Primary colors:

- `electric`: `#3C86FF` — primary blue accent
- `cosmic`: `#4545D9` — saturated purple-blue
- `ice`: `#00D9F5` — cyan-blue
- `plasma`: `#F044C8` — magenta
- `neon`: nearly white, icy-blue highlight derived from electric

Use existing palette tokens and helpers rather than duplicating color values.

Do not change the established visual identity unless explicitly requested.

## Project Architecture

The project uses native ES modules to generate the VS Code theme and optional glow functionality.

### Source Files

- `src/palette.js` — Shared color palette, color utilities, and glow color definitions.
- `src/workbench.js` — VS Code workbench and editor UI colors.
- `src/syntax.js` — TextMate and semantic syntax highlighting.
- `src/glow.js` — Optional syntax and cursor glow generation.
- `scripts/build.mjs` — Generates theme JSON and glow scripts.
- `runtime/` — Optional glow enable/disable functionality.
- `package.json` — Extension metadata, theme registration, and development commands.

### Generated Files

- `themes/` — Generated VS Code theme JSON.
- `glow/` — Generated glow injection script.
- `.dev-extension/` — Local development theme registration.
- `ectoplasm.vsix` — Packaged extension.

Generated files are ignored by Git.

Edit source files rather than generated output.

## Development Workflow

### Requirements

- Node.js 22+
- npm
- VS Code 1.85+

### Commands

- `npm ci` — Install development dependencies.
- `npm run build` — Generate theme and glow files.
- `npm run dev:link` — Register the local Ectoplasm Dev theme.
- `npm run watch` — Rebuild automatically when source files change.
- `npm run check` — Validate generated glow, runtime, and setup script syntax.
- `npm run package` — Build and package the VSIX.
- `npm run install:local` — Package and install the production extension.

### Live Theme Development

The project supports live color updates directly in the main VS Code editor.

Setup:

1. Run `npm run dev:link`.
2. Reload VS Code once.
3. Select the `Ectoplasm Dev` color theme.
4. Start `npm run watch`.
5. Edit and save source files to see theme changes.

The development theme uses VS Code's internal `_watch` functionality.

The development theme does not include optional glow injection.

Preserve this workflow when modifying build scripts, theme registration, or development tooling.

## Syntax Highlighting

Use VS Code's standard syntax highlighting mechanisms:

- TextMate token scopes
- Semantic token colors

Syntax colors are defined centrally in `src/palette.js` and assigned in `src/syntax.js`.

Keep syntax categories visually consistent across languages.

Avoid overly broad TextMate selectors that unintentionally override unrelated syntax.

Preserve existing distinctions between keywords, functions, variables, parameters, constants, strings, and properties unless explicitly requested.

## Optional Glow

The standard Ectoplasm theme must work independently of the optional glow functionality.

Glow is implemented through a separately generated script injected into the VS Code workbench.

- `src/glow.js` defines glow generation and injection behavior.
- `runtime/` manages explicit glow enable/disable operations.
- Glow applies to selected syntax colors and the editor cursor.
- Syntax glow uses foreground-color matching to identify token classes.
- Cursor glow uses a nearly white foreground with an electric-blue halo.
- Glow is optional and intended for the supported macOS environment.

### Constraints

- Do not automatically enable or inject glow.
- Keep glow functionality separate from the standard theme.
- Preserve explicit enable/disable behavior and cleanup.
- Preserve theme-specific CSS scoping.
- Avoid applying glow indiscriminately to all syntax.
- Do not modify VS Code installation files outside the existing approved glow workflow.
- Do not introduce additional integrity or security workarounds without explicit approval.

The glow system uses unsupported workbench modifications and may trigger VS Code integrity warnings.

## Packaging

- `package.json` defines extension metadata and theme contributions.
- `package-lock.json` maintains dependency versions.
- `.vscodeignore` excludes development files from the packaged extension.
- Generated theme files must be included in the VSIX.
- Source modules and development utilities should not be shipped unless required.

The production extension and local development theme must remain independent.

## Project-Specific Constraints

- Do not modify other Ectoplasm repositories.
- Preserve the current live development workflow.
- Keep the production theme functional without glow.
- Preserve the existing glow lifecycle when modifying injection logic.
- Keep the repository minimal, with no automated test infrastructure.
- Do not introduce unnecessary dependencies, compatibility layers, or fallback implementations.
- Keep documentation limited to information needed to maintain and develop the project.

Global Codex instructions govern Git workflow, commits, pull requests, versioning, coding conventions, and validation.