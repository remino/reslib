/**
 * Store module.
 *
 * A simple wrapper around localStorage.
 *
 * @module lib/store
 */

import dig, { undig } from './dig.js'

/**
 * Get or set a value in local storage.
 *
 * @param {string} key The key to use in local storage.
 * @param {string} path The path to the value.
 * @param {any} value The value to set. If undefined, returns the current value.
 * @returns {any} The value of the key/name pair.
 */
const store = (key, path, value) => {
	const { localStorage: storage } = window

	if (!storage) throw new Error('localStorage is not supported')

	const data = JSON.parse(storage.getItem(key) || '{}')

	if (!path) return data

	if (typeof value === 'undefined') return dig(data, path)

	if (value === null) {
		undig(data, path)
	} else {
		dig(data, path, value)
	}

	storage.setItem(key, JSON.stringify(data))

	return value
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
 * @param {string} path The path to the value.
 * @param {any} value The value to set. If undefined, returns the current value.
 * @returns {any} The value of the key/name pair.
 */
export const podStore = (path, value) => store(getPodName(), path, value)

export default store
