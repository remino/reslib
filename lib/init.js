const start = (
    { parallel = [], serial = [] } = { parallel: [], serial: [] },
) => {
    serial.forEach((func) => func())

    return Promise.all(
        parallel.map((func) => new Promise((resolve) => func(resolve))),
    ).catch(() => {})
}

const init = (funcs) => {
	if (document.readyState === 'interactive') {
		start(funcs)
	} else {
		document.addEventListener('DOMContentLoaded', () => start(funcs))
	}
}

export default init
