import type { MiddlewareNext } from './chain';
type ProxyFilesRecord = Record<string, string>;
export interface ProxyFilesConfig {
    paths: ProxyFilesRecord;
    base?: string;
}
/**
 * Astro-compatible file proxy middleware (works safely in libs)
 */
declare const proxyFiles: (config: ProxyFilesConfig) => ({ url }: {
    url: URL;
}, next: MiddlewareNext) => Promise<Response>;
export default proxyFiles;
//# sourceMappingURL=proxy-files.d.ts.map