import dig, { undig } from './dig'

const getStorage = (): Storage => {
	const { localStorage } = window
	if (!localStorage) throw new Error('localStorage is not supported')
	return localStorage
}

const read = (key: string) => {
	const storage = getStorage()
	const raw = storage.getItem(key)
	return raw ? JSON.parse(raw) : {}
}

const write = (key: string, value: unknown) => {
	const storage = getStorage()
	storage.setItem(key, JSON.stringify(value))
}

export type StoreValue = unknown

export function store<T = StoreValue>(
	key: string,
	path?: string,
	value?: T | null,
): T | Record<string, unknown> | null | undefined {
	const data = read(key)

	if (!path) return data

	if (typeof value === 'undefined') {
		return dig<T | undefined>(data, path)
	}

	if (value === null) {
		undig(data, path)
	} else {
		dig(data, path, value)
	}

	write(key, data)

	return value as T | null | undefined
}

const getPodName = (): string => {
	const { pathname } = window.location
	const [, podName] = pathname.split('/')
	return podName ?? ''
}

export const podStore = <T = StoreValue>(
	path?: string,
	value?: T | null,
): T | Record<string, unknown> | null | undefined =>
	store<T>(getPodName(), path, value)

export default store
