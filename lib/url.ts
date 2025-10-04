export function makeAbsolute(base: string, path = ''): string {
	return new URL(path.replace(/^\/+/, '/'), base).toString()
}

export default { makeAbsolute }
