import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

const rehypeBackToTopNav = () => {
	return (tree: Root) => {
		visit(tree, 'element', (node, _index, _parent) => {
			if (
				node.tagName === 'p' &&
				node.children.length === 1 &&
				node.children[0].type === 'element'
			) {
				const anchor = node.children[0] as Element

				if (
					anchor.tagName === 'a' &&
					typeof anchor.properties?.href === 'string' &&
					anchor.properties.href === '#'
				) {
					node.tagName = 'nav' // Replace <p> with <nav>
					node.properties.class =
						`nav-back-to-top ${node.properties.class || ''}`.trim()
					anchor.children = [
						{
							type: 'element',
							tagName: 'span',
							properties: { class: 'icon icon--top' },
							children: [],
						},
						{
							type: 'text',
							value: 'Back to top',
						},
					]
				}
			}
		})
	}
}

export default rehypeBackToTopNav
