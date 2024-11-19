const { parse } = require("url");

function setCookies(res, cookies) {
    const cookieHeaders = cookies.map(({ name, value, options = {} }) => {
        let cookie = `${name}=${encodeURIComponent(value)}`;
        if (options.maxAge) {
            cookie += `; Max-Age=${options.maxAge}`;
        }
        if (options.expires) {
            cookie += `; Expires=${options.expires.toUTCString()}`;
        }
        if (options.path) {
            cookie += `; Path=${options.path}`;
        } else {
            cookie += `; Path=/`;
        }
        if (options.domain) {
            cookie += `; Domain=${options.domain}`;
        }
        if (options.secure) {
            cookie += `; Secure`;
        }
        if (options.httpOnly) {
            cookie += `; HttpOnly`;
        }
        return cookie;
    });

    // Set single or multiple cookies in the response header
    res.setHeader('Set-Cookie', cookieHeaders.length === 1 ? cookieHeaders[0] : cookieHeaders);
}
function parseCookies(cookieHeader = '') {
    if (cookieHeader.headers) cookieHeader = cookieHeader.headers.cookie || '';
    if (cookieHeader.cookie) cookieHeader = cookieHeader.cookie || '';
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
        return cookies;
    }, {});
}
function deleteCookies(res, cookies) {
    cookies.forEach(cookie => {
        res.setHeader('Set-Cookie', `${cookie}=; Max-Age=0; Path=/;`);
    });
};

module.exports = {
    setCookies, parseCookies, deleteCookies
}