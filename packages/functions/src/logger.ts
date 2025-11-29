export type LogPayload = Record<string, unknown>

export const log = (data: LogPayload): void => {
	void fetch('/logger', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Log-Location': window.location.href,
		},
		body: JSON.stringify(data),
	})
}

export const onError = (event: ErrorEvent): void => {
	log({
		description: 'Exception',
		event,
	})
}

export const onUnhandledRejection = (event: PromiseRejectionEvent): void => {
	log({ description: 'Unhandled rejection', event })
}

const init = (): void => {
	window.addEventListener('error', onError)
	window.addEventListener('unhandledrejection', onUnhandledRejection)
}

export default init
