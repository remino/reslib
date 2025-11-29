import { preventDefaultIfTrue } from '@remino/functions'
import {
	getSections,
	goToFirstSection,
	goToLastSection,
	goToNextSection,
	goToPreviousSection,
	jumpToSection,
} from './sections'

const mapKeyPress = (event: KeyboardEvent): string => {
	const { key, shiftKey, ctrlKey, altKey, metaKey } = event

	if (key === ' ') {
		if (shiftKey && !ctrlKey && !altKey && !metaKey) return 'Shift+Space'
		if (!shiftKey && !ctrlKey && !altKey && !metaKey) return 'Space'
		return ''
	}

	if (shiftKey || ctrlKey || altKey || metaKey) return ''
	return key
}

const numberKey = (event: KeyboardEvent): boolean => {
	const key = parseInt(event.key, 10)
	if (Number.isNaN(key)) return false
	const sections = getSections()

	switch (key) {
		case 0:
			jumpToSection(sections[sections.length - 1])
			break
		case 1:
			jumpToSection(sections[0])
			break
		default:
			jumpToSection(sections[Math.floor(((key - 1) / 9) * sections.length)])
			break
	}

	return true
}

const getEventNameForEventKey = (event: KeyboardEvent): string => {
	switch (mapKeyPress(event)) {
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case '0':
			return 'reslibscrollkeynumber'
		case 'ArrowUp':
		case 'ArrowLeft':
		case 'Shift+Space':
			return 'reslibscrollkeyup'
		case 'ArrowRight':
		case 'ArrowDown':
		case 'Space':
			return 'reslibscrollkeydown'
		case 'Home':
			return 'reslibscrollkeyhome'
		case 'End':
			return 'reslibscrollkeyend'
		default:
			return ''
	}
}

export const keyPress = (event: KeyboardEvent): void => {
	const eventName = getEventNameForEventKey(event)
	if (!eventName) return

	event.target?.dispatchEvent(
		new KeyboardEvent(eventName, {
			bubbles: true,
			cancelable: true,
			composed: false,
			key: mapKeyPress(event),
		}),
	)

	event.preventDefault()
	event.stopPropagation()
}

const init = (...listeners: EventListener[]): void => {
	window.addEventListener('keydown', keyPress)

	listeners.forEach((listener) => {
		window.addEventListener('reslibscrollkeydown', listener)
		window.addEventListener('reslibscrollkeyend', listener)
		window.addEventListener('reslibscrollkeyhome', listener)
		window.addEventListener('reslibscrollkeynumber', listener)
		window.addEventListener('reslibscrollkeyup', listener)
	})

	window.addEventListener('reslibscrollkeydown', (event) =>
		preventDefaultIfTrue(event, goToNextSection),
	)
	window.addEventListener('reslibscrollkeyend', (event) =>
		preventDefaultIfTrue(event, goToLastSection),
	)
	window.addEventListener('reslibscrollkeyhome', (event) =>
		preventDefaultIfTrue(event, goToFirstSection),
	)
	window.addEventListener('reslibscrollkeynumber', (event) =>
		preventDefaultIfTrue(event, () => numberKey(event as KeyboardEvent)),
	)
	window.addEventListener('reslibscrollkeyup', (event) =>
		preventDefaultIfTrue(event, goToPreviousSection),
	)
}

export default init
