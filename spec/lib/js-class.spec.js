import { JSDOM } from 'jsdom'
import { addJsClass } from '../../lib/js-class.js'

describe('lib/js-class.js', () => {
	describe('addJsClass()', () => {
		it('replaces no-js CSS class in <html> with js class', () => {
			const {
				window: { document },
			} = new JSDOM('<!DOCTYPE html><html class="no-js"></html>')
			const { classList } = document.documentElement

			global.document = document

			addJsClass()

			expect(classList.contains('js')).toBe(true)
			expect(classList.contains('no-js')).toBe(false)
		})
	})
})
