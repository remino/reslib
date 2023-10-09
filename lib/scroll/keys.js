import { preventDefaultIfTrue } from '../events.js'

import {
	getSections,
	goToFirstSection,
	goToLastSection,
	goToNextSection,
	goToPreviousSection,
	jumpToSection,
} from './sections.js'

const mapKeyPress = ({
	key, shiftKey, ctrlKey, altKey, metaKey,
}) => {
	switch (key) {
		case ' ':
			return shiftKey ? 'Shift+Space' : 'Space'
		default:
			if (shiftKey || ctrlKey || altKey || metaKey) return ''
			return key
	}
}

const numberKey = event => {
	const key = parseInt(event.key, 10)
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
	}
}

const getEventNameForEventKey = event => {
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

export const keyPress = event => {
	const eventName = getEventNameForEventKey(event)

	if (!eventName) return

	event.target.dispatchEvent(
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

const init = (...listeners) => {
	window.addEventListener('keydown', keyPress)

	listeners.forEach(listener => {
		window.addEventListener('reslibscrollkeydown', listener)
		window.addEventListener('reslibscrollkeyend', listener)
		window.addEventListener('reslibscrollkeyhome', listener)
		window.addEventListener('reslibscrollkeynumber', listener)
		window.addEventListener('reslibscrollkeyup', listener)
	})

	window.addEventListener('reslibscrollkeydown', event => preventDefaultIfTrue(event, goToNextSection))
	window.addEventListener('reslibscrollkeyend', event => preventDefaultIfTrue(event, goToLastSection))
	window.addEventListener('reslibscrollkeyhome', event => preventDefaultIfTrue(event, goToFirstSection))
	window.addEventListener('reslibscrollkeynumber', event => preventDefaultIfTrue(event, numberKey))
	window.addEventListener('reslibscrollkeyup', event => preventDefaultIfTrue(event, goToPreviousSection))
}

export default init
