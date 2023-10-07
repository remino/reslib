import '../support/mock-local-storage.js'
import store, { podStore } from '../../lib/store.js'

describe('lib/store.js', () => {
	describe('with localStorage', () => {
		afterEach(() => {
			localStorage.clear()
		})

		describe('store()', () => {
			it('reads and writes to localStorage', () => {
				const key = 'storeKey'
				const name = 'storeName'
				const value = 'storeValue'

				store(key, name, value)

				expect(store(key, name)).toBe(value)
				expect(store(key)).toEqual({ [name]: value })
			})
		})

		describe('with window location', () => {
			afterAll(() => {
				delete window.location
			})

			beforeAll(() => {
				window.location = { pathname: '/podName/subpage' }
			})

			describe('podStore()', () => {
				it('reads and writes to localStorage for current pod', () => {
					const name = 'storeName'
					const value = 'storeValue'

					podStore(name, value)

					expect(podStore(name)).toBe(value)
					expect(podStore()).toEqual({ [name]: value })
				})
			})
		})
	})
})
