import type { MiddlewareNext } from './chain'
import { lookup } from 'mrmime'
import { readFile } from 'fs/promises'
import path from 'path'

type ProxyFilesRecord = Record<string, string>

type ProxyFilesObject = {
	paths: ProxyFilesRecord
}

const proxyFiles =
	(config: ProxyFilesObject) =>
	async ({ url }: { url: URL }, next: MiddlewareNext) => {
		const [src, dest] =
			Object.entries(config.paths || {}).find(([from]) =>
				url.pathname.startsWith(from)
			) || []

		if (src && dest) {
			const relPath = url.pathname.replace(src, '')
			const filePath = path.join(dest, relPath)

			try {
				const file = await readFile(filePath)
				const ext = path.extname(filePath).slice(1)
				const mime = lookup(ext) || 'application/octet-stream'

				return new Response(file, {
					status: 200,
					headers: {
						'Content-Type': mime,
					},
				})
			} catch {
				return new Response('Not Found', { status: 404 })
			}
		}

		return next()
	}

export default proxyFiles
