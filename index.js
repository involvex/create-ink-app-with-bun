import process from 'node:process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import {makeDirectory} from 'make-dir';
import replaceString from 'replace-string';
import slugify from 'slugify';
import {execa} from 'execa';
import Listr from 'listr';

const copyWithTemplate = async (from, to, variables) => {
	const dirname = path.dirname(to);
	await makeDirectory(dirname);

	const source = await fs.readFile(from, 'utf8');
	let generatedSource = source;

	if (typeof variables === 'object') {
		generatedSource = replaceString(source, '%NAME%', variables.name);
	}

	await fs.writeFile(to, generatedSource);
};

const createInkApp = (
	projectDirectoryPath = process.cwd(),
	{typescript, silent, bun, template, author, license},
) => {
	const pkgName = slugify(path.basename(projectDirectoryPath));
	const useBun = bun || template === 'bun';

	const execaInDirectory = (file, args, options = {}) =>
		execa(file, args, {
			...options,
			cwd: projectDirectoryPath,
		});

	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	let templatePath;
	if (useBun) {
		templatePath = 'templates/bun';
	} else {
		templatePath = typescript ? 'templates/ts' : 'templates/js';
	}

	const fromPath = file =>
		path.join(path.resolve(__dirname, templatePath), file);

	const toPath = (rootPath, file) => path.join(rootPath, file);

	const tasks = new Listr(
		[
			{
				title: 'Copy files',
				task() {
					const variables = {
						name: pkgName,
						author: author || '',
						license: license || 'MIT',
					};

					return new Listr([
						{
							title: 'Common files',
							async task() {
								await copyWithTemplate(
									fromPath('_package.json'),
									toPath(projectDirectoryPath, 'package.json'),
									variables,
								);

								if (useBun) {
									await copyWithTemplate(
										fromPath('readme.md'),
										toPath(projectDirectoryPath, 'readme.md'),
										variables,
									);
								} else {
									await copyWithTemplate(
										fromPath('../_common/readme.md'),
										toPath(projectDirectoryPath, 'readme.md'),
										variables,
									);
								}

								await fs.copyFile(
									fromPath('../_common/_editorconfig'),
									toPath(projectDirectoryPath, '.editorconfig'),
								);

								await fs.copyFile(
									fromPath('../_common/_gitattributes'),
									toPath(projectDirectoryPath, '.gitattributes'),
								);

								await fs.copyFile(
									fromPath('../_common/_gitignore'),
									toPath(projectDirectoryPath, '.gitignore'),
								);

								await fs.copyFile(
									fromPath('../_common/_prettierignore'),
									toPath(projectDirectoryPath, '.prettierignore'),
								);
							},
						},
						{
							title: 'JavaScript files',
							enabled: () => !typescript && !useBun,
							async task() {
								await makeDirectory(toPath(projectDirectoryPath, 'source'));

								await fs.copyFile(
									fromPath('source/app.js'),
									toPath(projectDirectoryPath, 'source/app.js'),
								);

								await copyWithTemplate(
									fromPath('source/cli.js'),
									toPath(projectDirectoryPath, 'source/cli.js'),
									variables,
								);

								await fs.copyFile(
									fromPath('test.js'),
									toPath(projectDirectoryPath, 'test.js'),
								);
							},
						},
						{
							title: 'TypeScript files',
							enabled: () => typescript && !useBun,
							async task() {
								await makeDirectory(toPath(projectDirectoryPath, 'source'));

								await fs.copyFile(
									fromPath('source/app.tsx'),
									toPath(projectDirectoryPath, 'source/app.tsx'),
								);

								await copyWithTemplate(
									fromPath('source/cli.tsx'),
									toPath(projectDirectoryPath, 'source/cli.tsx'),
									variables,
								);

								await fs.copyFile(
									fromPath('test.tsx'),
									toPath(projectDirectoryPath, 'test.tsx'),
								);

								await fs.copyFile(
									fromPath('tsconfig.json'),
									toPath(projectDirectoryPath, 'tsconfig.json'),
								);
							},
						},
						{
							title: 'Bun files',
							enabled: () => useBun,
							async task() {
								await makeDirectory(toPath(projectDirectoryPath, 'src'));
								await makeDirectory(
									toPath(projectDirectoryPath, 'src/commands'),
								);

								// Copy src directory content recursively if needed, but for now specific files
								// Reading src dir content logic might be needed or just hardcode known files from analysis

								// From previous list_dir of templates/bun:
								// src/ has numChildren=5.
								// Let's assume standard structure or list it to be sure.
								// But wait, the previous code copied specific files.
								// I should check src content to be safe.
								// For now I will copy what I saw in templates/bun structure if I can.
								// Or I can use fs.cp (node 16+) or cpy dependency? 'cpy' is in dependencies.
								// But the existing code uses fs.copyFile.
								// I'll assume standard files: app.tsx, cli.tsx in src.
								// Wait, ListDir showed src has children.

								// Let's rely on recursive copy for src if possible or list specific files.
								// To be safe and consistent with existing code, I should copy specific files.
								// I'll assume: src/app.tsx, src/cli.tsx. And src/commands?

								// I will use execa copy or just fs.cp if available (Node 16+ has fs.cp).
								// Project engine says node >=16.
								// So I can use fs.cp(from, to, {recursive: true}).

								await fs.cp(
									fromPath('src'),
									toPath(projectDirectoryPath, 'src'),
									{recursive: true},
								);

								// We need to replace variables in cli.tsx though.
								// Existing code does `copyWithTemplate` for `cli.tsx`.
								// So after cp, I might need to overwrite cli.tsx with template replacement.

								await copyWithTemplate(
									fromPath('src/cli.tsx'),
									toPath(projectDirectoryPath, 'src/cli.tsx'),
									variables,
								);

								await fs.copyFile(
									fromPath('test.tsx'),
									toPath(projectDirectoryPath, 'test.tsx'),
								);

								await fs.copyFile(
									fromPath('tsconfig.json'),
									toPath(projectDirectoryPath, 'tsconfig.json'),
								);

								await fs.copyFile(
									fromPath('bunfig.toml'),
									toPath(projectDirectoryPath, 'bunfig.toml'),
								);

								await fs.copyFile(
									fromPath('eslint.config.ts'),
									toPath(projectDirectoryPath, 'eslint.config.ts'),
								);
							},
						},
					]);
				},
			},
			{
				title: 'Install dependencies',
				async task() {
					if (useBun) {
						await execaInDirectory('bun', ['install']);
					} else {
						await execaInDirectory('npm', ['install']);
					}
				},
			},
			{
				title: 'Format code',
				task() {
					if (useBun) {
						return execaInDirectory('bun', ['run', 'format']);
					}
					return execaInDirectory('npx', ['prettier', '--write', '.']);
				},
			},
			{
				title: 'Build',
				task() {
					if (useBun) {
						return execaInDirectory('bun', ['run', 'build']);
					}
					return execaInDirectory('npm', ['run', 'build']);
				},
			},
			{
				title: 'Link executable',
				async task(_, task) {
					try {
						if (useBun) {
							// Bun link might behave differently, but let's try npm link if bun link is not desired
							// or just skip link for bun if not standard.
							// But user wants a working app.
							// 'bun link' links the package.
							await execaInDirectory('npm', ['link']); // npm link usually works for standard package.json bin
						} else {
							await execaInDirectory('npm', ['link']);
						}
					} catch {
						task.skip('`npm link` failed, try running it yourself');
					}
				},
			},
		],
		{
			renderer: silent ? 'silent' : 'default',
		},
	);

	return tasks.run();
};

export default createInkApp;
