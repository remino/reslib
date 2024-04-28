import { onScrollOrResize } from './events.js'
import isBetween from './is-between.js'
import { loadTemplate } from './template.js'

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const separateImagesInRange = () => Array
	.from(document.querySelectorAll('img:not([data-reslib-lazyload=manual])')).reduce(
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
		{ inRange: [], outOfRange: [] },
	)

export const loadImage = img => {
	if (img.src !== EMPTY_IMAGE) return
	if (!img.dataset.src) return
	img.setAttribute('src', img.dataset.src)
	const event = new CustomEvent('reslib:lazyload:load', { detail: { img } })
	img.dispatchEvent(event)
}

export const unloadImage = img => {
	if (img.src === EMPTY_IMAGE) return
	img.setAttribute('src', EMPTY_IMAGE)
	const event = new CustomEvent('reslib:lazyload:unload', { detail: { img } })
	img.dispatchEvent(event)
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
	onScrollOrResize(loadImagesInRange)
}

export default init
