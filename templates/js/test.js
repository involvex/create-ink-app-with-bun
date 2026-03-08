import {render} from 'ink-testing-library'
import App from './source/app.js'
import React from 'react'
import chalk from 'chalk'
import test from 'ava'

test('greet unknown user', t => {
	const {lastFrame} = render(<App />)

	t.is(lastFrame(), `Hello, ${chalk.green('Stranger')}`)
})

test('greet user with a name', t => {
	const {lastFrame} = render(<App name="Jane" />)

	t.is(lastFrame(), `Hello, ${chalk.green('Jane')}`)
})
