import { onScrollOrResize } from '@remino/functions'
import { getCurrentSection, jumpToSection } from './sections'

let scrollSnapTypeChangeTimeout: number | undefined
let urlAnchorUpdateTimeout: number | undefined

const clickedAnchor = (event: MouseEvent, opts?: ScrollToOptions): void => {
	if (!(event.currentTarget instanceof HTMLAnchorElement)) return

	event.preventDefault()
	event.stopPropagation()

	const href = event.currentTarget.getAttribute('href') || '#'

	const { scrollSnapType } = window.getComputedStyle(document.documentElement)

	document.documentElement.style.scrollSnapType = 'none'

	if (href === '#') {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
	} else {
		const name = href.slice(1)
		const element =
			document.getElementById(name) || document.getElementsByName(name)[0]

		if (element instanceof HTMLElement) {
			jumpToSection(element, opts)
		}
	}

	if (scrollSnapTypeChangeTimeout) clearTimeout(scrollSnapTypeChangeTimeout)

	scrollSnapTypeChangeTimeout = window.setTimeout(() => {
		document.documentElement.style.scrollSnapType = scrollSnapType
	}, 500)
}

export const prepareAnchors = (opts?: ScrollToOptions): void => {
	document
		.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
		.forEach((anchor) => {
			anchor.addEventListener('click', (event) => clickedAnchor(event, opts))
		})
}

export const updateUrlAnchor = (): void => {
	const current = getCurrentSection()
	if (!current) return

	const name = current.getAttribute('id') || current.getAttribute('name')

	if (name) {
		const hash = `#${name}`
		if (window.location.hash === hash) return
		window.history.replaceState(null, '', hash)
		return
	}

	window.history.replaceState(null, '', window.location.pathname)
}

export const updateUrlAnchorOnTimeout = (): void => {
	if (urlAnchorUpdateTimeout) clearTimeout(urlAnchorUpdateTimeout)
	urlAnchorUpdateTimeout = window.setTimeout(updateUrlAnchor, 300)
}

const init = (opts?: ScrollToOptions): void => {
	if (
		window.getComputedStyle(document.documentElement).scrollBehavior !==
		'smooth'
	) {
		prepareAnchors(opts)
	}

	onScrollOrResize(updateUrlAnchorOnTimeout)
}

export default init
