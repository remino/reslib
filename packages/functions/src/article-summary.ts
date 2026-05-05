export type ArticleSummaryInput = {
  content?: string | null
  summary?: string | null
  description?: string | null
  moreMarker?: string
  maxLength?: number
}

const defaultMoreMarker = '<!--more-->'
const defaultMoreMarkerPattern = /<!--\s*more\s*-->/i
const defaultMaxLength = 120

const normalizeWhitespace = (value: string) =>
	value.replace(/\s+/g, ' ').trim()

const normalizeNewlines = (value: string) => value.replace(/\r\n/g, '\n').trim()

const splitParagraphs = (content: string) =>
	normalizeNewlines(content)
		.split(/\n\s*\n+/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)

const extractMoreMarkerSummary = (
	content: string,
	marker: string,
): string | undefined => {
	const matchesDefaultMarker =
		marker.replace(/\s+/g, '').toLowerCase() === defaultMoreMarker

	if (matchesDefaultMarker) {
		const markerMatch = content.match(defaultMoreMarkerPattern)
		if (!markerMatch || typeof markerMatch.index !== 'number') return undefined

		const beforeMarker = content.slice(0, markerMatch.index)
		const summary = normalizeWhitespace(beforeMarker)
		return summary || undefined
	}

	const markerIndex = content.indexOf(marker)
	if (markerIndex < 0) return undefined

	const beforeMarker = content.slice(0, markerIndex)
	const summary = normalizeWhitespace(beforeMarker)
	return summary || undefined
}

const extractParagraphSummary = (
	content: string,
	maxLength: number,
): string | undefined => {
	const paragraphs = splitParagraphs(content)
	if (paragraphs.length === 0) return undefined

	const collected: string[] = []
	let totalLength = 0

	for (const paragraph of paragraphs) {
		const nextLength =
			totalLength + paragraph.length + (collected.length > 0 ? 2 : 0)
		if (nextLength > maxLength) break
		collected.push(paragraph)
		totalLength = nextLength
	}

	if (collected.length > 0) {
		return normalizeWhitespace(collected.join('\n\n'))
	}

	return normalizeWhitespace(paragraphs[0].slice(0, maxLength))
}

export function getArticleSummary(
	input: ArticleSummaryInput,
): string | undefined {
	const content = input.content?.trim() ?? ''
	const explicitSummary = normalizeWhitespace(input.summary ?? '')
	const explicitDescription = normalizeWhitespace(input.description ?? '')
	const marker = input.moreMarker ?? defaultMoreMarker
	const maxLength = input.maxLength ?? defaultMaxLength

	if (content) {
		const markerSummary = extractMoreMarkerSummary(content, marker)
		if (markerSummary) return markerSummary
	}

	if (explicitSummary) return explicitSummary
	if (explicitDescription) return explicitDescription

	if (!content) return undefined

	return extractParagraphSummary(content, maxLength)
}

export default getArticleSummary
