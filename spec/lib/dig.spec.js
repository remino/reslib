import dig, { undig } from '../../lib/dig.js'

describe('lib/dig.js', () => {
	describe('dig()', () => {
		it('returns undefined if value is not found', () => {
			expect(dig({}, 'a')).toBeUndefined()
		})

		it('returns undefined if parent value is not an object', () => {
			expect(dig({ a: 'b' }, 'a.b')).toBeUndefined()
		})

		it('returns value from object', () => {
			expect(dig({ a: { b: { c: 'd' } } }, 'a.b.c')).toBe('d')
		})

		it('sets value on object', () => {
			const object = {}
			dig(object, 'a.b.c', 'e')
			expect(object).toEqual({ a: { b: { c: 'e' } } })
		})

		it('throws error if parent value is not an object', () => {
			expect(() => dig({ a: 'b' }, 'a.b.c', 'd')).toThrow()
		})

		it('does not create object if value is undefined', () => {
			const object = {}
			dig(object, 'a.b.c')
			expect(object).toEqual({})
		})
	})

	describe('undig()', () => {
		it('returns true if value is not found', () => {
			expect(undig({}, 'a')).toBe(true)
		})

		it('returns true if parent value is not an object', () => {
			expect(undig({ a: 'b' }, 'a.b')).toBe(true)
		})

		it('returns true if value is deleted', () => {
			const object = { a: { b: { c: 'd' } } }
			expect(undig(object, 'a.b.c')).toBe(true)
			expect(object).toEqual({ a: { b: {} } })
		})

		it('throws error if parent value is not an object', () => {
			expect(() => undig({ a: 'b' }, 'a.b.c')).toThrow()
		})
	})
})
