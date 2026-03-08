# GEMINI.md - create-ink-app-with-bun

## Project Overview
`create-ink-app-with-bun` is a command-line utility designed to scaffold starter [Ink](https://github.com/vadimdemedes/ink) applications. It provides three primary templates:
- **Bun**: A specialized template for [Bun](https://bun.sh/), using TypeScript and JSX.
- **TypeScript**: A standard TypeScript/React starter for Ink.
- **JavaScript**: A basic ES modules-based JavaScript/React starter for Ink.

The tool automates project initialization, including file copying with variable injection (name, author, license), dependency installation, code formatting, and initial builds.

### Key Technologies
- **Ink**: React-based framework for building interactive CLIs.
- **Bun**: Fast JavaScript runtime used for the Bun template and local development.
- **Node.js**: The core tool is built to run on Node.js (>=16).
- **Meow**: CLI argument parsing.
- **Prompts**: Interactive user input for project configuration.
- **Listr**: Task-based progress reporting during scaffolding.
- **Ava**: Test runner for validating the scaffolding process.
- **XO & Prettier**: Linting and formatting standards.

## Project Structure
- `cli.js`: Entry point that handles CLI arguments and interactive prompts.
- `index.js`: Core logic for the scaffolding engine (`createInkApp` function).
- `templates/`: Boilerplate source files.
  - `_common/`: Files shared across all templates (e.g., `.gitignore`, `.editorconfig`).
  - `bun/`: Bun-specific starter with `bunfig.toml` and modern ESLint/Prettier setup.
  - `ts/`: TypeScript/React starter.
  - `js/`: JavaScript/React starter.
- `test.js`: Integration tests that verify scaffolding and execution for different templates.

## Building and Running
The project itself is managed with Bun/npm.

### Development Commands
- **Run Locally**: `bun run dev` (runs `cli.js`).
- **Run Tests**: `npm test` or `bun test` (runs `xo && ava`).
- **Linting**: `npx xo` (checks code style).
- **Formatting**: `npx prettier . --write` (formats the codebase).

### Scaffolded App Commands (Template-Specific)
- **Bun Template**:
  - `bun run dev`: Runs the app directly from source using `src/cli.tsx`.
  - `bun run build`: Transpiles TypeScript using `tsc`.
  - `bun run test`: Runs Ava tests with `ts-node` loader.
- **JS/TS Templates**:
  - `npm run dev`: Watches and rebuilds the project.
  - `npm run build`: Builds the project for distribution.
  - `npm run test`: Runs the test suite.

## Development Conventions
- **Code Style**: The project uses [XO](https://github.com/xojs/xo) with Prettier for linting and formatting. Templates are explicitly ignored by the root XO configuration to avoid linting conflicts with target project styles.
- **Testing**: Tests are executed serially (`test.serial` in Ava) because they involve creating temporary directories and performing global `npm link`/`unlink` operations which can collide if run in parallel.
- **Template Variables**: Templates use `%NAME%`, `%AUTHOR%`, and `%LICENSE%` placeholders which are replaced during the `copyWithTemplate` task in `index.js`.
- **ES Modules**: The project and its templates are strictly ES modules (`"type": "module"`).
