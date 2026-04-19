import replaceString from 'replace-string'
import {fileURLToPath} from 'node:url'
import {makeDirectory} from 'make-dir'
import process from 'node:process'
import fs from 'node:fs/promises'
import slugify from 'slugify'
import path from 'node:path'
import {execa} from 'execa'
import Listr from 'listr'

const copyWithTemplate = async (from, to, variables) => {
	const dirname = path.dirname(to)
	await makeDirectory(dirname)

	const source = await fs.readFile(from, 'utf8')
	let generatedSource = source

	if (typeof variables === 'object') {
		generatedSource = replaceString(source, '%NAME%', variables.name)
		generatedSource = replaceString(
			generatedSource,
			'%AUTHOR%',
			variables.author,
		)
		generatedSource = replaceString(
			generatedSource,
			'%LICENSE%',
			variables.license,
		)
		generatedSource = replaceString(
			generatedSource,
			'%DESCRIPTION%',
			variables.description || '',
		)
	}

	await fs.writeFile(to, generatedSource)
}

const createInkApp = (
	projectDirectoryPath = process.cwd(),
	{silent, author, license, description, gitInit = true, install = true},
) => {
	const pkgName = slugify(path.basename(projectDirectoryPath))

	const execaInDirectory = (file, args, options = {}) =>
		execa(file, args, {
			...options,
			cwd: projectDirectoryPath,
		})

	const __dirname = path.dirname(fileURLToPath(import.meta.url))

	const templatePath = 'templates/bun'

	const fromPath = file =>
		path.join(path.resolve(__dirname, templatePath), file)

	const toPath = (rootPath, file) => path.join(rootPath, file)

	const tasks = new Listr(
		[
			{
				title: 'Copy files',
				task() {
					return new Listr([
						{
							title: 'Template files',
							async task() {
								const variables = {
									name: pkgName,
									author: author || '',
									license: license || 'MIT',
									description: description || '%DESCRIPTION%',
								}

								await copyWithTemplate(
									fromPath('_package.json'),
									toPath(projectDirectoryPath, 'package.json'),
									variables,
								)

								await copyWithTemplate(
									fromPath('readme.md'),
									toPath(projectDirectoryPath, 'readme.md'),
									variables,
								)

								await fs.cp(
									fromPath('src'),
									toPath(projectDirectoryPath, 'src'),
									{recursive: true},
								)

								await copyWithTemplate(
									fromPath('src/cli.tsx'),
									toPath(projectDirectoryPath, 'src/cli.tsx'),
									variables,
								)

								await fs.copyFile(
									fromPath('_gitignore'),
									toPath(projectDirectoryPath, '.gitignore'),
								)
								await fs.copyFile(
									fromPath('_prettierignore'),
									toPath(projectDirectoryPath, '.prettierignore'),
								)
								await fs.copyFile(
									fromPath('tsconfig.json'),
									toPath(projectDirectoryPath, 'tsconfig.json'),
								)

								await fs.copyFile(
									fromPath('bunfig.toml'),
									toPath(projectDirectoryPath, 'bunfig.toml'),
								)

								await fs.copyFile(
									fromPath('eslint.config.mjs'),
									toPath(projectDirectoryPath, 'eslint.config.mjs'),
								)
							},
						},
					])
				},
			},
			{
				title: 'Install dependencies',
				enabled: () => install,
				async task() {
					await execaInDirectory('bun', ['install'])
				},
			},
			{
				title: 'Format code',
				task() {
					return execaInDirectory('bun', ['run', 'format'])
				},
			},
			{
				title: 'Build',
				task() {
					return execaInDirectory('bun', ['run', 'build'])
				},
			},
			{
				title: 'Link executable',
				enabled: () => install,
				async task(_, task) {
					try {
						await execaInDirectory('npm', ['link'])
					} catch {
						task.skip('`npm link` failed, try running it yourself')
					}
				},
			},
			{
				title: 'Initialize git repository',
				enabled: () => gitInit,
				async task() {
					await execaInDirectory('git', ['init'])
				},
			},
		],
		{
			renderer: silent ? 'silent' : 'default',
		},
	)

	return tasks.run()
}

export default createInkApp
