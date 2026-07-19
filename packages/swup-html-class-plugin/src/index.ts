export type HtmlClassFilter =
	| string
	| RegExp
	| ((className: string) => boolean)

export interface SwupHtmlClassPluginOptions {
	classFilter?: HtmlClassFilter | HtmlClassFilter[]
}

interface SwupLike {
	hooks: {
		on: (hook: string, handler: HookHandler) => void
		off: (hook: string, handler: HookHandler) => void
	}
	log?: (message: string, meta?: Record<string, unknown>) => void
}

interface VisitLike {
	to?: {
		document?: Document | null
	}
}

type HookHandler = (visit: VisitLike) => void

const normalizeFilters = (
	filter?: HtmlClassFilter | HtmlClassFilter[],
): HtmlClassFilter[] => {
	if (!filter) return []
	return Array.isArray(filter) ? filter : [filter]
}

const matchesFilter = (className: string, filters: HtmlClassFilter[]): boolean => {
	if (filters.length === 0) return true

	return filters.some((filter) => {
		if (typeof filter === 'string') return className === filter
		if (filter instanceof RegExp) return filter.test(className)
		return filter(className)
	})
}

export default class SwupHtmlClassPlugin {
	readonly name = 'SwupHtmlClassPlugin'
	readonly options: SwupHtmlClassPluginOptions
	swup?: SwupLike

	private readonly managedClasses = new Set<string>()
	private readonly onContentReplace: HookHandler = (visit) => {
		this.updateHtmlClasses(visit.to?.document?.documentElement ?? null)
	}

	constructor(options: SwupHtmlClassPluginOptions = {}) {
		this.options = options
	}

	mount(): void {
		this.swup?.hooks.on('content:replace', this.onContentReplace)
	}

	unmount(): void {
		this.swup?.hooks.off('content:replace', this.onContentReplace)
		this.removeManagedClasses()
	}

	private updateHtmlClasses(nextHtml: Element | null): void {
		const html = document.documentElement

		this.removeManagedClasses()

		if (!nextHtml) {
			this.swup?.log?.('No next html element found for class sync')
			return
		}

		const filters = normalizeFilters(this.options.classFilter)
		const nextClasses = Array.from(nextHtml.classList).filter((className) =>
			matchesFilter(className, filters),
		)

		nextClasses.forEach((className) => {
			html.classList.add(className)
			this.managedClasses.add(className)
		})
	}

	private removeManagedClasses(): void {
		const html = document.documentElement

		this.managedClasses.forEach((className) => {
			html.classList.remove(className)
		})

		this.managedClasses.clear()
	}
}

export { matchesFilter }
