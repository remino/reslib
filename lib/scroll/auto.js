const AUTO_SCROLL_TIMEOUT = 30000
const AUTO_SCROLL_PAGE_DURATION = 2000
const AUTO_SCROLL_CANCEL_THRESHOLD = 100
const AUTO_SCROLL_STOP_THRESHOLD = 20

let autoScrollTimeout
let currentPos
let frame
let time

const getBodyHeight = () => document.body.clientHeight
const getScrollY = () => window.scrollY
const getWinHeight = () => window.innerHeight
const isAutoScrollActive = () => !!frame
const isPastThreshold = () => getScrollY() > AUTO_SCROLL_CANCEL_THRESHOLD

const keyPressed = event => {
	const {
		key, shiftKey, ctrlKey, altKey, metaKey,
	} = event

	if (shiftKey || ctrlKey || altKey || metaKey) return

	switch (true) {
		case [',', 'a'].includes(key):
			// eslint-disable-next-line no-use-before-define
			toggleAutoScroll()
			event.preventDefault()
			event.stopPropagation()
			break

		case isAutoScrollActive():
			// eslint-disable-next-line no-use-before-define
			autoScrollStop()
			break

		default:
			break
	}
}

const autoScrollStop = () => {
	if (frame) {
		cancelAnimationFrame(frame)
		frame = null
	}
}

const cancelStart = () => {
	if (!isPastThreshold()) return
	clearTimeout(autoScrollTimeout)
	window.removeEventListener('scroll', cancelStart)
}

const autoScroll = () => {
	const bodyHeight = getBodyHeight()
	const winHeight = getWinHeight()
	const duration = AUTO_SCROLL_PAGE_DURATION * ((bodyHeight - winHeight) / winHeight)
	const now = Date.now()
	const elapsed = now - time
	const progress = elapsed / duration
	const increment = progress * (bodyHeight - winHeight)

	// If user scrolls on their own, cancel autoscroll.
	if (Math.abs(currentPos - getScrollY() > AUTO_SCROLL_STOP_THRESHOLD)) {
		autoScrollStop()
		return
	}

	const pos = Math.floor(currentPos + increment)

	window.scrollTo({ left: 0, top: pos, behavior: 'instant' })

	currentPos = pos
	time = now
	frame = requestAnimationFrame(autoScroll)
}

const autoScrollStart = () => {
	currentPos = getScrollY()
	time = Date.now()
	window.removeEventListener('scroll', cancelStart)
	autoScroll()
}

const toggleAutoScroll = () => {
	if (frame) {
		autoScrollStop()
	} else {
		autoScrollStart()
	}
}

const init = () => {
	if (isPastThreshold()) return
	autoScrollTimeout = setTimeout(autoScrollStart, AUTO_SCROLL_TIMEOUT)
	window.addEventListener('scroll', cancelStart)
	document.addEventListener('keydown', keyPressed)
}

export default init
