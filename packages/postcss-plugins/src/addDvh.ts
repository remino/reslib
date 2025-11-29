import type { PluginCreator } from 'postcss'

const addDvh: PluginCreator<void> = () => ({
	postcssPlugin: 'add-dvh',
	Declaration(decl) {
		const { value } = decl

		if (value.includes('vh') && !value.includes('dvh')) {
			const dvhValue = value.replace(/(\d+)vh/g, '$1dvh')
			decl.cloneAfter({ value: dvhValue })
		}
	},
})

addDvh.postcss = true

export default addDvh
