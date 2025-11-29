export type EventCallback = (event: Event) => boolean

export const onScrollOrResize = (
	handler: EventListenerOrEventListenerObject,
): void => {
	window.addEventListener('resize', handler)
	window.addEventListener('scroll', handler)
}

export const preventDefaultIfTrue = (
	event: Event,
	callback: EventCallback,
): void => {
	if (!callback(event)) return
	event.preventDefault()
	event.stopPropagation()
}

export default {
	onScrollOrResize,
	preventDefaultIfTrue,
}
