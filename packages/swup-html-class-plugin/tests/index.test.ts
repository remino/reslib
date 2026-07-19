import { beforeEach, describe, expect, it, vi } from 'vitest'
import SwupHtmlClassPlugin from '../src/index'

interface HookMap {
	[hook: string]: ((visit: { to?: { document?: Document | null } }) => void) | undefined
}

const createSwup = () => {
	const handlers: HookMap = {}

	return {
		handlers,
		log: vi.fn(),
		hooks: {
			on: vi.fn((hook: string, handler: HookMap[string]) => {
				handlers[hook] = handler
			}),
			off: vi.fn((hook: string, handler: HookMap[string]) => {
				if (handlers[hook] === handler) delete handlers[hook]
			}),
		},
	}
}

const createVisitDocument = (className: string): Document => {
	const nextDocument = document.implementation.createHTMLDocument('Next page')
	nextDocument.documentElement.className = className
	return nextDocument
}

describe('SwupHtmlClassPlugin', () => {
	beforeEach(() => {
		document.documentElement.className = 'js menu-open'
		document.body.innerHTML = ''
	})

	it('registers and unregisters its swup hook', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin()

		plugin.swup = swup
		plugin.mount()

		expect(swup.hooks.on).toHaveBeenCalledWith(
			'content:replace',
			expect.any(Function),
		)

		plugin.unmount()

		expect(swup.hooks.off).toHaveBeenCalledWith(
			'content:replace',
			expect.any(Function),
		)
	})

	it('copies next-page classes onto the html element', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin()
		plugin.swup = swup
		plugin.mount()

		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-about theme-light') },
		})

		expect(document.documentElement.className).toBe(
			'js menu-open page-about theme-light',
		)
	})

	it('replaces only previously managed classes on subsequent visits', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin({
			classFilter: [/^page-/, /^theme-/],
		})
		plugin.swup = swup
		plugin.mount()

		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-about theme-light') },
		})
		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-work theme-dark') },
		})

		expect(document.documentElement.className).toBe(
			'js menu-open page-work theme-dark',
		)
	})

	it('supports exact-match filters', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin({
			classFilter: ['page-about', 'theme-light'],
		})
		plugin.swup = swup
		plugin.mount()

		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-about theme-light nav-open') },
		})

		expect(document.documentElement.className).toBe(
			'js menu-open page-about theme-light',
		)
	})

	it('supports callback filters', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin({
			classFilter: (className) => className.startsWith('page-'),
		})
		plugin.swup = swup
		plugin.mount()

		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-contact theme-light') },
		})

		expect(document.documentElement.className).toBe('js menu-open page-contact')
	})

	it('cleans up managed classes on unmount', () => {
		const swup = createSwup()
		const plugin = new SwupHtmlClassPlugin({
			classFilter: /^page-/,
		})
		plugin.swup = swup
		plugin.mount()

		swup.handlers['content:replace']?.({
			to: { document: createVisitDocument('page-home') },
		})
		plugin.unmount()

		expect(document.documentElement.className).toBe('js menu-open')
	})
})
