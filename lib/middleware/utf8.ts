import type { APIContext } from 'astro'

async function setUtf8(_: APIContext, next: () => Promise<Response | void>) {
	const res = await next()

	if (res && res.headers && res.headers.get('content-type') === 'text/html') {
		res.headers.set('Content-Type', 'text/html; charset=utf-8')
	}

	return res
}

export default setUtf8
