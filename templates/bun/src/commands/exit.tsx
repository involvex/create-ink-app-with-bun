import {useState, useEffect} from 'react'
import pkg from '../../package.json' with {type: 'json'}
import {Text, Box} from 'ink'

export default function Exit() {
	const [frame, _setFrame] = useState(0)

	useEffect(() => {
		const timer = setTimeout(() => {
			process.exit(0)
		}, 1500)
		return () => clearTimeout(timer)
	}, [])

	const frames = [
		' Goodbye! ',
		' Goodby e',
		' Goodb y',
		' Good  ',
		' Goo   ',
		'Goo    ',
	]

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			paddingY={10}
		>
			<Box marginBottom={2}>
				<Text bold color="green">
					Thank you for using
				</Text>
			</Box>
			<Box marginBottom={2}>
				<Text bold color="cyan">
					{pkg.name}
				</Text>
			</Box>
			<Box>
				<Text color="magenta">{frames[frame % frames.length]}</Text>
			</Box>
		</Box>
	)
}
