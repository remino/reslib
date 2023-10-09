import scrollAnchors from './scroll/anchors.js'
import scrollAuto from './scroll/auto.js'
import scrollClick from './scroll/click.js'
import scrollKeys from './scroll/keys.js'
import scrollLoad from './scroll/load.js'
import scrollSections from './scroll/sections.js'

const init = ({ auto = true, listeners = [], sectionSel } = {}) => {
	scrollAnchors()
	scrollClick(...listeners)
	scrollKeys(...listeners)
	scrollSections(sectionSel)
	scrollLoad()
	if (auto) scrollAuto()
}

export default init
