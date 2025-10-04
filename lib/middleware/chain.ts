import type { APIContext } from 'astro'
import { defineMiddleware } from 'astro/middleware'

// Type definitions
export type MiddlewareNext = () => Promise<Response | void>
export type Middleware = (
	ctx: APIContext,
	next: MiddlewareNext,
) => Promise<Response | void>

/**
 * Chains middleware functions like Express-style next().
 */
export function chain(
	...fns: Middleware[]
): (ctx: APIContext, next: MiddlewareNext) => Promise<Response | void> {
	return async (ctx, next) => {
		let index = -1
		const dispatch = async (i: number): Promise<Response | void> => {
			if (i <= index) throw new Error('next() called multiple times')
			index = i
			const fn = fns[i]
			return fn ? await fn(ctx, () => dispatch(i + 1)) : next()
		}
		return await dispatch(0)
	}
}

/**
 * Helper to wrap a middleware chain and define it as `onRequest`.
 * TS hack needed because Astro's type is overly strict.
 */
export function defineChainedMiddleware(...fns: Middleware[]) {
	const handler = chain(...fns, async (_, next) => next())
	return defineMiddleware(((ctx, next) =>
		handler(ctx, next)) as typeof defineMiddleware extends (h: infer H) => any
		? H
		: never)
}
