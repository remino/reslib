export type SerialTask = () => void
export type ParallelTask = (done: () => void) => void

export interface InitOptions {
	parallel?: ParallelTask[]
	serial?: SerialTask[]
}

export const start = ({
	parallel = [],
	serial = [],
}: InitOptions = {}): Promise<void[]> => {
	serial.forEach((task) => task())

	return Promise.all(
		parallel.map(
			(task) =>
				new Promise<void>((resolve) => {
					task(resolve)
				}),
		),
	).catch(() => [])
}

const init = (options?: InitOptions): void => {
	if (
		document.readyState === 'interactive' ||
		document.readyState === 'complete'
	) {
		void start(options)
		return
	}

	document.addEventListener('DOMContentLoaded', () => {
		void start(options)
	})
}

export default init
