import postcss from 'postcss'
import { addLvh } from '../src/index.ts'

const run = async (input: string) => {
	const result = await postcss([addLvh()]).process(input, { from: undefined })
	return result.css
}

describe('postcss add-lvh', () => {
	it('clones declarations with lvh', async () => {
		const css = await run('body{min-height:100vh;}')
		expect(css).toContain('min-height:100vh;')
		expect(css).toContain('min-height:100lvh;')
	})
})
