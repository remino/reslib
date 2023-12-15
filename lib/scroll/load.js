import { getSections, isCurrentSection } from './sections.js'

const fragments = {}
const observers = []

const isPersisted = target => target.dataset.scrollLoad === 'persist'
const getTargetIndex = target => Array.from(getSections()).indexOf(target)

const dispatchEvent = (target, type) => {
	target.dispatchEvent(new CustomEvent(
		type,
		{ bubbles: true, cancelable: true },
	))
}

const getFollowingTarget = target => {
	const currentIndex = getTargetIndex(target)
	if (currentIndex === -1) return null
	return getSections()[currentIndex + 1] || null
}

const getPrecedingTarget = target => {
	const currentIndex = getTargetIndex(target)
	if (currentIndex === -1) return null
	return getSections()[currentIndex - 1]
}

const load = target => {
	if (isPersisted(target) || target.firstChild) return

	dispatchEvent(target, 'reslib:load:before')

	target.appendChild(fragments[target.id])

	delete fragments[target.id]

	dispatchEvent(target, 'reslib:load:after')
}

const unload = target => {
	if (isPersisted(target) || !target.firstChild) return

	dispatchEvent(target, 'reslib:unload:before')

	const fragment = document.createDocumentFragment()

	while (target.firstChild) {
		fragment.appendChild(target.firstChild)
	}

	fragments[target.id] = fragment

	dispatchEvent(target, 'reslib:unload:after')
}

const enter = target => {
	dispatchEvent(target, 'reslib:enter:before')

	Array.from([getPrecedingTarget(target), target, getFollowingTarget(target)])
		.filter(v => v)
		.forEach(load)

	dispatchEvent(target, 'reslib:enter:after')
}

const exit = target => {
	dispatchEvent(target, 'reslib:exit:before')

	Array.from([getPrecedingTarget(target), target, getFollowingTarget(target)])
		.filter(v => v)
		.filter(t => !isCurrentSection(t))
		.forEach(unload)

	dispatchEvent(target, 'reslib:exit:after')
}

const intersecting = ([{ target, isIntersecting }]) => {
	if (isIntersecting) {
		enter(target)
	} else {
		exit(target)
	}
}

const init = () => {
	if (!window.IntersectionObserver) return

	getSections().forEach(target => {
		if (isPersisted(target)) return

		const observer = new IntersectionObserver(
			intersecting,
			{
				rootMargin: '-100px 0px -100px 0',
				threshold: 0,
			},
		)

		observer.observe(target)
		observers.push(observer)

		if (isCurrentSection(target)) return

		unload(target)
	})
}

export default init
