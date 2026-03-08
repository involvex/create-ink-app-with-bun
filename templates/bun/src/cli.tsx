#!/usr/bin/env node
import Help from './commands/help.js'
import App from './app.js'
import {render} from 'ink'
import React from 'react'
import meow from 'meow'

const cli = meow(
	`
	Usage
	  $ %NAME%

	Options
		--name  Your name

	Examples
	  $ %NAME% --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
)

if (cli.input[0] === 'help') {
	render(<Help />)
} else {
	render(<App name={cli.flags.name} />)
}
