async function setUtf8(_, next) {
    const res = await next();
    if (res && res.headers && res.headers.get('content-type') === 'text/html') {
        res.headers.set('Content-Type', 'text/html; charset=utf-8');
    }
    return res;
}
export default setUtf8;
