import { getSections, isCurrentSection } from './sections'

const fragments = new Map<string, DocumentFragment>()
const observers: IntersectionObserver[] = []

const isPersisted = (target: Element): boolean =>
	target instanceof HTMLElement && target.dataset.scrollLoad === 'persist'

const getTargetIndex = (target: Element): number =>
	getSections().indexOf(target as HTMLElement)

const dispatchEvent = (target: Element, type: string): void => {
	target.dispatchEvent(
		new CustomEvent(type, { bubbles: true, cancelable: true }),
	)
}

const getFollowingTarget = (target: Element): Element | null => {
	const currentIndex = getTargetIndex(target)
	if (currentIndex === -1) return null
	return getSections()[currentIndex + 1] || null
}

const getPrecedingTarget = (target: Element): Element | null => {
	const currentIndex = getTargetIndex(target)
	if (currentIndex === -1) return null
	return getSections()[currentIndex - 1] || null
}

const load = (target: Element): void => {
	if (isPersisted(target) || target.firstChild) return

	dispatchEvent(target, 'reslib:load:before')

	const fragment = fragments.get(target.id)
	if (fragment) {
		target.appendChild(fragment)
		fragments.delete(target.id)
	}

	dispatchEvent(target, 'reslib:load:after')
}

const unload = (target: Element): void => {
	if (isPersisted(target) || !target.firstChild) return

	dispatchEvent(target, 'reslib:unload:before')

	const fragment = document.createDocumentFragment()

	while (target.firstChild) {
		fragment.appendChild(target.firstChild)
	}

	fragments.set(target.id, fragment)

	dispatchEvent(target, 'reslib:unload:after')
}

const enter = (target: Element): void => {
	dispatchEvent(target, 'reslib:enter:before')
	;[getPrecedingTarget(target), target, getFollowingTarget(target)]
		.filter((value): value is Element => Boolean(value))
		.forEach(load)

	dispatchEvent(target, 'reslib:enter:after')
}

const exit = (target: Element): void => {
	dispatchEvent(target, 'reslib:exit:before')
	;[getPrecedingTarget(target), target, getFollowingTarget(target)]
		.filter((value): value is Element => Boolean(value))
		.filter((section) => !isCurrentSection(section as HTMLElement))
		.forEach(unload)

	dispatchEvent(target, 'reslib:exit:after')
}

const intersecting: IntersectionObserverCallback = (entries) => {
	const [entry] = entries
	if (!entry) return

	if (entry.isIntersecting) {
		enter(entry.target)
	} else {
		exit(entry.target)
	}
}

const init = (): void => {
	if (typeof window.IntersectionObserver === 'undefined') return

	getSections().forEach((target) => {
		if (isPersisted(target)) return

		const observer = new IntersectionObserver(intersecting, {
			rootMargin: '-100px 0px -100px 0px',
			threshold: 0,
		})

		observer.observe(target)
		observers.push(observer)

		if (isCurrentSection(target)) return

		unload(target)
	})
}

export default init
