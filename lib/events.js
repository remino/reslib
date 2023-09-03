export const onScrollOrResize = func => {
	window.addEventListener('resize', func)
	window.addEventListener('scroll', func)
}

export const preventDefaultIfTrue = (event, func) => {
	if (!func(event)) return
	event.preventDefault()
	event.stopPropagation()
}
