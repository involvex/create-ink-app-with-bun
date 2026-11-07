import { test, expect } from 'bun:test'
import { temporaryDirectoryTask } from 'tempy'
import createInkApp from './index.js'
import stripAnsi from 'strip-ansi'
import { deleteAsync } from 'del'
import { execa } from 'execa'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bunTemplatePath = path.join(__dirname, 'templates', 'bun')

test('bun template includes required files', async () => {
	const requiredFiles = [
		'_package.json',
		'readme.md',
		'_gitignore',
		'_prettierignore',
		'tsconfig.json',
		'bunfig.toml',
		'eslint.config.mjs',
		path.join('src', 'cli.tsx'),
	]

	for (const file of requiredFiles) {
		const filePath = path.join(bunTemplatePath, file)
		await fs.access(filePath)
	}
})

test('bun template bunfig.toml parses', async () => {
	await temporaryDirectoryTask(async (temporaryDirectory) => {
		await fs.copyFile(
			path.join(bunTemplatePath, 'bunfig.toml'),
			path.join(temporaryDirectory, 'bunfig.toml'),
		)
		await fs.writeFile(
			path.join(temporaryDirectory, 'package.json'),
			JSON.stringify({ name: 'tmp', private: true }),
		)

		await execa('bun', ['-e', 'process.exit(0)'], {
			cwd: temporaryDirectory,
		})
	})
})

test('bun template placeholders are present', async () => {
	const pkg = await fs.readFile(path.join(bunTemplatePath, '_package.json'), 'utf8')
	const readme = await fs.readFile(path.join(bunTemplatePath, 'readme.md'), 'utf8')
	const cli = await fs.readFile(path.join(bunTemplatePath, 'src', 'cli.tsx'), 'utf8')

	expect(pkg).toContain('%NAME%')
	expect(pkg).toContain('%AUTHOR%')
	expect(readme).toContain('%NAME%')
	expect(cli).toContain('%NAME%')
})

const temporaryProjectTask = async (type, callback) => {
	await temporaryDirectoryTask(async (temporaryDirectory) => {
		const projectDirectory = path.join(temporaryDirectory, `test-${type}-app`)
		await deleteAsync(projectDirectory)

		try {
			await callback(projectDirectory)
		} finally {
			await execa('npm', ['unlink', '--global', `test-${type}-app`]).catch(() => {})
		}
	})
}

test.skip('bun app scaffolds and runs (integration)', async () => {
	await temporaryProjectTask('bun', async (projectDirectory) => {
		await createInkApp(projectDirectory, {
			silent: true,
		})

		await execa('bun', ['-e', 'process.exit(0)'], {
			cwd: projectDirectory,
		})

		const result = await execa('test-bun-app')
		expect(stripAnsi(result.stdout).trim()).toBe('Hello, Stranger')

		await execa('bun', ['run', 'typecheck'], {
			cwd: projectDirectory,
		})
	})
})
