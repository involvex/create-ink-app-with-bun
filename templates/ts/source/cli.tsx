#!/usr/bin/env node
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

render(<App name={cli.flags.name} />)
