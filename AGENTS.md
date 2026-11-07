# AGENTS.md — Ectoplasm VS Code

## Project Overview

Ectoplasm is a custom dark theme for Visual Studio Code, part of the
Made by Spook ecosystem.

The theme shares its visual identity with Ectoplasma for Discord and Notion.

### Project Identity

- Repository: Ectoplasm-vsCode
- Extension display name: Ectoplasm
- Theme name: Ectoplasm
- Theme type: Dark
- Platform: Visual Studio Code
- Distribution: VS Code extension (VSIX)

The current theme uses an accent-derived dark palette with optional macOS
syntax glow. The final visual identity remains under development.

### Design Goals

- Dark interface with a consistent blue-hued color palette.
- Visual consistency with the Discord and Notion themes.
- Clear hierarchy between editor, sidebar, panels, tabs, and menus.
- Readable syntax highlighting with carefully selected accent colors.
- Selective glowing text effects without compromising readability.
- Minimal visual clutter and unnecessary decoration.

The existing Ectoplasma themes serve as visual references.
Do not invent or significantly change the established visual identity
without explicit instructions.

---

## Development Workflow

### Branching

- Never make development changes directly on `main`.
- Create a dedicated feature branch for each task or related group of changes.
- Use descriptive branch names, such as:
  - `feature/syntax-highlighting`
  - `feature/workbench-colors`
  - `fix/inactive-tab-contrast`
  - `refactor/theme-structure`
- Do not merge branches automatically.
- Do not delete branches unless explicitly requested.

### Commits

- Do not automatically commit changes.
- Do not automatically push changes.
- Leave all modifications uncommitted for review.
- After completing a task, suggest a concise commit message.
- Only commit, push, or merge when explicitly instructed.

### Version Management

- Follow Semantic Versioning (`MAJOR.MINOR.PATCH`).
- The authoritative version number is defined in `package.json`.
- Increment the version number for every completed development task
  that introduces changes to the extension.
- Use the following rules:
  - PATCH: Bug fixes, minor styling adjustments, and refinements.
  - MINOR: New features, significant visual changes, or new styling support.
  - MAJOR: Breaking changes or substantial redesigns.
- During initial development, use `0.x.x` versions.
- Do not increment the version for documentation-only changes.
- When multiple related changes are performed as part of one task,
  increment the version only once, using the highest applicable category.
- Update all files referencing the extension version to remain consistent.
- Never modify historical version numbers or existing Git tags.
- Do not create Git tags or releases unless explicitly requested.
- Include the new version number in the task completion summary.
- Version changes must remain uncommitted alongside the task changes.

### Scope

- Modify only files relevant to the current task.
- Do not perform unrelated refactoring or cleanup.
- Preserve existing behavior unless changes are explicitly requested.
- Avoid unnecessary abstractions, dependencies, and complexity.
- Prefer small, maintainable changes over large rewrites.
- Do not modify other Ectoplasma repositories.

### Documentation

- Keep documentation concise and relevant.
- Update existing documentation when functionality or workflows change.
- Do not create documentation files unless they serve a clear purpose.
- Do not create task summaries, migration notes, or temporary reports
  as repository files unless explicitly requested.
- Communicate task results directly in the final response.

---

## Project Architecture

Use the standard VS Code color theme extension architecture.

Expected structure:

    Ectoplasm-vsCode/
    ├── AGENTS.md
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── CHANGELOG.md
    ├── LICENSE
    ├── .gitignore
    ├── .vscodeignore
    ├── .vscode/
    │   ├── launch.json
    │   ├── settings.json
    │   └── tasks.json
    ├── docs/
    │   └── research.md
    ├── samples/
    │   ├── preview.html
    │   ├── preview.md
    │   └── preview.ts
    ├── scripts/
    │   ├── build.mjs
    │   └── check.mjs
    ├── src/
    │   ├── palette.js
    │   ├── workbench.js
    │   └── syntax.js
    └── themes/
        └── Ectoplasm-color-theme.json

The actual project structure may evolve as development progresses.

### Local Commands

- Requires Node.js 22+, npm, and VS Code 1.85+.
- Run `npm ci` to install the locked development dependencies.
- Run `npm run build` to generate the theme once, or `npm run watch` to build
  on startup and rebuild when source modules change using Node's native watcher.
- Open the repository in VS Code and press F5 using **Preview Ectoplasm**;
  its pre-launch task builds the theme first.
  Select **Ectoplasm** in the Extension Development Host's Color Theme picker.
- Edit `src/palette.js`, `src/workbench.js`, or `src/syntax.js`; with watch mode
  running, saved changes regenerate the theme and update the host live.
- Run `npm run check` for read-only validation of the generated theme, manifest,
  configuration JSON, color values, token settings, and optional runtime manifest,
  including a stale-output check. Run `npm run build` first after source changes.
- Run `npm run package` to rebuild, validate, and create the ignored `ectoplasm.vsix`.
- Run `npm run install:local` to install that VSIX using the `code` CLI,
  or use **Extensions: Install from VSIX…** in VS Code.
