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

test.serial('bun app', async t => {
	await temporaryProjectTask('bun', async projectDirectory => {
		await createInkApp(projectDirectory, {
			silent: true,
		})

		const result = await execa('test-bun-app')
		t.is(stripAnsi(result.stdout).trim(), 'Hello, Stranger')

		await t.notThrowsAsync(
			execa('bun', ['run', 'typecheck'], {
				cwd: projectDirectory,
			}),
		)
	})
})
