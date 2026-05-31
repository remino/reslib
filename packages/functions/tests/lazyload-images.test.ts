import { afterEach, describe, expect, it } from 'vitest'
import { loadImage, unloadImage } from '../src/lazyload-images'

const EMPTY_IMAGE =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('lazyloadImages', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('preserves plain image sources when unloading and restoring', () => {
		const img = document.createElement('img')
		img.setAttribute('src', '/profile/aimee.avif')

		document.body.appendChild(img)

		const originalSrc = img.src

		unloadImage(img)

		expect(img.src).toBe(EMPTY_IMAGE)
		expect(img.getAttribute('data-src')).toBe(originalSrc)

		loadImage(img)

		expect(img.src).toBe(originalSrc)
	})
})
