import postcss from 'postcss'
import { addDvh } from '../src/index.ts'

const run = async (input: string) => {
	const result = await postcss([addDvh()]).process(input, { from: undefined })
	return result.css
}

describe('postcss add-dvh', () => {
	it('clones declarations with dvh', async () => {
		const css = await run('body{height:100vh;}')
		expect(css).toContain('height:100vh;')
		expect(css).toContain('height:100dvh;')
	})
})
