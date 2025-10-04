import type { APIContext } from 'astro';
export type MiddlewareNext = () => Promise<Response | void>;
export type Middleware = (ctx: APIContext, next: MiddlewareNext) => Promise<Response | void>;
/**
 * Chains middleware functions like Express-style next().
 */
export declare function chain(...fns: Middleware[]): (ctx: APIContext, next: MiddlewareNext) => Promise<Response | void>;
/**
 * Helper to wrap a middleware chain and define it as `onRequest`.
 * TS hack needed because Astro's type is overly strict.
 */
export declare function defineChainedMiddleware(...fns: Middleware[]): import("astro").MiddlewareHandler;
//# sourceMappingURL=chain.d.ts.map