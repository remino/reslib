import { onScrollOrResize } from './events'
import isBetween from './is-between'
import { loadTemplate } from './template'

const EMPTY_IMAGE =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

interface Buckets {
	inRange: HTMLImageElement[]
	outOfRange: HTMLImageElement[]
}

const separateImagesInRange = (): Buckets =>
	Array.from(
		document.querySelectorAll<HTMLImageElement>(
			'img:not([data-reslib-lazyload="manual"])',
		),
	).reduce<Buckets>(
		(acc, img) => {
			const { top, bottom } = img.getBoundingClientRect()
			const { innerHeight } = window

			if (
				isBetween(top, -innerHeight, innerHeight) ||
				isBetween(bottom, 0, innerHeight * 2)
			) {
				acc.inRange.push(img)
			} else {
				acc.outOfRange.push(img)
			}

			return acc
		},
		{ inRange: [], outOfRange: [] },
	)

export const loadImage = (img: HTMLImageElement): void => {
	if (img.src !== EMPTY_IMAGE) return
	const dataSrc = img.getAttribute('data-src')
	if (!dataSrc) return
	img.setAttribute('src', dataSrc)
	img.dispatchEvent(new CustomEvent('reslib:lazyload:load', { detail: { img } }))
}

export const unloadImage = (img: HTMLImageElement): void => {
	if (img.src === EMPTY_IMAGE) return
	img.setAttribute('src', EMPTY_IMAGE)
	img.dispatchEvent(new CustomEvent('reslib:lazyload:unload', { detail: { img } }))
}

export const loadImagesInRange = (): void => {
	const { inRange, outOfRange } = separateImagesInRange()
	inRange.forEach(loadImage)
	outOfRange.forEach(unloadImage)
}

export const loadLazyloadTemplates = (): void => {
	document
		.querySelectorAll<HTMLTemplateElement>('template.lazyload')
		.forEach((template) => {
			loadTemplate(template)
		})
}

const init = (): void => {
	loadLazyloadTemplates()
	loadImagesInRange()
	onScrollOrResize(loadImagesInRange)
}

export default init
