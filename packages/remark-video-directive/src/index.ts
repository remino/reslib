type Node = {
	type: string
	name?: string
	value?: unknown
	label?: string | null
	attributes?: Record<string, unknown>
	children?: Node[]
	data?: {
		hName?: string
		hProperties?: Record<string, unknown>
		hChildren?: Node[]
	}
}

type VFile = {
	message?: (reason: string, node?: Node) => void
}

const isVideoDirective = (node: Node) =>
	(node.type === 'leafDirective' ||
		node.type === 'containerDirective' ||
		node.type === 'textDirective') &&
	node.name === 'video'

const visit = (
	node: Node,
	callback: (node: Node, ancestors: Node[]) => void,
	ancestors: Node[] = [],
) => {
	callback(node, ancestors)
	if (!node.children) return
	ancestors.push(node)
	for (const child of node.children) visit(child, callback, ancestors)
	ancestors.pop()
}

const ensureAttributes = (node: Node) => {
	if (!node.attributes) node.attributes = {}
	return node.attributes
}

const normaliseAttributes = (attributes: Record<string, unknown> = {}) => {
	const properties: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(attributes)) {
		if (value === null) {
			properties[key] = true
			continue
		}
		if (typeof value === 'string') {
			const lowered = value.toLowerCase()
			if (lowered === 'true') {
				properties[key] = true
				continue
			}
			if (lowered === 'false') {
				properties[key] = false
				continue
			}
		}
		properties[key] = value
	}
	return properties
}

const buildChildren = (node: Node): Node[] | undefined => {
	if (node.type === 'containerDirective') return undefined
	if (
		(node.type === 'leafDirective' || node.type === 'textDirective') &&
		node.label
	) {
		return [{ type: 'text', value: node.label }]
	}
	return undefined
}

const ensureData = (node: Node) => {
	if (!node.data) node.data = {}
	return node.data
}

const remarkVideoDirective = () => {
	return (tree: Node, file: VFile) => {
		visit(tree, (node, ancestors) => {
			if (!isVideoDirective(node)) return

			if (node.type === 'textDirective') {
				const parent =
					ancestors.length > 0 ? ancestors[ancestors.length - 1] : undefined
				const grandparent =
					ancestors.length > 1 ? ancestors[ancestors.length - 2] : undefined
				if (
					parent?.type === 'paragraph' &&
					Array.isArray(parent.children) &&
					grandparent &&
					Array.isArray(grandparent.children)
				) {
					const nodeIndex = parent.children.indexOf(node)
					if (nodeIndex !== -1) parent.children.splice(nodeIndex, 1)
					const parentIndex = grandparent.children.indexOf(parent)

					node.type = 'leafDirective'
					if (parent.children.length === 0 && parentIndex !== -1) {
						grandparent.children.splice(parentIndex, 1, node)
					} else if (parentIndex !== -1) {
						grandparent.children.splice(parentIndex + 1, 0, node)
					}
				}
			}

			const data = ensureData(node)
			const attributes = ensureAttributes(node)
			const properties = normaliseAttributes(attributes)

			if (!('controls' in properties)) properties.controls = true

			if (!('controls' in attributes)) attributes.controls = null

			if (!properties.src && file.message) {
				file.message('`video` directives require a `src` attribute', node)
				return
			}

			data.hName = 'video'
			data.hProperties = properties

			const childNodes = buildChildren(node)
			if (childNodes) data.hChildren = childNodes
		})
	}
}

export default remarkVideoDirective
