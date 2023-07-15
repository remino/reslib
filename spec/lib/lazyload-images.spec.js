import { JSDOM } from 'jsdom'
import { loadLazyloadTemplates } from '../../lib/lazyload-images.js'

describe('lib/lazyload-images.js', () => {
	describe('loadLazyloadTemplates()', () => {
		it('replaces lazyload templates with their contents', () => {
			const {
				window: { document },
			} = new JSDOM('<!DOCTYPE html><template class="lazyload"><img class="lazyload" /></template>')

			global.document = document

			loadLazyloadTemplates()

			expect(document.querySelectorAll('template').length).toBe(0)
			expect(document.querySelectorAll('img.lazyload').length).toBe(1)
		})
	})
})
