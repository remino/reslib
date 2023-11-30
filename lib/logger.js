const log = data => {
	fetch('/logger', {
		method: 'POST',
		xLogLocation: window.location.href,
		body: JSON.stringify({ data }),
	})
}

const onError = (event, source, lineno, colno, error) => {
	log({
		source, lineno, colno, error,
	})
}

const onUnhandledRejection = ({ reason }) => {
	log(reason)
}

const init = () => {
	window.addEventListener('error', onError)
	window.addEventListener('unhandledrejection', onUnhandledRejection)
}

export default init
