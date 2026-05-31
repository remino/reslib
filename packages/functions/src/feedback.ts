import { podStore } from './store'

const STORE_PATH = 'feedback.sent'
const FORM_SELECTOR = 'form[action^="/feedback"]'

const camelCase = (input: string) =>
	input.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

const changeButtonMessage = (
	element: HTMLButtonElement | HTMLInputElement,
	name: string,
) => {
	const message = element.dataset[camelCase(`msg-${name}`)]
	if (!message) return

	if (element.tagName === 'BUTTON') {
		element.textContent = message
		return
	}

	element.value = message
}

const disableForm = (form: HTMLFormElement, state: string) => {
	form
		.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button, input')
		.forEach((el) => {
			el.disabled = true
			changeButtonMessage(el, state)
		})
}

const submitForm = async (event: SubmitEvent) => {
	const form = event.target
	if (!(form instanceof HTMLFormElement)) return

	event.preventDefault()
	event.stopPropagation()

	const action = form.getAttribute('action') ?? '/feedback'
	const method = form.getAttribute('method') ?? 'POST'

	try {
		const response = await fetch(action, {
			method,
			body: new FormData(form),
		})

		if (response.ok) {
			disableForm(form, 'success')
			podStore(STORE_PATH, true)
		} else {
			disableForm(form, 'failure')
			console.error(response)
		}
	} catch (error) {
		console.error(error)
		disableForm(form, 'failure')
	}
}

const init = () => {
	const form = document.querySelector<HTMLFormElement>(FORM_SELECTOR)
	if (!form) return

	if (podStore(STORE_PATH)) {
		disableForm(form, 'done')
		return
	}

	form.addEventListener('submit', submitForm)
}

export default init
