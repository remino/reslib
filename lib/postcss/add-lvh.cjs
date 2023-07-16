const postcss = require('postcss')

module.exports = postcss.plugin('add-lvh', () => {
	return root => {
		root.walkDecls(decl => {
			const value = decl.value

			if (value.includes('vh') && !value.includes('lvh')) {
				const lvhValue = value.replace(/(\d+)vh/g, '$1lvh')
				decl.cloneAfter({ value: lvhValue })
			}
		})
	}
})
