export const loadTemplate = template => {
	const fragment = template.content.cloneNode(true)
	if (!fragment) return null

	const el = fragment.firstElementChild
	if (!el) return null

	template.parentNode.replaceChild(el, template)

	return el
}
