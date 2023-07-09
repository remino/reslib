const postcss = require('postcss')
const valueParser = require('postcss-value-parser')

module.exports = postcss.plugin('add-font-variation', () => {
	return root => {
		root.walkDecls('font-weight', decl => {
			const value = decl.value

			const transformedValue = valueParser(value)
				.walk(node => {
					if (node.type === 'word' && node.value === value) {
						node.value = `"wght" ${node.value}`
					}
					return node
				})
				.toString()

			decl.cloneBefore({
				prop: 'font-variation-settings',
				value: transformedValue,
			})
		})
	}
})
