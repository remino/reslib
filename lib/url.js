export function makeAbsolute(base, path = '') {
    return new URL(path.replace(/^\/+/, '/'), base).toString();
}
export default { makeAbsolute };
