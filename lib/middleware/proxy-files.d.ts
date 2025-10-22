import type { MiddlewareHandler } from 'astro';
export type ProxyFilesRecord = Record<string, string>;
export interface ProxyFilesConfig {
    base?: string;
    paths: ProxyFilesRecord;
}
declare const proxyFiles: (config: ProxyFilesConfig) => MiddlewareHandler;
export default proxyFiles;
//# sourceMappingURL=proxy-files.d.ts.map