- Optional macOS glow commands live in `runtime/` and use no runtime dependencies.
  The base theme works independently. The only direct
  development dependency is `@vscode/vsce`, with a patched `minimatch` override.
- `.vscodeignore` excludes development files, including this file, from the VSIX.

### Source of Truth

- `package.json` defines extension metadata and theme registration.
- `src/palette.js` is authoritative for shared color values.
- `src/workbench.js` maps workbench color keys to the palette.
- `src/syntax.js` defines TextMate and semantic token rules using the palette.
- `scripts/build.mjs` combines those native ES modules into the theme JSON.
- `src/glow.js` generates the separate `glow/ectoplasm-glow.js` renderer script
  from palette-derived shadow colors. `runtime/` handles explicit enable/disable.
- `themes/Ectoplasm-color-theme.json` is tracked generated output. Regenerate
  it with source changes; never edit it manually.
- The ignored VSIX is a packaging artifact; source modules are not shipped.

Do not manually edit generated files when source files are available.

---

## Theme Development

### Workbench Colors

Use the official VS Code theme color API.

Customize interface elements through the theme's `colors` definitions.

Relevant areas include:

- Editor
- Sidebar
- Activity Bar
- Status Bar
- Title Bar
- Tabs
- Panels
- Terminal
- Menus
- Notifications
- Inputs and selections

Maintain consistent surface colors and visual hierarchy.

Avoid unnecessary variations of nearly identical colors.

### Syntax Highlighting

Use standard VS Code theme mechanisms:

- TextMate token scopes
- Semantic token colors

Prioritize readability and consistent syntax categories.

Avoid excessive color variation.

Ensure syntax highlighting remains usable across different
programming languages.

Do not override semantic highlighting unnecessarily.

### Color Management

- Prefer a centralized palette when technically practical.
- Avoid scattering duplicate color values across multiple source files.
- Use descriptive names for shared colors.
- Keep the final theme compatible with VS Code's supported JSON format.
- Do not introduce a build system solely for color variables unless
  it provides a meaningful maintenance benefit.

### Glow Effects

Glowing text is an optional visual enhancement.

The standard theme must remain fully functional without glow.

Rules:

- Prefer officially supported VS Code APIs.
- Keep unsupported CSS modifications separate from the theme.
- Do not inject custom CSS automatically.
- Do not modify VS Code installation files without explicit approval.
- Do not introduce security or integrity workarounds without explaining
  their implications and obtaining approval.
- Preserve readability when glow is enabled.
- Avoid applying glow indiscriminately to all text.

Investigate existing implementations before introducing a glow system.

Reference projects:

- Xav1erSue/code-glow
- robb0wen/synthwave-vscode

---

## Code Quality

### General

- Follow existing project conventions.
- Keep configuration files readable and consistently formatted.
- Avoid unnecessary dependencies.
- Prefer supported, stable VS Code extension APIs.
- Do not introduce deprecated APIs when supported alternatives exist.
- Preserve compatibility with the VS Code versions declared in
  `package.json`.

### Theme Files

- Use valid JSON or JSONC only where supported.
- Keep color definitions organized logically.
- Avoid duplicate keys.
- Avoid unused token definitions.
- Do not remove existing styling without checking its purpose.
- Preserve intentional exceptions to general styling rules.

### Dependencies

- Keep runtime dependencies to a minimum.
- Prefer development dependencies for build and packaging tools.
- Do not add libraries without a clear technical reason.
- Do not introduce frameworks for functionality achievable through
  standard theme configuration.

---

## Testing & Validation

Before completing a task:

1. Validate modified JSON and configuration files.
2. Verify that the extension manifest remains valid.
3. Run applicable project validation or build commands.
4. Check for duplicate or invalid theme definitions.
5. Verify that changes do not introduce unrelated modifications.
6. Report any validation steps that could not be completed.

When relevant, test the theme using the VS Code Extension
Development Host.

For packaging-related changes, verify that the extension can
be packaged as a VSIX.

Do not claim visual validation unless the theme was actually
previewed in VS Code.

---

## Git Safety

- Never force-push.
- Never reset or discard uncommitted changes without permission.
- Never overwrite user modifications without checking them.
- Do not amend existing commits unless explicitly instructed.
- Do not change repository configuration without a clear reason.
- Do not perform destructive Git operations without approval.

---

## Task Completion

After completing a task, provide a concise summary containing:

1. What changed.
2. Relevant implementation details or decisions.
3. Validation performed and its results.
4. Any unresolved issues or limitations.
5. The new version number, if changed.
6. A suggested commit message.

Keep the summary proportional to the task.

Do not create a separate summary document.

---

## Guiding Principles

- Maintain consistency with the Ectoplasm visual identity.
- Prefer maintainability over clever implementations.
- Keep the standard theme independent of optional enhancements.
- Respect existing project architecture and conventions.
- Make only the changes necessary to fulfill the task.
- When requirements are ambiguous, ask rather than assume.
