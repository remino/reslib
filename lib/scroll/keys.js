import { preventDefaultIfTrue } from '../events.js'

import {
	goToFirstSection,
	goToLastSection,
	goToNextSection,
	goToPreviousSection,
} from './sections.js'

const mapKeyPress = ({ key, shiftKey }) => {
	switch (key) {
		case ' ':
			return shiftKey ? 'Shift+Space' : 'Space'
		default:
			return key
	}
}

const getEventNameForEventKey = event => {
	switch (mapKeyPress(event)) {
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
			return
	}
}

export const keyPress = event => {
	const eventName = getEventNameForEventKey(event)

	if (!eventName) return

	event.target.dispatchEvent(
		new Event(eventName, {
			bubbles: true,
			cancelable: true,
			composed: false,
		})
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
		window.addEventListener('reslibscrollkeyup', listener)
	})

	window.addEventListener('reslibscrollkeydown', event =>
		preventDefaultIfTrue(event, goToNextSection)
	)
	window.addEventListener('reslibscrollkeyend', event =>
		preventDefaultIfTrue(event, goToLastSection)
	)
	window.addEventListener('reslibscrollkeyhome', event =>
		preventDefaultIfTrue(event, goToFirstSection)
	)
	window.addEventListener('reslibscrollkeyup', event =>
		preventDefaultIfTrue(event, goToPreviousSection)
	)
}

export default init
