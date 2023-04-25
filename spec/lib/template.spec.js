import { JSDOM } from 'jsdom'
import { loadTemplate } from '../../lib/template.js'

describe('lib/template.js', () => {
	describe('loadTemplate()', () => {
		it('replaces <template> with its contents', () => {
			const dom = new JSDOM('<!DOCTYPE html><body><template><h1>Content</h1></template>')
			const {
				window: { document },
			} = dom

			loadTemplate(document.getElementsByTagName('template')[0])

			expect(dom.serialize()).toBe(
				'<!DOCTYPE html><html><head></head><body><h1>Content</h1></body></html>'
			)
		})
	})
})
