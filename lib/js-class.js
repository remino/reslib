export const addJsClass = () => {
	const { classList } = document.documentElement
	classList.add('js')
	classList.remove('no-js')
}

const init = () => {
	addJsClass()
}

export default init
