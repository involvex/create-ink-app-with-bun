# AGENTS.md - Agent Guidance for create-ink-app-with-bun

Build/lint/test commands and code style guidelines for this repository.

## Build / Test / Lint Commands

### Installation

```bash
npm install   # or: bun install
```

### Development

```bash
bun run dev            # Preferred - runs CLI via Bun
node cli.js            # Alternative - run with Node >=16
```

### Testing

```bash
npm test               # Runs: xo && ava
bun test               # Also runs package test script
npx ava test.js        # Run single test file with Ava
```

### Linting

```bash
npx xo                 # XO ignores templates/** per package.json
```

### Formatting

```bash
npx prettier --write .
```

---

## Code Style Guidelines

### General Rules

- **Module system**: ES Modules (`"type": "module"`)
- **Node version**: Requires Node >=16
- **Formatting**: XO + Prettier (2-space indent, single quotes, no trailing commas)

### Imports

- Use named imports where possible
- Include `.js` extension for local imports
- JSON imports: `import pkg from './package.json' with {type: 'json'}`

```javascript
import createInkApp from './index.js'
import path from 'node:path'
import {execa} from 'execa'
```

### Naming Conventions

- **Functions/variables**: camelCase
- **Components**: PascalCase
- **Constants**: SCREAMING_SNAKE
- **Files**: kebab-case
- **Template placeholders**: `%NAME%`, `%AUTHOR%`, `%LICENSE%`

### Error Handling

- Use try/catch for async operations
- Log errors with `console.error(error.stack)` before `process.exit(1)`
- Graceful degradation: use `task.skip()` for optional failures

```javascript
try {
	// ... operations
} catch (error) {
	console.error(error.stack)
	process.exit(1)
}
```

---

## Architecture

### Entry Points

- `cli.js` - CLI entry; parses flags (meow), prompts for author/license, delegates to scaffolder
- `index.js` - Core scaffolder; exports `createInkApp(projectDir, options)`

### Core Flow

1. `copyWithTemplate()` replaces placeholders in files
2. Template selection based on flags (`--bun`, `--typescript`)
3. Listr task list: Copy files → Install deps → Format → Build → Link

### Templates

- `templates/bun/` - Bun + TypeScript + React
- `templates/ts/` - npm + TypeScript + React
- `templates/js/` - npm + JavaScript + Preact
- `templates/_common/` - Shared files

### Tests

- `test.js` - AVA integration tests; use `tempy` for temp directories
- Tests run serially (`test.serial`) to avoid npm link collisions

---

## Repository Conventions

### Template Placeholders

Add new placeholders by updating `copyWithTemplate()` in `index.js`.

### Underscore File Convention

Files with leading underscore map to dotfiles: `_gitignore` → `.gitignore`

### Template Selection Flags

- `--bun` or `--template bun` → Bun template
- `--typescript` → TypeScript template
- Default → JavaScript template

### Bun vs npm Flow

Modify Listr tasks in `index.js` when changing install/format/build steps.

---

## Generated Projects

### Bun Template

```bash
bun run dev     # Watch and rebuild
bun run build   # Production build
bun run test    # Run tests
```

### JS/TS Templates

```bash
npm run dev     # Watch and rebuild
npm run build   # Production build
npm test        # Run tests
```

After scaffolding, run `npm link` in generated directory to test CLI locally.

---

## Useful Search Terms

- `copyWithTemplate` - Placeholder replacement logic
- `templates/bun | templates/ts | templates/js` - Template files
- `Listr` / `Install dependencies` / `Link executable` - Task flow
- `tempy` / `npm unlink` / `test.serial` - Test constraints
