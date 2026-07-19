export interface CopyButtonsOptions {
	root?: ParentNode
	blockSelector?: string
	codeSelector?: string
	buttonClassName?: string
	label?: string
	copiedLabel?: string
	errorLabel?: string
	resetDelay?: number
}

const hasExistingButton = (
	block: HTMLElement,
	buttonClassName: string,
): boolean =>
	Array.from(block.children).some(
		(child) =>
			child instanceof HTMLButtonElement &&
			child.classList.contains(buttonClassName),
	)

export const addCopyButtons = ({
	root = document,
	blockSelector = '.code-block',
	codeSelector = 'code',
	buttonClassName = 'copy',
	label = 'Copy',
	copiedLabel = 'Copied!',
	errorLabel = 'Unable to copy',
	resetDelay = 1000,
}: CopyButtonsOptions = {}): HTMLButtonElement[] => {
	const buttons: HTMLButtonElement[] = []

	root.querySelectorAll<HTMLElement>(blockSelector).forEach((block) => {
		const code = block.querySelector(codeSelector)

		if (!code || hasExistingButton(block, buttonClassName)) return

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

		block.appendChild(button)
		buttons.push(button)
	})

	return buttons
}

export default addCopyButtons
