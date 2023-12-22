import { onScrollOrResize } from '../events.js'
import { getCurrentSection, jumpToSection } from './sections.js'

let urlAnchorUpdateTimeout

const clickedAnchor = event => {
	if (event.currentTarget.tagName !== 'A') return

	event.preventDefault()
	event.stopPropagation()

	const href = event.currentTarget.getAttribute('href')

	if (href === '#') {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
		return
	}

	const name = href.slice(1)
	const element = document.getElementById(name) || document.getElementsByName(name)[0]

	jumpToSection(element)
}

export const prepareAnchors = () => {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', clickedAnchor)
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
