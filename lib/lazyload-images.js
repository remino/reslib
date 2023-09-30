import { onScrollOrResize } from './events.js'
import isBetween from './is-between.js'
import { loadTemplate } from './template.js'

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const isMobile = () => window.innerWidth < 768

let timeout = null

const separateImagesInRange = () =>
	Array.from(document.querySelectorAll('img:not([data-reslib-lazyload=manual])')).reduce(
		(acc, img) => {
			const { top, bottom } = img.getBoundingClientRect()
			const { innerHeight } = window

			if (isBetween(top, -innerHeight, innerHeight) || isBetween(bottom, 0, innerHeight * 2)) {
				acc.inRange.push(img)
			} else {
				acc.outOfRange.push(img)
			}

			return acc
		},
		{ inRange: [], outOfRange: [] }
	)

export const loadImage = img => {
	if (img.src !== EMPTY_IMAGE) return
	if (!img.dataset.src) return
	img.setAttribute('src', img.dataset.src)
}

export const unloadImage = img => {
	if (img.src === EMPTY_IMAGE) return
	img.setAttribute('src', EMPTY_IMAGE)
}

export const loadImagesInRange = () => {
	const { inRange, outOfRange } = separateImagesInRange()
	inRange.forEach(loadImage)
	outOfRange.forEach(unloadImage)
}

export const loadLazyloadTemplates = () => {
	document.querySelectorAll('template.lazyload').forEach(loadTemplate)
}

const init = () => {
	loadLazyloadTemplates()
	loadImagesInRange()

	if (!isMobile()) {
		onScrollOrResize(loadImagesInRange)
		return
	}

	onScrollOrResize(() => {
		if (timeout) return

		timeout = setTimeout(() => {
			loadImagesInRange()
			timeout = null
		}, 400)
	})
}

export default init
