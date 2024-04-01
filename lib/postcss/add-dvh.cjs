const postcss = require('postcss')

module.exports = postcss.plugin('add-dvh', () => {
	return root => {
		root.walkDecls(decl => {
			const value = decl.value

			if (value.includes('vh') && !value.includes('dvh')) {
				const dvhValue = value.replace(/(\d+)vh/g, '$1dvh')
				decl.cloneAfter({ value: dvhValue })
			}
		})
	}
})
