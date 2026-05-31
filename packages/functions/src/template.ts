export const loadTemplate = (template: HTMLTemplateElement): Element | null => {
	const fragment = template.content.cloneNode(true) as DocumentFragment

	const element = fragment.firstElementChild
	if (!element || !template.parentNode) return null

	template.parentNode.replaceChild(element, template)

	return element
}

export default loadTemplate
