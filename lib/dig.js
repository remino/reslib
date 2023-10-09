/**
 * Get or set a value in an object by dot notation.
 *
 * Automatically creates objects for missing keys when setting a value.
 *
 * Returns undefined when getting a value that does not exist.
 *
 * @param {object} object The object to get or set the value on.
 * @param {string} path The path to the value.
 * @param {any} value The value to set. If undefined, returns the current value.
 * @returns {any} The value.
 */
const dig = (object, path, value) => {
	const keys = path.split('.')

	if (typeof value === 'undefined') {
		return keys.reduce((obj, key) => obj && obj[key], object)
	}

	const lastKey = keys.pop()
	const parent = keys.reduce((obj, key) => {
		if (typeof obj[key] === 'undefined') {
			// eslint-disable-next-line no-param-reassign
			obj[key] = {}
		}

		return obj[key]
	}, object)

	parent[lastKey] = value

	return value
}

export default dig
