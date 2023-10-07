/**
 * Store module.
 *
 * A simple wrapper around localStorage.
 *
 * @module lib/store
 */

/**
 * Get or set a value in local storage.
 *
 * @param {string} key The key to use in local storage.
 * @param {string} name The name of the value to get or set.
 * @param {any} value The value to set. If undefined, returns the current value.
 * @returns {any} The value of the key/name pair.
 */
const store = (key, name, value) => {
	const { localStorage: storage } = window

	if (!storage) throw new Error('localStorage is not supported')

	const data = JSON.parse(storage.getItem(key) || '{}')

	if (name) {
		if (typeof value === 'undefined') return data[name]

		if (value === null) {
			delete data[name]
		} else {
			data[name] = value
		}

		storage.setItem(key, JSON.stringify(data))

		return value
	}

	return data
}

/**
 * Returns the name of the pod, being the name of the top directory.
 *
 * @returns {string} The name of the pod.
 */
const getPodName = () => {
	const { pathname } = window.location
	const [, podName] = pathname.split('/')
	return podName
}

/**
 * Get or set a value in local storage for the current pod.
 *
 * @param {string} name The name of the value to get or set.
 * @param {any} value The value to set. If undefined, returns the current value.
 * @returns {any} The value of the key/name pair.
 */
export const podStore = (name, value) => store(getPodName(), name, value)

export default store
