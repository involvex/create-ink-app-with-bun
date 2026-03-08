import {temporaryDirectoryTask} from 'tempy'
import createInkApp from './index.js'
import stripAnsi from 'strip-ansi'
import {deleteAsync} from 'del'
import path from 'node:path'
import {execa} from 'execa'
import test from 'ava'

const temporaryProjectTask = async (type, callback) => {
	await temporaryDirectoryTask(async temporaryDirectory => {
		const projectDirectory = path.join(temporaryDirectory, `test-${type}-app`)
		await deleteAsync(projectDirectory)

		try {
			await callback(projectDirectory)
		} finally {
			await execa('npm', ['unlink', '--global', `test-${type}-app`])
		}
	})
}

test.serial('javascript app', async t => {
	await temporaryProjectTask('js', async projectDirectory => {
		await createInkApp(projectDirectory, {
			typescript: false,
			silent: true,
		})

		const result = await execa('test-js-app')
		t.is(stripAnsi(result.stdout).trim(), 'Hello, Stranger')

		await t.notThrowsAsync(
			execa('npm', ['test'], {
				cwd: projectDirectory,
			}),
		)
	})
})

test.serial('typescript app', async t => {
	await temporaryProjectTask('ts', async projectDirectory => {
		await createInkApp(projectDirectory, {
			typescript: false,
			silent: true,
		})

		const result = await execa('test-ts-app')
		t.is(stripAnsi(result.stdout).trim(), 'Hello, Stranger')

		await t.notThrowsAsync(
			execa('npm', ['test'], {
				cwd: projectDirectory,
			}),
		)
	})
})
