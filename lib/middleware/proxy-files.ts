import type { MiddlewareHandler } from 'astro'
import { lookup } from 'mrmime'
import { readFile } from 'fs/promises'
import path from 'path'

export type ProxyFilesRecord = Record<string, string>

export interface ProxyFilesConfig {
	base?: string
	paths: ProxyFilesRecord
}

const proxyFiles =
	(config: ProxyFilesConfig): MiddlewareHandler =>
	async ({ url }, next) => {
		const base = config.base ?? '/'
		let pathname = url.pathname

		if (base !== '/' && pathname.startsWith(base)) {
			pathname = pathname.slice(base.length)
			if (!pathname.startsWith('/')) pathname = '/' + pathname
		}

		const match = Object.entries(config.paths).find(([from]) =>
			pathname.startsWith(from),
		)
		if (!match) return next()

		const [src, dest] = match
		const relPath = pathname.slice(src.length)
		const filePath = path.join(dest, relPath)

		try {
			const file = await readFile(filePath)
			const ext = path.extname(filePath).slice(1)
			const mime = lookup(ext) || 'application/octet-stream'

			return new Response(new Uint8Array(file), {
				status: 200,
				headers: { 'Content-Type': mime },
			})
		} catch {
			return new Response('Not Found', { status: 404 })
		}
	}

export default proxyFiles
