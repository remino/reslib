export type Diggable = Record<string, unknown>

const ensureObject = (value: unknown, key: string): Diggable => {
	if (typeof value !== 'object' || value === null) {
		throw new TypeError(`Cannot dig through non-object value at "${key}"`)
	}
	return value as Diggable
}

export function dig<TValue = unknown>(
	object: Diggable,
	path: string,
	value?: TValue,
): TValue | undefined {
	const keys = path.split('.').filter(Boolean)
	if (!keys.length) throw new Error('Path must not be empty')

	if (typeof value === 'undefined') {
		return keys.reduce<unknown>((acc, key) => {
			if (acc === undefined || acc === null) return undefined
			if (typeof acc !== 'object') return undefined
			return (acc as Diggable)[key]
		}, object) as TValue | undefined
	}

	const lastKey = keys.pop() as string
	const parent = keys.reduce<Diggable>((acc, key) => {
		if (typeof acc[key] === 'undefined') {
			acc[key] = {}
		} else {
			acc[key] = ensureObject(acc[key], key)
		}
		return acc[key] as Diggable
	}, object)

	parent[lastKey] = value as unknown

	return value
}

export function undig(object: Diggable, path: string): boolean {
	const keys = path.split('.').filter(Boolean)
	if (!keys.length) return true

	const lastKey = keys.pop() as string
	let parent: Diggable = object

	for (let index = 0; index < keys.length; index += 1) {
		const key = keys[index]
		if (typeof parent[key] === 'undefined') {
			parent[key] = {}
		} else if (typeof parent[key] !== 'object' || parent[key] === null) {
			if (index === keys.length - 1) {
				return true
			}
			throw new TypeError(`Cannot dig through non-object value at "${key}"`)
		}

		parent = parent[key] as Diggable
	}

	if (typeof parent[lastKey] === 'undefined') return true
	delete parent[lastKey]

	return true
}

export default dig
