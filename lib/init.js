const start = ({ serial, parallel }) => {
	[...serial].forEach(func => func())
	Promise.all([...parallel].map(func => new Promise(resolve => func(resolve)))).then()
}

const init = funcs => {
	if (document.readyState === 'interactive') {
		start(funcs)
	} else {
		document.addEventListener('DOMContentLoaded', () => start(funcs))
	}
}

export default init
