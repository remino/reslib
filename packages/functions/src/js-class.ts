export const addJsClass = (doc: Document = document): void => {
	const { classList } = doc.documentElement
	classList.add('js')
	classList.remove('no-js')
}

const init = (doc: Document = document): void => {
	addJsClass(doc)
}

export default init
