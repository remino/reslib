import { preventDefaultIfTrue } from '../events.js'
import { getCurrentSection, goToNextSection, goToPreviousSection } from './sections.js'

const hasClickedViewportUpperHalf = ({ clientY: y }) => y < window.innerHeight / 2
const hasClickedViewportLowerHalf = ({ clientY: y }) => y >= window.innerHeight / 2

const reactToClick = (target, touchOrClick) => {
	switch (true) {
		case hasClickedViewportUpperHalf(touchOrClick):
			return target.dispatchEvent(
				new Event('reslibscrollclickupperhalf', {
					bubbles: true,
					cancelable: true,
					composed: false,
				})
			)

		case hasClickedViewportLowerHalf(touchOrClick):
			return target.dispatchEvent(
				new Event('reslibscrollclicklowerhalf', {
					bubbles: true,
					cancelable: true,
					composed: false,
				})
			)

		default:
			return
	}
}

export const onTouch = event => {
	if (event.touches.length > 1) return

	if (!reactToClick(event.target, event.touches.item(0))) return

	event.preventDefault()
	event.stopPropagation()
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
	document.body.addEventListener('touchend', onTouch)

	listeners.forEach(listener => {
		document.body.addEventListener('reslibscrollclicklowerhalf', listener)
		document.body.addEventListener('reslibscrollclickupperhalf', listener)
	})

	document.body.addEventListener('reslibscrollclicklowerhalf', stopIfClickNavDisabled)
	document.body.addEventListener('reslibscrollclickupperhalf', stopIfClickNavDisabled)

	document.body.addEventListener('reslibscrollclicklowerhalf', event =>
		preventDefaultIfTrue(event, goToNextSection)
	)
	document.body.addEventListener('reslibscrollclickupperhalf', event =>
		preventDefaultIfTrue(event, goToPreviousSection)
	)
}

export default init
