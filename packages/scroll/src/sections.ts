type ScrollSection = HTMLElement

let scrollYTarget: number | null = null
let sectionSelector = '[data-reslib-scroll]'

export const getSections = (): ScrollSection[] =>
	Array.from(document.querySelectorAll<ScrollSection>(sectionSelector))

const getScrollTarget = (): number | null => scrollYTarget

const setScrollTarget = (value: number | null): void => {
	scrollYTarget = value
}

export const clearScrollTarget = (): void => {
	setScrollTarget(null)
}

export const setSectionSelector = (selector: string): void => {
	sectionSelector = selector
}

export const isCurrentSection = (section: ScrollSection): boolean => {
	const { innerHeight } = window
	const { top, bottom } = section.getBoundingClientRect()
	const middle = innerHeight / 2
	return top <= middle && bottom >= middle
}

export const isCurrentSectionFirstOrLast = (): boolean => {
	const current = getCurrentSection()
	if (!current) return false
	return isSectionFirst(current) || isSectionLast(current)
}

const findLastIndex = (
	items: ScrollSection[],
	predicate: (section: ScrollSection) => boolean,
): number => {
	for (let i = items.length - 1; i >= 0; i -= 1) {
		if (predicate(items[i])) return i
	}
	return -1
}

export const getCurrentSectionIndex = (): number =>
	findLastIndex(getSections(), isCurrentSection)

export const getCurrentSection = (): ScrollSection | null => {
	const sections = getSections()
	const index = findLastIndex(sections, isCurrentSection)
	return index === -1 ? null : sections[index]
}

export const getFirstSection = (): ScrollSection | null =>
	getSections()[0] ?? null

export const getLastSection = (): ScrollSection | null => {
	const sections = getSections()
	return sections.length ? sections[sections.length - 1] : null
}

export const isSectionFirst = (section: ScrollSection | null): boolean => {
	if (!section) return false
	return section === getFirstSection()
}

export const isSectionLast = (section: ScrollSection | null): boolean => {
	if (!section) return false
	return section === getLastSection()
}

export const getNextSection = (): ScrollSection | null => {
	const sections = getSections()
	const currentIndex = getCurrentSectionIndex()
	if (currentIndex === -1) return null
	return sections[currentIndex + 1] ?? null
}

export const getPreviousSection = (): ScrollSection | null => {
	const sections = getSections()
	const currentIndex = getCurrentSectionIndex()
	if (currentIndex === -1) return null
	return sections[currentIndex - 1] ?? null
}

export const clearScrollTargetWhenArrived = (): void => {
	const target = getScrollTarget()
	if (target === null) return
	if (window.scrollY === Math.ceil(target) || window.scrollY === Math.floor(target)) {
		clearScrollTarget()
	}
}

const scrollToY = (y: number, options: ScrollToOptions = {}): void => {
	const previousTarget = getScrollTarget()
	const headingSameDirection =
		previousTarget !== null &&
		Math.sign(y - window.scrollY) === Math.sign(previousTarget - window.scrollY)

	const behavior: ScrollBehavior =
		options.behavior && options.behavior !== 'auto'
			? (options.behavior as ScrollBehavior)
			: previousTarget !== null && headingSameDirection
				? 'instant'
				: 'smooth'

	setScrollTarget(y)
	window.scrollTo({ top: y, behavior })
}

export const scrollElementToCenter = (
	element: ScrollSection,
	options?: ScrollToOptions,
): void => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height / 2 - innerHeight / 2
	scrollToY(target, options)
}

export const scrollElementToEnd = (
	element: ScrollSection,
	options?: ScrollToOptions,
): void => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height - innerHeight
	scrollToY(target, options)
}

export const scrollElementToStart = (
	element: ScrollSection,
	options?: ScrollToOptions,
): void => {
	const { top } = element.getBoundingClientRect()
	const { scrollY } = window
	const target = scrollY + top
	scrollToY(target, options)
}

export const jumpToSection = (
	section?: ScrollSection | null,
	options?: ScrollToOptions,
): void => {
	if (!section) return
	switch (section.dataset.reslibScrollJumpTo) {
		case 'center':
			scrollElementToCenter(section, options)
			break
		case 'end':
			scrollElementToEnd(section, options)
			break
		default:
			scrollElementToStart(section, options)
	}
}

export const goToPreviousSection = (): boolean => {
	const current = getCurrentSection()
	if (isSectionFirst(current)) return false
	jumpToSection(getPreviousSection() ?? getFirstSection())
	return true
}

export const goToNextSection = (): boolean => {
	const current = getCurrentSection()
	if (isSectionLast(current)) return false
	jumpToSection(getNextSection() ?? getLastSection())
	return true
}

export const goToFirstSection = (): boolean => {
	if (isSectionFirst(getCurrentSection())) return false
	jumpToSection(getFirstSection())
	return true
}

export const goToLastSection = (): boolean => {
	if (isSectionLast(getCurrentSection())) return false
	jumpToSection(getLastSection())
	return true
}

const init = (selector: string): void => {
	if (!selector) throw new Error('Missing selector')
	setSectionSelector(selector)
	window.addEventListener('resize', clearScrollTarget)
	window.addEventListener('scroll', clearScrollTargetWhenArrived)
}

export default init
