# Copilot guidance for create-ink-app-with-bun

Purpose
- Provide concise, repo-specific instructions for Copilot sessions: how to build/test/lint, the big-picture architecture, and repository conventions Copilot should know when making changes.

---

Build / test / lint (repository root)
- Install dependencies:
  - npm: `npm install`
  - bun: `bun install` (when working with the Bun template or using Bun locally)
- Run the CLI locally (development):
  - Preferred (uses Bun as configured): `bun run dev` (runs the CLI entry script)
  - Alternative: run the entrypoint directly with Node: `node cli.js` (requires Node >=16 and dependencies installed)
- Run tests (root): `npm test` (runs `xo && ava` per package.json). `bun test` will also run package test script if using Bun.
- Run a single test file with Ava: `npx ava path/to/test-file.js` (e.g., `npx ava test.js`).
- Lint: `npx xo` (XO is configured in package.json; templates are excluded from linting).
- Format: `npx prettier --write .` (templates are copied into created projects and formatting may vary per template).

Notes about generated projects (template-specific)
- Bun template (templates/bun): use Bun commands inside the generated project: `bun run dev`, `bun run build`, `bun run test`.
- JS / TS templates: use npm scripts inside the generated project: `npm run dev`, `npm run build`, `npm test`.
- To try the generated CLI locally: after scaffold completes run `npm link` (the generator attempts this), then invoke the linked binary by package name or use `npx <pkg>`.

---

High-level architecture (big picture)
- Entrypoint: `cli.js` — parses flags (meow), prompts for author/license (prompts), resolves target path, and delegates to the scaffolder.
- Core scaffolder: `index.js` — exports `createInkApp(projectDir, options)`. This function:
  - Chooses the template directory (templates/bun | templates/ts | templates/js)
  - Uses a small `copyWithTemplate()` helper to replace placeholders in files
  - Builds a Listr task list that performs: copying files, installing dependencies (npm or bun), formatting, building, and linking
  - Uses `execa` to run external commands inside the generated project (helper `execaInDirectory`)
- Templates: `templates/` contains three main template sets plus `_common/` shared files. Files named with a leading underscore (e.g., `_gitignore`, `_package.json`) are mapped into dotfiles and package files when copied.
- Tests: `test.js` contains integration tests that:
  - Create temporary directories (tempy)
  - Invoke `createInkApp()` to scaffold projects
  - Link/unlink the generated package globally (execa + npm link) and run the installed binary to assert behavior (ava, strip-ansi)
  - Tests run serially to avoid collisions caused by global linking/unlinking
- Config & standards: package.json sets `"type": "module"`, XO + Prettier are configured; `engines.node` requires Node >=16.

---

Key repository conventions / patterns Copilot should follow
- Template placeholders: Templates use `%NAME%`, `%AUTHOR%`, and `%LICENSE%`. Updates that introduce new placeholders must be handled by `copyWithTemplate()` in `index.js`.
- Underscore file convention: Files under templates named with a leading underscore map to target filenames (e.g., `_gitignore` -> `.gitignore`, `_package.json` is used as the generated package.json). Keep that mapping consistent when adding new template files.
- Template selection flags: `--bun` or `--template bun` selects the Bun template; `--typescript` selects the TS template otherwise JS is used.
- Bun vs npm flow: The scaffolder runs different commands depending on `useBun`. When modifying install/format/build steps, update the Listr tasks in `index.js` (look for `Install dependencies`, `Format code`, `Build`).
- Be cautious with global linking: tests rely on `npm link`/`npm unlink` in temporary directories — changing that behavior requires updating `test.js` and preserving serial execution.
- Copy strategy for Bun template: the bundler uses `fs.cp(..., { recursive: true })` for `src` and then overwrites files requiring variable substitution (e.g., `src/cli.tsx`) via `copyWithTemplate`.
- Linting scope: `xo` is configured to ignore `templates/**` to avoid linting generated templates inside this repo; changes to the root XO config may need to preserve that ignore.

---

Where to look when asked to change build/test behavior
- `package.json` (scripts & dependencies)
- `index.js` (Listr tasks, `execaInDirectory`, `copyWithTemplate` logic)
- `cli.js` (flag parsing and prompts)
- `templates/` (actual files copied to generated projects; `_common/` for shared dotfiles)
- `test.js` (integration test patterns and expectations)

---

Useful quick search terms for Copilot sessions
- `copyWithTemplate` — search to find where placeholders are applied
- `templates/bun` | `templates/ts` | `templates/js` — for template-specific files
- `Listr` / `Install dependencies` / `Link executable` — to find task flow in `index.js`
- `tempy` / `npm unlink` / `test.serial` — to find test-related constraints and cleanup logic

---

Related docs incorporated
- README.md: basic usage examples (`npx create-ink-app my-cli`) and demo
- GEMINI.md: project overview, template descriptions, and template-specific commands (copied into this guidance where relevant)

---

If making changes that affect generated projects, remember:
- Update `index.js` Listr tasks if build/install steps change.
- Update `test.js` if the generator's install/link behavior or produced binary name changes.
- Maintain the placeholder replacement rules and underscore-to-dotfile mapping.


