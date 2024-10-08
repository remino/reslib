/* eslint-disable no-use-before-define */

let scrollYTarget
let sectionSelector

export const getSections = () => document.querySelectorAll(sectionSelector)

const getScrollTarget = () => scrollYTarget

const setScrollTarget = y => {
	scrollYTarget = y
}

export const clearScrollTarget = () => {
	setScrollTarget(null)
}

export const setSectionSelector = selector => {
	sectionSelector = selector
}

export const isCurrentSection = section => {
	const { innerHeight } = window
	const { top, bottom } = section.getBoundingClientRect()
	const middle = innerHeight / 2
	return top <= middle && bottom >= middle
}

export const isCurrentSectionFirstOrLast = () => {
	const current = getCurrentSection()
	return isSectionFirst(current) || isSectionLast(current)
}

export const getCurrentSectionIndex = () => Array
	.from(getSections()).findLastIndex(isCurrentSection)

export const getCurrentSection = () => Array.from(getSections()).findLast(isCurrentSection)
export const getFirstSection = () => getSections()[0]
export const getLastSection = () => getSections()[getSections().length - 1]
export const isSectionFirst = section => section === getFirstSection()
export const isSectionLast = section => section === getLastSection()

export const getNextSection = () => {
	const currentIndex = getCurrentSectionIndex()
	if (currentIndex === -1) return null
	return getSections()[currentIndex + 1] || null
}

export const getPreviousSection = () => {
	const currentIndex = getCurrentSectionIndex()
	if (currentIndex === -1) return null
	return getSections()[currentIndex - 1]
}

export const clearScrollTargetWhenArrived = () => {
	const target = getScrollTarget()
	if (window.scrollY === Math.ceil(target) || window.scrollY === Math.floor(target)) {
		clearScrollTarget()
	}
}

const scrollToY = (y, { behavior = 'auto' } = {}) => {
	const newTargetInSameDirection = Math.sign(y - window.scrollY)
		=== Math.sign(getScrollTarget() - window.scrollY)

	// eslint-disable-next-line no-nested-ternary
	const scrollBehavior = behavior !== 'auto' ? behavior
		: getScrollTarget() && newTargetInSameDirection ? 'instant' : 'smooth'

	setScrollTarget(y)

	window.scrollTo({ top: y, behavior: scrollBehavior })
}

export const scrollElementToCenter = (element, opts) => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height / 2 - innerHeight / 2
	scrollToY(target, opts)
}

export const scrollElementToEnd = (element, opts) => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height - innerHeight
	scrollToY(target, opts)
}

export const scrollElementToStart = (element, opts) => {
	const { top } = element.getBoundingClientRect()
	const { scrollY } = window
	const target = scrollY + top
	scrollToY(target, opts)
}

export const jumpToSection = (section, opts) => {
	switch (section.dataset.reslibScrollJumpTo) {
		case 'center':
			scrollElementToCenter(section, opts)
			break

		case 'end':
			scrollElementToEnd(section, opts)
			break

		default:
			scrollElementToStart(section, opts)
	}
}

export const goToPreviousSection = () => {
	if (isSectionFirst(getCurrentSection())) return false
	jumpToSection(getPreviousSection() || getFirstSection())
	return true
}

export const goToNextSection = () => {
	if (isSectionLast(getCurrentSection())) return false
	jumpToSection(getNextSection() || getLastSection())
	return true
}

export const goToFirstSection = () => {
	if (isSectionFirst(getCurrentSection())) return false
	jumpToSection(getFirstSection())
	return true
}

export const goToLastSection = () => {
	if (isSectionLast(getCurrentSection())) return false
	jumpToSection(getLastSection())
	return true
}

const init = selector => {
	if (!selector) throw new Error('Missing selector')
	setSectionSelector(selector)
	window.addEventListener('resize', clearScrollTarget)
	window.addEventListener('scroll', clearScrollTargetWhenArrived)
}

export default init
