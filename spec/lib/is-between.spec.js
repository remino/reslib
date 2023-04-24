import isBetween from '../../lib/is-between.js'

describe('lib/is-between.js', () => {
	describe('isBetween()', () => {
		it('returns true if the value is equal to minimum', () => {
			expect(isBetween(1, 1, 2)).toBe(true)
		})

		it('returns true if the value is equal to maximum', () => {
			expect(isBetween(2, 1, 2)).toBe(true)
		})

		it('returns true if the value is between minimum and maximum', () => {
			expect(isBetween(1.5, 1, 2)).toBe(true)
		})

		it('returns false if the value is less than minimum', () => {
			expect(isBetween(0, 1, 2)).toBe(false)
		})

		it('returns false if the value is greater than maximum', () => {
			expect(isBetween(3, 1, 2)).toBe(false)
		})
	})
})
