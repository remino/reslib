import scrollAnchors from './anchors'
import scrollAuto from './auto'
import scrollClick from './click'
import scrollKeys from './keys'
import scrollLoad from './load'
import scrollSections from './sections'

export interface ScrollInitOptions {
	auto?: boolean
	listeners?: EventListener[]
	sectionSelector?: string
	anchorScrollOptions?: ScrollToOptions
}

const init = ({
	auto = true,
	listeners = [],
	sectionSelector,
	anchorScrollOptions,
}: ScrollInitOptions = {}): void => {
	scrollAnchors(anchorScrollOptions)
	scrollClick(...listeners)
	scrollKeys(...listeners)
	scrollSections(sectionSelector ?? '[data-reslib-scroll]')
	scrollLoad()
	if (auto) scrollAuto()
}

export default init
