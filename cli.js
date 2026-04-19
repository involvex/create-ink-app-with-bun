#!/usr/bin/env node
import process from 'node:process'
import hasFlag from 'has-flag'
import prompts from 'prompts'
import path from 'node:path'
import meow from 'meow'

import createInkApp from './index.js'
import pkg from './package.json' with {type: 'json'}

if (hasFlag('about') || hasFlag('--about')) {
	console.log(pkg.name, 'v', pkg.version)
	console.log(pkg.author.name)
	console.log(pkg.description)
	console.log(pkg.repository.url)
	console.log(pkg.sponsor.url)
	process.exit(0)
} else if (
	hasFlag('version') ||
	hasFlag('--version') ||
	hasFlag('v') ||
	hasFlag('-v')
) {
	console.log(pkg.version)
	process.exit(0)
}

const cli = meow(
	`
Options
	--no-git-init		Skip git initialization
	--no-install		Skip dependency installation
	--skip-prompts		Use defaults for all options
	--help			Show help
	--version		Show version
	--about			Show about

Usage
	$ create-ink-app-with-bun <project-directory>

Examples
	$ create-ink-app-with-bun my-cli
	$ create-ink-app-with-bun .
	$ create-ink-app-with-bun my-cli --no-git-init --no-install
`,
	{
		importMeta: import.meta,
		flags: {
			gitInit: {
				type: 'boolean',
				default: true,
			},
			install: {
				type: 'boolean',
				default: true,
			},
			skipPrompts: {
				type: 'boolean',
				default: false,
			},
			help: {
				type: 'boolean',
			},
			version: {
				type: 'boolean',
			},
			about: {
				type: 'boolean',
			},
		},
	},
)

const projectDirectoryPath = path.resolve(process.cwd(), cli.input[0] || '.')

try {
	const useDefaults = cli.flags.skipPrompts

	const promptsOptions = useDefaults
		? {
				author: 'author',
				license: 'MIT',
				description: 'A modern CLI app built with Ink and Bun',
				components: [],
			}
		: await prompts([
				{
					type: 'text',
					name: 'author',
					message: 'Who is the author?',
					initial: 'author',
				},
				{
					type: 'text',
					name: 'license',
					message: 'What is the license?',
					initial: 'MIT',
				},
				{
					type: 'text',
					name: 'description',
					message: 'Package description?',
					initial: 'A modern CLI app built with Ink and Bun',
				},
				{
					type: 'multiselect',
					name: 'components',
					message: 'Select additional TUI components to install:',
					hint: 'Space to select, Enter to confirm',
					choices: [
						{
							title: 'ink-spinner',
							description: 'Loading animations',
							value: 'ink-spinner',
						},
						{
							title: 'ink-progress-bar',
							description: 'Progress indicators',
							value: 'ink-progress-bar',
						},
						{
							title: 'ink-table',
							description: 'Data tables display',
							value: 'ink-table',
						},
						{
							title: 'ink-box',
							description: 'Bordered containers',
							value: 'ink-box',
						},
						{
							title: 'chalk',
							description: 'Color utilities (for text gradients)',
							value: 'chalk',
						},
						{
							title: 'ink-big-text',
							description: 'ASCII big text display',
							value: 'ink-big-text',
						},
					],
				},
			])

	await createInkApp(projectDirectoryPath, {
		...cli.flags,
		author: promptsOptions.author,
		license: promptsOptions.license,
		description: promptsOptions.description,
		components: promptsOptions.components,
	})

	const pkgName = path.basename(projectDirectoryPath)
	const relativePath = path.relative(process.cwd(), projectDirectoryPath)

	console.log(
		[
			'',
			`Ink app created in ${relativePath ?? 'the current directory'}:`,
			relativePath ? `  $ cd ${relativePath}` : undefined,
			relativePath ? '' : undefined,
			'Build:',
			'  $ bun run build',
			'',
			'Watch and rebuild:',
			'  $ bun run dev',
			'',
			'Run:',
			`  $ ${pkgName}`,
			'',
		]
			.filter(line => line !== undefined)
			.map(line => `  ${line}`)
			.join('\n'),
	)
} catch (error) {
	console.error(error.stack)
	process.exit(1)
}
