export const getCookie = name => document.cookie.split('; ').reduce((r, v) => {
    const [key, val] = v.split('=');
    return key === name ? decodeURIComponent(val) : r
}, '');