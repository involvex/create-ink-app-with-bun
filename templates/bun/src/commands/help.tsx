import {Text, Box} from 'ink'
// import React from 'react'

export default function Help() {
	return (
		<Box flexDirection="column" padding={1}>
			<Text bold color="cyan">
				Usage
			</Text>
			<Text> $ %NAME%</Text>
			<Text />
			<Text bold color="cyan">
				Options
			</Text>
			<Text> --version Show version</Text>
			<Text> --about Show about</Text>
			<Text> --help Show help</Text>
			<Text />
			<Text bold color="cyan">
				Examples
			</Text>
			<Text> $ %NAME% --about</Text>
		</Box>
	)
}
