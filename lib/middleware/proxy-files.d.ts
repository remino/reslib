export type ProxyFilesRecord = Record<string, string>;
export interface ProxyFilesConfig {
    base?: string;
    paths: ProxyFilesRecord;
}
export type MiddlewareNext = () => Promise<Response | void>;
export type Middleware = (ctx: {
    url: URL;
}, next: MiddlewareNext) => Promise<Response | void>;
declare const proxyFiles: (config: ProxyFilesConfig) => Middleware;
export default proxyFiles;
//# sourceMappingURL=proxy-files.d.ts.map