import { getSections, isCurrentSection } from './sections.js'

const fragments = {}
const observers = []

const isPersisted = target => target.dataset.scrollLoad === 'persist'
const getTargetIndex = target => Array.from(getSections()).indexOf(target)

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

	target.appendChild(fragments[target.id])

	delete fragments[target.id]
}

const unload = target => {
	if (isPersisted(target) || !target.firstChild) return

	const fragment = document.createDocumentFragment()

	while (target.firstChild) {
		fragment.appendChild(target.firstChild)
	}

	fragments[target.id] = fragment
}

const enter = target => {
	[getPrecedingTarget(target), target, getFollowingTarget(target)].forEach(load)
}

const exit = target => {
	[getPrecedingTarget(target), target, getFollowingTarget(target)]
		.filter(t => !isCurrentSection(t))
		.forEach(unload)
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
