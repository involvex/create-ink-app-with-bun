#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import meow from 'meow';
import prompts from 'prompts';
import createInkApp from './index.js';

const cli = meow(
	`
	Options
		--typescript		Use TypeScript React template
		--bun			Use Bun instead of npm
		--template		Specify a template (e.g. bun)

	Usage
		$ create-ink-app <project-directory>

	Examples
		$ create-ink-app my-cli
		$ create-ink-app .
		$ create-ink-app my-cli --bun
`,
	{
		importMeta: import.meta,
		flags: {
			typescript: {
				type: 'boolean',
			},
			bun: {
				type: 'boolean',
			},
			template: {
				type: 'string',
			},
		},
	},
);

const projectDirectoryPath = path.resolve(process.cwd(), cli.input[0] || '.');

try {
	console.log();

	const response = await prompts([
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
	]);

	await createInkApp(projectDirectoryPath, {
		...cli.flags,
		author: response.author,
		license: response.license,
	});

	const pkgName = path.basename(projectDirectoryPath);
	const relativePath = path.relative(process.cwd(), projectDirectoryPath);

	console.log(
		[
			'',
			`Ink app created in ${relativePath ?? 'the current directory'}:`,
			relativePath ? `  $ cd ${relativePath}` : undefined,
			relativePath ? '' : undefined,
			'Build:',
			'  $ npm run build',
			'',
			'Watch and rebuild:',
			'  $ npm run dev',
			'',
			'Run:',
			`  $ ${pkgName}`,
			'',
		]
			.filter(line => line !== undefined)
			.map(line => `  ${line}`)
			.join('\n'),
	);
} catch (error) {
	console.error(error.stack);
	process.exit(1);
}
