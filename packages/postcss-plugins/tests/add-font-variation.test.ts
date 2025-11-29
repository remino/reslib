import postcss from 'postcss'
import { addFontVariation } from '../src/index.ts'

const run = async (input: string) => {
	const result = await postcss([addFontVariation()]).process(input, {
		from: undefined,
	})
	return result.css
}

describe('postcss add-font-variation', () => {
	it('adds font-variation-settings before font-weight', async () => {
		const css = await run('body{font-weight:400;}')
		expect(css).toContain('font-variation-settings:"wght" 400;')
	})
})
