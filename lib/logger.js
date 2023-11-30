const log = data => {
	fetch('/logger', {
		method: 'POST',
		xLogLocation: window.location.href,
		body: JSON.stringify(data),
	})
}

const onError = event => {
	log({
		description: 'Exception',
		event,
	})
}

const onUnhandledRejection = event => {
	log({ description: 'Unhandled rejection', event })
}

const init = () => {
	window.addEventListener('error', onError)
	window.addEventListener('unhandledrejection', onUnhandledRejection)
}

export default init
