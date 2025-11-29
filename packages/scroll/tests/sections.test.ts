import { beforeEach, describe, expect, it, vi } from 'vitest'
import initSections, {
	getCurrentSection,
	getSections,
	goToNextSection,
	goToPreviousSection,
	jumpToSection,
	scrollElementToCenter,
	scrollElementToEnd,
	scrollElementToStart,
	setSectionSelector,
} from '../src/sections.ts'

const mockRect = (top: number, height: number) => ({
	top,
	bottom: top + height,
	height,
	width: 100,
	left: 0,
	right: 100,
	x: 0,
	y: top,
	toJSON: () => ({}),
})

const setSectionRects = (tops: number[]) => {
	const sections = Array.from(
		document.querySelectorAll<HTMLElement>('[data-reslib-scroll]'),
	)

	sections.forEach((section, index) => {
		Object.defineProperty(section, 'getBoundingClientRect', {
			value: () => mockRect(tops[index] ?? 0, 500),
			configurable: true,
		})
	})
}

describe('scroll sections', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<section id="first" data-reslib-scroll></section>
			<section id="second" data-reslib-scroll></section>
			<section id="third" data-reslib-scroll data-reslib-scroll-jump-to="center"></section>
		`

		setSectionRects([0, 300, 900])

		Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
		Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
		window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

		setSectionSelector('[data-reslib-scroll]')
	})

	it('returns configured sections', () => {
		expect(getSections()).toHaveLength(3)
	})

	it('identifies the current section', () => {
		const current = getCurrentSection()
		expect(current?.id).toBe('second')
	})

	it('jumps to sections based on dataset hints', () => {
		const target = document.getElementById('third') as HTMLElement

		jumpToSection(target)
		expect(window.scrollTo).toHaveBeenCalled()

		scrollElementToStart(target)
		scrollElementToCenter(target)
		scrollElementToEnd(target)
		expect(window.scrollTo).toHaveBeenCalledTimes(4)
	})

	it('navigates between sections', () => {
		expect(goToNextSection()).toBe(true)
		setSectionRects([-600, -100, 400])
		expect(goToPreviousSection()).toBe(true)
	})

	it('initializes listeners with a selector', () => {
		initSections('[data-reslib-scroll]')
		expect(() => initSections('[data-reslib-scroll]')).not.toThrow()
	})
})
