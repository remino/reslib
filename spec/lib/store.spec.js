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
				const path = 'storePath.subPath'
				const value = 'storeValue'

				store(key, path, value)

				expect(store(key, path)).toBe(value)
				expect(store(key)).toEqual({ storePath: { subPath: value } })
			})

			it('deletes value from localStorage when value is null', () => {
				const key = 'storeKey'
				const path = 'storePath.subPath'
				const value = 'storeValue'

				store(key, path, value)
				store(key, path, null)

				expect(store(key, path)).toBeUndefined()
				expect(store(key)).toEqual({ storePath: {} })
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
					const path = 'storePath.subPath'
					const value = 'storeValue'

					podStore(path, value)

					expect(podStore(path)).toBe(value)
					expect(podStore()).toEqual({ storePath: { subPath: value } })
				})
			})
		})
	})
})
