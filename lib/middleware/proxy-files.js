import { lookup } from 'mrmime';
import { readFile } from 'fs/promises';
import path from 'path';
/**
 * Astro-compatible file proxy middleware (works safely in libs)
 */
const proxyFiles = (config) => async ({ url }, next) => {
    // 👇 Safe base detection: don't rely on import.meta.env outside Astro
    const base = config.base ?? globalThis?.importMeta?.env?.BASE_URL ?? '/';
    let pathname = url.pathname;
    // Strip base if needed
    if (base !== '/' && pathname.startsWith(base)) {
        pathname = pathname.slice(base.length);
        if (!pathname.startsWith('/'))
            pathname = '/' + pathname;
    }
    const match = Object.entries(config.paths || {}).find(([from]) => pathname.startsWith(from));
    // 👇 Explicitly handle the no-match case with a Response
    if (!match)
        return (await next()) ?? new Response('Not Found', { status: 404 });
    const [src, dest] = match;
    const relPath = pathname.slice(src.length);
    const filePath = path.join(dest, relPath);
    try {
        const file = await readFile(filePath);
        const ext = path.extname(filePath).slice(1);
        const mime = lookup(ext) || 'application/octet-stream';
        return new Response(new Uint8Array(file), {
            status: 200,
            headers: { 'Content-Type': mime },
        });
    }
    catch {
        return new Response('Not Found', { status: 404 });
    }
};
export default proxyFiles;
