import type { PluginCreator } from 'postcss'
import valueParser from 'postcss-value-parser'

const addFontVariation: PluginCreator<void> = () => ({
	postcssPlugin: 'add-font-variation',
	Declaration(decl) {
		if (decl.prop !== 'font-weight') return

		const parsed = valueParser(decl.value)
		const transformed = parsed
			.walk((node) => {
				if (node.type === 'word') {
					// eslint-disable-next-line no-param-reassign
					node.value = `"wght" ${node.value}`
				}
			})
			.toString()

		decl.cloneBefore({
			prop: 'font-variation-settings',
			value: transformed,
		})
	},
})

addFontVariation.postcss = true

export default addFontVariation
