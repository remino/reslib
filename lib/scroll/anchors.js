import { onScrollOrResize } from '../events.js'
import { getCurrentSection, jumpToSection } from './sections.js'

let scrollSnapTypeChangeTimeout
let urlAnchorUpdateTimeout

const clickedAnchor = (event, opts) => {
	if (event.currentTarget.tagName !== 'A') return

	event.preventDefault()
	event.stopPropagation()

	const href = event.currentTarget.getAttribute('href')

	// disable scroll-snap-type, saving its current value to restore after
	const { scrollSnapType } = window.getComputedStyle(document.documentElement)

	document.documentElement.style.scrollSnapType = 'none'

	if (href === '#') {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
	} else {
		const name = href.slice(1)
		const element = document.getElementById(name) || document.getElementsByName(name)[0]

		jumpToSection(element, opts)
	}

	if (scrollSnapTypeChangeTimeout) clearTimeout(scrollSnapTypeChangeTimeout)

	scrollSnapTypeChangeTimeout = setTimeout(() => {
		document.documentElement.style.scrollSnapType = scrollSnapType
	}, 500)
}

export const prepareAnchors = opts => {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', event => clickedAnchor(event, opts))
	})
}

export const updateUrlAnchor = () => {
	const tray = getCurrentSection()
	if (!tray) return

	const name = tray.getAttribute('id') || tray.getAttribute('name')

	if (name) {
		const hash = `#${name}`
		if (window.location.hash === hash) return
		window.history.replaceState(null, null, hash)
		return
	}

	window.history.replaceState(null, null, window.location.pathname)
}

export const updateUrlAnchorOnTimeout = () => {
	if (urlAnchorUpdateTimeout) clearTimeout(urlAnchorUpdateTimeout)
	urlAnchorUpdateTimeout = setTimeout(updateUrlAnchor, 300)
}

const init = () => {
	if (window.getComputedStyle(document.documentElement).scrollBehavior !== 'smooth') {
		prepareAnchors()
	}

	onScrollOrResize(updateUrlAnchorOnTimeout)
}

export default init
