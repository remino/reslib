const log = data => {
	fetch('/logger', {
		method: 'POST',
		xLogLocation: window.location.href,
		body: JSON.stringify(data),
	})
}

const onError = (event, source, lineno, colno, error) => {
	log({
		title: 'Exception',
		source,
		lineno,
		colno,
		error,
	})
}

const onUnhandledRejection = ({ reason }) => {
	log({ title: 'Unhandled rejection', reason })
}

const init = () => {
	window.addEventListener('error', onError)
	window.addEventListener('unhandledrejection', onUnhandledRejection)
}

export default init
