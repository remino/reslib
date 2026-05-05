import { describe, expect, it } from 'vitest'
import getArticleSummary from './article-summary'

describe('getArticleSummary', () => {
	it.each([
		'<!--more-->',
		'<!--  MORE  -->',
		'<!-- more -->',
		'<!--MoRe-->',
	])('prefers content before marker variant %s', (marker) => {
		const summary = getArticleSummary({
			content: ['Intro paragraph.', marker, 'Rest of the article.'].join('\n\n'),
			summary: 'Frontmatter summary',
		})

		expect(summary).toBe('Intro paragraph.')
	})

	it('falls back to frontmatter summary when there is no more marker', () => {
		const summary = getArticleSummary({
			content: 'Full article body.',
			summary: 'Frontmatter summary',
		})

		expect(summary).toBe('Frontmatter summary')
	})

	it('uses the last full paragraph within the max length when no explicit summary exists', () => {
		const summary = getArticleSummary({
			content: [
				'First paragraph stays under the limit.',
				'Second paragraph also stays under the limit and should be included.',
				'Third paragraph pushes the excerpt over the edge.',
			].join('\n\n'),
			maxLength: 120,
		})

		expect(summary).toBe(
			'First paragraph stays under the limit. Second paragraph also stays under the limit and should be included.',
		)
	})

	it('falls back to the first paragraph slice when a single paragraph exceeds the limit', () => {
		const content =
			'This is a very long first paragraph that intentionally exceeds the configured limit so we can still produce a preview.'

		const summary = getArticleSummary({
			content,
			maxLength: 60,
		})

		expect(summary).toBe(content.slice(0, 60))
	})

	it('returns undefined when there is no usable content', () => {
		const summary = getArticleSummary({
			content: '   ',
			summary: '   ',
		})

		expect(summary).toBeUndefined()
	})
})
