type RemarkNode = {
	type: string
	value?: string
	children?: RemarkNode[]
	alt?: string
	url?: string
	title?: string
	data?: {
		hName?: string
		hProperties?: Record<string, unknown>
		hChildren?: RemarkNode[]
	}
}

const walk = (node: RemarkNode, visitor: (child: RemarkNode) => void) => {
	const children = node.children
	if (!children) return
	for (const child of children) {
		visitor(child)
		walk(child, visitor)
	}
}

const isImage = (node: RemarkNode | undefined): boolean =>
	!!node && node.type === 'image'

const isLinkWithSingleImage = (node: RemarkNode | undefined): boolean =>
	!!node &&
	node.type === 'link' &&
	Array.isArray(node.children) &&
	node.children.length === 1 &&
	isImage(node.children[0])

const nodeHasImage = (node: RemarkNode): boolean => {
	if (isImage(node)) return true
	const children = node.children
	if (!children) return false
	return children.some((child: RemarkNode) => nodeHasImage(child))
}

const isWhitespaceText = (node: RemarkNode) =>
	node.type === 'text' &&
	typeof node.value === 'string' &&
	node.value.trim() === ''

const trimCaptionStart = (nodes: RemarkNode[]) => {
	while (nodes.length > 0) {
		const first = nodes[0]
		if (first.type === 'text' && typeof first.value === 'string') {
			first.value = first.value.replace(/^\s+/, '')
			if (first.value.length === 0) {
				nodes.shift()
				continue
			}
		}
		break
	}
	return nodes
}

const ensureData = (node: RemarkNode) => {
	if (!node.data) node.data = {}
	return node.data
}

const remarkFigureParagraphs = () => {
	return (tree: RemarkNode) => {
		walk(tree, node => {
			const children = node.children
			if (!children || children.length === 0 || node.type !== 'paragraph')
				return

				const [firstChild, ...rest] = children

			const hasLeadingImage =
				isImage(firstChild) || isLinkWithSingleImage(firstChild)
			if (!hasLeadingImage) return

			if (rest.length === 0) {
				const data = ensureData(node)
				data.hName = 'figure'
				node.children = [firstChild]
				return
			}

			if (rest.some(child => nodeHasImage(child))) return

			const captionNodes = trimCaptionStart([...rest])
			const hasCaptionContent = captionNodes.some(
				child => !isWhitespaceText(child),
			)

			const data = ensureData(node)
			data.hName = 'figure'

			if (!hasCaptionContent) {
				node.children = [firstChild]
				return
			}

				const caption: RemarkNode = {
					type: 'paragraph',
					children: captionNodes,
					data: { hName: 'figcaption' },
				}

			node.children = [firstChild, caption]
		})
	}
}

export default remarkFigureParagraphs
