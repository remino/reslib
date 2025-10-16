import type { MiddlewareNext } from 'astro';
type ProxyFilesRecord = Record<string, string>;
export interface ProxyFilesConfig {
    paths: ProxyFilesRecord;
    base?: string;
}
declare const proxyFiles: (config: ProxyFilesConfig) => ({ url }: {
    url: URL;
}, next: MiddlewareNext) => Promise<Response>;
export default proxyFiles;
//# sourceMappingURL=proxy-files.d.ts.map