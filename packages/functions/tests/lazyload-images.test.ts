import { afterEach, describe, expect, it, vi } from 'vitest'

const EMPTY_IMAGE =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('lazyloadImages', () => {
	afterEach(() => {
		document.body.innerHTML = ''
		vi.resetModules()
	})

	it('preserves plain image sources when unloading and restoring', async () => {
		const lazyloadModule = await import('../src/lazyload-images')
		const img = document.createElement('img')
		img.setAttribute('src', '/profile/aimee.avif')

		document.body.appendChild(img)

		const originalSrc = img.src

		lazyloadModule.unloadImage(img)

		expect(img.src).toBe(EMPTY_IMAGE)
		expect(img.getAttribute('data-src')).toBe(originalSrc)

		lazyloadModule.loadImage(img)

		expect(img.src).toBe(originalSrc)
	})

	it('initializes global listeners only once', async () => {
		const lazyloadModule = await import('../src/lazyload-images')
		const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

		lazyloadModule.default()
		const callsAfterFirstInit = addEventListenerSpy.mock.calls.length

		lazyloadModule.default()

		expect(addEventListenerSpy.mock.calls).toHaveLength(callsAfterFirstInit)
	})

	it('refreshes lazy templates when the generic refresh event fires', async () => {
		const lazyloadModule = await import('../src/lazyload-images')
		document.body.innerHTML =
			'<template class="lazyload"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/images/test.avif" /></template>'

		lazyloadModule.default()
		document.body.innerHTML =
			'<div id="swap-root"><template class="lazyload"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/images/next.avif" /></template></div>'

		const swapRoot = document.getElementById('swap-root')
		document.dispatchEvent(
			new CustomEvent(lazyloadModule.LAZYLOAD_REFRESH_EVENT, {
				detail: { root: swapRoot },
			}),
		)

		expect(document.querySelector('template.lazyload')).toBeNull()
		expect(document.querySelector('img')?.getAttribute('data-src')).toBe(
			'/images/next.avif',
		)
	})

	it('refreshes templates directly through the exported helper', async () => {
		const lazyloadModule = await import('../src/lazyload-images')
		document.body.innerHTML =
			'<section id="root"><template class="lazyload"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/images/direct.avif" /></template></section>'

		const root = document.getElementById('root')
		if (!root) throw new Error('expected test root')

		lazyloadModule.refreshLazyloadImages(root)

		expect(root.querySelector('template.lazyload')).toBeNull()
		expect(root.querySelector('img')?.getAttribute('data-src')).toBe(
			'/images/direct.avif',
		)
	})

	it('auto-refreshes when lazyload DOM is inserted later', async () => {
		const lazyloadModule = await import('../src/lazyload-images')

		lazyloadModule.default()
		document.body.innerHTML =
			'<div id="swap-root"><template class="lazyload"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/images/observer.avif" /></template></div>'

		await Promise.resolve()
		await Promise.resolve()

		expect(document.querySelector('template.lazyload')).toBeNull()
		expect(document.querySelector('img')?.getAttribute('data-src')).toBe(
			'/images/observer.avif',
		)
	})
})
