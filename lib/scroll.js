import scrollAnchors from './scroll/anchors.js'
import scrollClick from './scroll/click.js'
import scrollKeys from './scroll/keys.js'
import scrollLoad from './scroll/load.js'
import scrollSections from './scroll/sections.js'

const init = ({ listeners = [], sectionSel } = {}) => {
	scrollAnchors()
	scrollClick(...listeners)
	scrollKeys(...listeners)
	scrollSections(sectionSel)
	scrollLoad()
}

export default init
