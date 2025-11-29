import type { PluginCreator } from 'postcss'

const addLvh: PluginCreator<void> = () => ({
	postcssPlugin: 'add-lvh',
	Declaration(decl) {
		const { value } = decl

		if (value.includes('vh') && !value.includes('lvh')) {
			const lvhValue = value.replace(/(\d+)vh/g, '$1lvh')
			decl.cloneAfter({ value: lvhValue })
		}
	},
})

addLvh.postcss = true

export default addLvh
