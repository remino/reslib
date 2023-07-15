import isBetween from './is-between.js'
import { loadTemplate } from './template.js'

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const separateImagesInRange = () => {
	return Array.from(document.querySelectorAll('img')).reduce(
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
}

export const loadImagesInRange = () => {
	const { inRange, outOfRange } = separateImagesInRange()

	inRange.forEach(img => {
		if (img.src !== EMPTY_IMAGE) return
		if (!img.dataset.src) return
		img.setAttribute('src', img.dataset.src)
	})

	outOfRange.forEach(img => {
		if (img.src === EMPTY_IMAGE) return
		img.setAttribute('src', EMPTY_IMAGE)
	})
}

export const loadLazyloadTemplates = () => {
	document.querySelectorAll('template.lazyload').forEach(loadTemplate)
}
