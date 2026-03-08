import SelectInput, {type SelectItem} from './components/select-input.js'
import DisplayVersion from './commands/version.js'
import About from './commands/about.js'
import {Text, Box, useInput} from 'ink'
import Help from './commands/help.js'
import pkg from '../../package.json' with {type: 'json'}
import {useState} from 'react'

type AppState = 'menu' | 'help' | 'about' | 'version'
function BackableScreen({
	children,
	onBack,
}: {
	children: React.ReactNode
	onBack: () => void
}) {
	useInput((_input, key) => {
		if (key.escape) onBack()
	})
	return (
		<Box flexDirection="column">
			<Box paddingX={2} paddingY={0}>
				<Text dimColor>{'← Esc to return to menu'}</Text>
			</Box>
			{children}
		</Box>
	)
}

export default function App() {
	const [state, setState] = useState<AppState>('menu')
	const goMenu = () => setState('menu')
	const menuItems = [
		{label: 'Help', value: 'help'},
		{label: 'About', value: 'about'},
		{label: 'Version', value: 'version'},
		{label: 'Exit', value: 'exit'},
	]
	if (state === 'menu') {
		return (
			<Box flexDirection="column">
				<Box marginY={1} paddingX={2}>
					<Text bold color="green">
						Welcome to {pkg.name}
					</Text>
				</Box>
				<Box>
					<SelectInput
						items={menuItems}
						onSelect={value => {
							if (value === 'exit') {
								process.exit(0)
							}
							setState(value as AppState)
						}}
					/>
				</Box>
			</Box>
		)
	}
	if (state === 'help') {
		return (
			<BackableScreen onBack={goMenu}>
				<Help />
			</BackableScreen>
		)
	}

	if (state === 'about') {
		return (
			<BackableScreen onBack={goMenu}>
				<About />
			</BackableScreen>
		)
	}

	if (state === 'version') {
		return (
			<BackableScreen onBack={goMenu}>
				<DisplayVersion />
			</BackableScreen>
		)
	}

	return null
}
