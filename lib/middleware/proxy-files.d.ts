import type { MiddlewareNext } from './chain';
type ProxyFilesRecord = Record<string, string>;
type ProxyFilesObject = {
    paths: ProxyFilesRecord;
};
declare const proxyFiles: (config: ProxyFilesObject) => ({ url }: {
    url: URL;
}, next: MiddlewareNext) => Promise<void | Response>;
export default proxyFiles;
//# sourceMappingURL=proxy-files.d.ts.map