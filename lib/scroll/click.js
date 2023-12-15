import { preventDefaultIfTrue } from '../events.js'
import { getCurrentSection, goToNextSection, goToPreviousSection } from './sections.js'

const hasClickedViewportUpperHalf = ({ clientY }) => clientY < window.innerHeight / 2
const hasClickedViewportLowerHalf = ({ clientY }) => clientY >= window.innerHeight / 2

const reactToClick = (target, click) => {
	switch (true) {
		case hasClickedViewportUpperHalf(click):
			return target.dispatchEvent(
				new Event('reslibscrollclickupperhalf', {
					bubbles: true,
					cancelable: true,
					composed: false,
				}),
			)

		case hasClickedViewportLowerHalf(click):
			return target.dispatchEvent(
				new Event('reslibscrollclicklowerhalf', {
					bubbles: true,
					cancelable: true,
					composed: false,
				}),
			)

		default:
			return false
	}
}

export const onClick = event => {
	if (!reactToClick(event.target, event)) return

	event.preventDefault()
	event.stopPropagation()
}

const stopIfClickNavDisabled = event => {
	if (getCurrentSection().dataset.reslibScrollClickNav !== 'disabled') return
	event.preventDefault()
	event.stopImmediatePropagation()
	event.stopPropagation()
}

export const init = (...listeners) => {
	document.body.addEventListener('mouseup', onClick)

	listeners.forEach(listener => {
		document.body.addEventListener('reslibscrollclicklowerhalf', listener)
		document.body.addEventListener('reslibscrollclickupperhalf', listener)
	})

	document.body.addEventListener('reslibscrollclicklowerhalf', stopIfClickNavDisabled)
	document.body.addEventListener('reslibscrollclickupperhalf', stopIfClickNavDisabled)

	document.body.addEventListener(
		'reslibscrollclicklowerhalf',
		event => preventDefaultIfTrue(event, goToNextSection),
	)

	document.body.addEventListener(
		'reslibscrollclickupperhalf',
		event => preventDefaultIfTrue(event, goToPreviousSection),
	)
}

export default init
