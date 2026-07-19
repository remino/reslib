import { onScrollOrResize } from './events'
import isBetween from './is-between'
import { loadTemplate } from './template'

const EMPTY_IMAGE =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const LAZYLOAD_REFRESH_EVENT = 'reslib:lazyload:refresh'

interface Buckets {
	inRange: HTMLImageElement[]
	outOfRange: HTMLImageElement[]
}

type RefreshRoot = Document | DocumentFragment | Element
interface RefreshDetail {
	root?: unknown
}

const LAZYLOAD_SELECTOR = 'template.lazyload, img[data-src]'

const isRefreshRoot = (value: unknown): value is RefreshRoot =>
	Boolean(
		value &&
			typeof value === 'object' &&
			'querySelectorAll' in value &&
			typeof value.querySelectorAll === 'function',
	)

const hasLazyloadCandidates = (node: Node): node is ParentNode =>
	node instanceof Element &&
	(node.matches(LAZYLOAD_SELECTOR) ||
		Boolean(node.querySelector(LAZYLOAD_SELECTOR)))

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
	img.dispatchEvent(
		new CustomEvent('reslib:lazyload:load', { detail: { img } }),
	)
}

export const unloadImage = (img: HTMLImageElement): void => {
	if (img.src === EMPTY_IMAGE) return
	if (!img.hasAttribute('data-src')) {
		img.setAttribute('data-src', img.src)
	}
	img.setAttribute('src', EMPTY_IMAGE)
	img.dispatchEvent(
		new CustomEvent('reslib:lazyload:unload', { detail: { img } }),
	)
}

export const loadImagesInRange = (): void => {
	const { inRange, outOfRange } = separateImagesInRange()
	inRange.forEach(loadImage)
	outOfRange.forEach(unloadImage)
}

export const loadLazyloadTemplates = (root: ParentNode = document): void => {
	root.querySelectorAll<HTMLTemplateElement>('template.lazyload')
			.forEach((template) => {
				loadTemplate(template)
			})
}

export const refreshLazyloadImages = (root: ParentNode = document): void => {
	loadLazyloadTemplates(root)
	loadImagesInRange()
}

const handleRefreshEvent = (event: Event): void => {
	const detail: RefreshDetail | null =
		'detail' in event && event.detail && typeof event.detail === 'object'
			? (event.detail as RefreshDetail)
			: null
	if (!isRefreshRoot(detail?.root)) {
		refreshLazyloadImages()
		return
	}

	refreshLazyloadImages(detail.root)
}

let initialized = false
let observer: MutationObserver | null = null

const observeLazyloadMutations = (): void => {
	if (observer || !document.body) return

	let pending = false

	observer = new MutationObserver((mutations) => {
		if (
			!mutations.some((mutation) =>
				Array.from(mutation.addedNodes).some(hasLazyloadCandidates),
			)
		) {
			return
		}

		if (pending) return
		pending = true

		queueMicrotask(() => {
			pending = false
			refreshLazyloadImages()
		})
	})

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	})
}

const init = (): void => {
	if (!initialized) {
		onScrollOrResize(loadImagesInRange)
		document.addEventListener(LAZYLOAD_REFRESH_EVENT, handleRefreshEvent)
		observeLazyloadMutations()
		initialized = true
	}

	refreshLazyloadImages()
}

export default init
