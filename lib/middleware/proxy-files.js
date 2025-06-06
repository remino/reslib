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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mrmime_1 = require("mrmime");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const proxyFiles = (config) => (_a, next_1) => __awaiter(void 0, [_a, next_1], void 0, function* ({ url }, next) {
    const [src, dest] = Object.entries(config.paths || {}).find(([from]) => url.pathname.startsWith(from)) || [];
    if (src && dest) {
        const relPath = url.pathname.replace(src, '');
        const filePath = path_1.default.join(dest, relPath);
        try {
            const file = yield (0, promises_1.readFile)(filePath);
            const ext = path_1.default.extname(filePath).slice(1);
            const mime = (0, mrmime_1.lookup)(ext) || 'application/octet-stream';
            return new Response(file, {
                status: 200,
                headers: {
                    'Content-Type': mime,
                },
            });
        }
        catch (_b) {
            return new Response('Not Found', { status: 404 });
        }
    }
    return next();
});
exports.default = proxyFiles;
