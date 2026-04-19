import {useState, useEffect} from 'react'
import pkg from '../../package.json' with {type: 'json'}
import {Text, Box} from 'ink'

export default function Demo() {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(p => (p >= 100 ? 0 : p + 10))
		}, 200)
		return () => clearInterval(interval)
	}, [])

	const spinnerFrames = ['●', '○', '○', '○']
	const currentFrame = progress / 25

	return (
		<Box
			flexDirection="column"
			padding={1}
		>
			<Box marginBottom={1}>
				<Text
					bold
					color="cyan"
				>
					─── Component Demo ───
				</Text>
			</Box>

			<Box
				flexDirection="column"
				marginBottom={2}
			>
				<Text
					bold
					color="magenta"
				>
					Box Container:
				</Text>
				<Box
					borderStyle="round"
					borderColor="cyan"
					padding={1}
					marginLeft={2}
				>
					<Text dimColor>Bordered container with round style</Text>
				</Box>
			</Box>

			<Box
				flexDirection="column"
				marginBottom={2}
			>
				<Text
					bold
					color="magenta"
				>
					Text Styles:
				</Text>
				<Box
					marginLeft={2}
					flexDirection="column"
				>
					<Text
						bold
						color="white"
					>
						Bold White
					</Text>
					<Text color="cyan">Cyan</Text>
					<Text color="magenta">Magenta</Text>
					<Text color="green">Green</Text>
					<Text color="yellow">Yellow</Text>
					<Text color="red">Red</Text>
					<Text dimColor>Dim Color</Text>
				</Box>
			</Box>

			<Box
				flexDirection="column"
				marginBottom={2}
			>
				<Text
					bold
					color="magenta"
				>
					Loading Animation:
				</Text>
				<Box marginLeft={2}>
					<Text color="cyan">Loading </Text>
					{spinnerFrames.map((frame, i) => (
						<Text
							key={i}
							color={i === currentFrame % 4 ? 'green' : 'dimColor'}
						>
							{frame}
						</Text>
					))}
				</Box>
			</Box>

			<Box
				flexDirection="column"
				marginBottom={2}
			>
				<Text
					bold
					color="magenta"
				>
					Progress Bar:
				</Text>
				<Box marginLeft={2}>
					<Text>[</Text>
					{Array(10)
						.fill(0)
						.map((_, i) => (
							<Text
								key={i}
								color={i < progress / 10 ? 'green' : 'dimColor'}
							>
								●
							</Text>
						))}
					<Text>] {progress}%</Text>
				</Box>
			</Box>

			<Box
				flexDirection="column"
				marginBottom={2}
			>
				<Text
					bold
					color="magenta"
				>
					Package Info:
				</Text>
				<Box
					marginLeft={2}
					flexDirection="column"
				>
					<Text>
						Name: <Text color="white">{pkg.name}</Text>
					</Text>
					<Text>
						Version: <Text color="white">{pkg.version}</Text>
					</Text>
					<Text>
						Author: <Text color="white">{pkg.author}</Text>
					</Text>
					<Text>
						License: <Text color="white">{pkg.license}</Text>
					</Text>
				</Box>
			</Box>

			<Box
				borderStyle="single"
				padding={1}
			>
				<Text dimColor>
					Install more components in package.json to see them here
				</Text>
			</Box>
		</Box>
	)
}
