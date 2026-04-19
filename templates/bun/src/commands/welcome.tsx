import {useState, useEffect} from 'react'
import {Text, Box, useInput} from 'ink'
import pkg from '../../package.json' with {type: 'json'}

interface WelcomeProps {
	onComplete: () => void
}

export default function Welcome({onComplete}: WelcomeProps) {
	const [frame, _setFrame] = useState(0)
	const [showSubtitle, setShowSubtitle] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSubtitle(true)
		}, 800)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		const timer = setTimeout(() => {
			onComplete()
		}, 2500)
		return () => clearTimeout(timer)
	}, [onComplete])

	useInput((_input, key) => {
		if (key.return || key.escape) {
			onComplete()
		}
	})

	const frames = ['|', '/', '─', '\\']

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			paddingY={10}
		>
			<Box>
				<Text
					bold
					color="cyan"
				>
					██╗ ███████╗██╗ ██╗██╗██████╗ ███████╗
				</Text>
			</Box>
			<Box>
				<Text
					bold
					color="cyan"
				>
					██║ ██╔════╝╚██╗██╔╝██║██╔══██╗██╔════╝
				</Text>
			</Box>
			<Box>
				<Text
					bold
					color="cyan"
				>
					██║ █████╗ ╚███╔╝ ██║██████╔╝█████╗
				</Text>
			</Box>
			<Box>
				<Text
					bold
					color="cyan"
				>
					██║ ██╔══╝ ██╔██╗ ██║██╔══██╗██╔══╝
				</Text>
			</Box>
			<Box marginBottom={2}>
				<Text
					bold
					color="cyan"
				>
					███████╗██████╗ ███████╗██╗ ██╗███╗ ███╗
				</Text>
			</Box>
			<Box>
				<Text color="magenta">{frames[frame % frames.length]}</Text>
			</Box>
			<Box marginTop={2}>
				<Text
					bold
					color="green"
				>
					{pkg.name}
				</Text>
			</Box>
			<Box>
				<Text dimColor>v{pkg.version}</Text>
			</Box>
			{showSubtitle && (
				<Box marginTop={1}>
					<Text dimColor>{pkg.description}</Text>
				</Box>
			)}
			<Box marginTop={3}>
				<Text dimColor>Press Enter or Escape to continue...</Text>
			</Box>
		</Box>
	)
}
