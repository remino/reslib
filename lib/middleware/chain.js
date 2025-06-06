"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = chain;
exports.defineChainedMiddleware = defineChainedMiddleware;
const middleware_1 = require("astro/middleware");
/**
 * Chains middleware functions like Express-style next().
 */
function chain(...fns) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let index = -1;
        const dispatch = (i) => __awaiter(this, void 0, void 0, function* () {
            if (i <= index)
                throw new Error('next() called multiple times');
            index = i;
            const fn = fns[i];
            return fn ? yield fn(ctx, () => dispatch(i + 1)) : next();
        });
        return yield dispatch(0);
    });
}
/**
 * Helper to wrap a middleware chain and define it as `onRequest`.
 * TS hack needed because Astro's type is overly strict.
 */
function defineChainedMiddleware(...fns) {
    const handler = chain(...fns, (_, next) => __awaiter(this, void 0, void 0, function* () { return next(); }));
    return (0, middleware_1.defineMiddleware)(((ctx, next) => handler(ctx, next)));
}
