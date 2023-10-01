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

export const getCurrentSectionIndex = () =>
	Array.from(getSections()).findLastIndex(isCurrentSection)

export const getCurrentSection = () => Array.from(getSections()).findLast(isCurrentSection)
export const getFirstSection = () => getSections()[0]
export const isSectionFirst = section => section === getFirstSection()
export const isSectionLast = section => section === getLastSection()

export const getLastSection = () => {
	const sections = getSections()
	return sections[sections.length - 1]
}

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

const scrollToY = y => {
	const newTargetInSameDirection = Math.sign(y - scrollY) === Math.sign(getScrollTarget() - scrollY)
	const behavior = getScrollTarget() && newTargetInSameDirection ? 'instant' : 'smooth'

	setScrollTarget(y)

	window.scrollTo({ top: y, behavior })
}

export const scrollElementToCenter = element => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height / 2 - innerHeight / 2
	scrollToY(target)
}

export const scrollElementToEnd = element => {
	const { top, height } = element.getBoundingClientRect()
	const { innerHeight, scrollY } = window
	const target = scrollY + top + height - innerHeight
	scrollToY(target)
}

export const scrollElementToStart = element => {
	const { top } = element.getBoundingClientRect()
	const { scrollY } = window
	const target = scrollY + top
	scrollToY(target)
}

export const jumpToSection = section => {
	switch (section.dataset.reslibScrollJumpTo) {
		case 'center':
			scrollElementToCenter(section)
			break

		case 'end':
			scrollElementToEnd(section)
			break

		default:
			scrollElementToStart(section)
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
