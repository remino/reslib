/* eslint-disable no-param-reassign */

import { podStore } from './store.js'

const STORE_NAME = 'feedbackSent'
const FORM_SELECTOR = 'form[action^="/feedback"]'

const camelCase = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase())

const changeButtonMessage = (el, name) => {
	const message = el.dataset[camelCase(`msg-${name}`)]
	if (!message) return
	el.value = message
}

const disableForm = (form, msgName) => {
	form.querySelectorAll('input').forEach(el => {
		el.setAttribute('disabled', 'disabled')
		changeButtonMessage(el, msgName)
	})
}

const submitForm = event => {
	const { target: form } = event
	const action = form.getAttribute('action')
	const method = form.getAttribute('method')

	event.preventDefault()
	event.stopPropagation()

	fetch(action, { method, body: new FormData(form) })
		.then(response => {
			if (response.ok) {
				disableForm(form, 'success')
				podStore(STORE_NAME, true)
			} else {
				disableForm(form, 'failure')
				// eslint-disable-next-line no-console
				console.error(response)
			}
		})
}

const prepareFeedbackForm = () => {
	const form = document.querySelector(FORM_SELECTOR)

	if (!form) return

	if (podStore(STORE_NAME)) {
		disableForm(form, 'done')
		return
	}

	form.addEventListener('submit', submitForm)
}

export default prepareFeedbackForm
