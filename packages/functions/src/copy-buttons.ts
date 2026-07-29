export interface CopyButtonsOptions {
	root?: ParentNode
	blockSelector?: string
	codeSelector?: string
	buttonClassName?: string
	wrapperElement?: boolean | string
	wrapperClass?: string
	label?: string
	copiedLabel?: string
	errorLabel?: string
	resetDelay?: number
}

const hasExistingButton = (
	container: HTMLElement,
	buttonClassName: string,
): boolean =>
	Array.from(container.children).some(
		(child) =>
			child instanceof HTMLButtonElement &&
			child.classList.contains(buttonClassName),
	)

const getWrapperTagName = (
	wrapperElement: CopyButtonsOptions['wrapperElement'],
): string | undefined => {
	if (!wrapperElement) return undefined
	if (wrapperElement === true) return 'div'

	return wrapperElement
}

const ensureWrapper = (
	block: HTMLElement,
	wrapperTagName: string,
	wrapperClass?: string,
): HTMLElement => {
	const parent = block.parentElement

	if (
		parent?.tagName.toLowerCase() === wrapperTagName &&
		parent.firstElementChild === block
	) {
		if (wrapperClass !== undefined) {
			parent.setAttribute('class', wrapperClass)
		}

		return parent
	}

	const wrapper = document.createElement(wrapperTagName)

	if (wrapperClass !== undefined) {
		wrapper.setAttribute('class', wrapperClass)
	}

	block.parentNode?.insertBefore(wrapper, block)
	wrapper.appendChild(block)

	return wrapper
}

export const addCopyButtons = ({
	root = document,
	blockSelector = '.code-block',
	codeSelector = 'code',
	buttonClassName = 'copy',
	wrapperElement,
	wrapperClass,
	label = 'Copy',
	copiedLabel = 'Copied!',
	errorLabel = 'Unable to copy',
	resetDelay = 1000,
}: CopyButtonsOptions = {}): HTMLButtonElement[] => {
	const buttons: HTMLButtonElement[] = []
	const wrapperTagName = getWrapperTagName(wrapperElement)

	root.querySelectorAll<HTMLElement>(blockSelector).forEach((block) => {
		const code = block.querySelector(codeSelector)
		const container = wrapperTagName
			? ensureWrapper(block, wrapperTagName, wrapperClass)
			: block

		if (!code || hasExistingButton(container, buttonClassName)) return

		const button = document.createElement('button')

		button.classList.add(buttonClassName)
		button.type = 'button'
		button.textContent = label

		button.addEventListener('click', async () => {
			try {
				// Requires the browser Clipboard API, typically available only in
				// secure contexts such as HTTPS or localhost.
				await navigator.clipboard.writeText(code.textContent ?? '')

				button.setAttribute('aria-live', 'assertive')
				button.textContent = copiedLabel
			} catch {
				button.textContent = errorLabel
			}

			setTimeout(() => {
				button.textContent = label
				button.removeAttribute('aria-live')
			}, resetDelay)
		})

		container.appendChild(button)
		buttons.push(button)
	})

	return buttons
}

export default addCopyButtons
