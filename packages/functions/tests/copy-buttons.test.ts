import { afterEach, describe, expect, it, vi } from 'vitest'
import { addCopyButtons } from '../src/copy-buttons'

const setClipboard = (writeText: (text: string) => Promise<void>) => {
	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value: { writeText },
	})
}

describe('addCopyButtons', () => {
	afterEach(() => {
		document.body.innerHTML = ''
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it('adds copy buttons to code blocks', () => {
		document.body.innerHTML =
			'<div class="code-block"><pre><code>alert("Hello")</code></pre></div>'

		const buttons = addCopyButtons()

		expect(buttons).toHaveLength(1)
		expect(buttons[0].type).toBe('button')
		expect(buttons[0].className).toBe('copy')
		expect(buttons[0].textContent).toBe('Copy')
		expect(document.querySelector('.code-block > button.copy')).toBe(buttons[0])
	})

	it('copies code text and resets the button label', async () => {
		vi.useFakeTimers()
		const writeText = vi.fn().mockResolvedValue(undefined)

		setClipboard(writeText)
		document.body.innerHTML =
			'<div class="code-block"><pre><code>npm test</code></pre></div>'

		const [button] = addCopyButtons()

		button.click()
		await vi.runAllTimersAsync()

		expect(writeText).toHaveBeenCalledWith('npm test')
		expect(button.textContent).toBe('Copy')
		expect(button.hasAttribute('aria-live')).toBe(false)
	})

	it('shows an error label when copying fails', async () => {
		vi.useFakeTimers()
		setClipboard(vi.fn().mockRejectedValue(new Error('no permission')))
		document.body.innerHTML =
			'<div class="code-block"><pre><code>npm run build</code></pre></div>'

		const [button] = addCopyButtons({ resetDelay: 50 })

		button.click()
		await vi.advanceTimersByTimeAsync(0)

		expect(button.textContent).toBe('Unable to copy')

		await vi.advanceTimersByTimeAsync(50)

		expect(button.textContent).toBe('Copy')
	})

	it('does not add duplicate buttons', () => {
		document.body.innerHTML =
			'<div class="code-block"><pre><code>npm test</code></pre></div>'

		addCopyButtons()
		const buttons = addCopyButtons()

		expect(buttons).toHaveLength(0)
		expect(document.querySelectorAll('.code-block > button.copy')).toHaveLength(1)
	})

	it('supports custom selectors and labels', () => {
		document.body.innerHTML =
			'<figure data-code><pre><samp>pnpm test</samp></pre></figure>'

		const buttons = addCopyButtons({
			blockSelector: '[data-code]',
			codeSelector: 'samp',
			buttonClassName: 'copy-code',
			label: 'Copy code',
		})

		expect(buttons).toHaveLength(1)
		expect(buttons[0].className).toBe('copy-code')
		expect(buttons[0].textContent).toBe('Copy code')
	})

	it('wraps blocks in a div when wrapperElement is true', () => {
		document.body.innerHTML =
			'<section><div class="code-block"><pre><code>npm test</code></pre></div></section>'

		const [button] = addCopyButtons({ wrapperElement: true })
		const wrapper = document.querySelector('section > div > .code-block')
			?.parentElement as HTMLElement | null

		expect(button).toBeTruthy()
		expect(wrapper?.tagName).toBe('DIV')
		expect(wrapper?.querySelector('.code-block')).toBeTruthy()
		expect(wrapper?.querySelector('button.copy')).toBe(button)
	})

	it('wraps blocks in a custom element and applies wrapperClass', () => {
		document.body.innerHTML =
			'<section><pre class="code-block"><code>pnpm test</code></pre></section>'

		const [button] = addCopyButtons({
			wrapperElement: 'figure',
			wrapperClass: 'code-shell',
		})
		const wrapper = document.querySelector(
			'section > figure.code-shell',
		) as HTMLElement | null

		expect(wrapper?.firstElementChild?.className).toBe('code-block')
		expect(wrapper?.lastElementChild).toBe(button)
	})

	it('ignores wrapperClass when wrapperElement is falsy', () => {
		document.body.innerHTML =
			'<div class="code-block"><pre><code>npm test</code></pre></div>'

		addCopyButtons({ wrapperClass: 'code-shell' })

		expect(document.querySelector('.code-shell')).toBeNull()
		expect(document.querySelector('.code-block > button.copy')).toBeTruthy()
	})

	it('does not re-wrap or add duplicate buttons when wrappers are enabled', () => {
		document.body.innerHTML =
			'<section><div class="code-block"><pre><code>npm test</code></pre></div></section>'

		addCopyButtons({ wrapperElement: true, wrapperClass: 'code-shell' })
		const buttons = addCopyButtons({
			wrapperElement: true,
			wrapperClass: 'code-shell',
		})

		expect(buttons).toHaveLength(0)
		expect(document.querySelectorAll('section > .code-shell')).toHaveLength(1)
		expect(document.querySelectorAll('.code-shell > button.copy')).toHaveLength(1)
	})
})
