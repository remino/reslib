import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['spec/**/*.spec.{js,ts}'],
		environment: 'node',
		globals: true,
	},
})
