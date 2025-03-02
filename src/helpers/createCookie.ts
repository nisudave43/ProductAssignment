
/**
 * Creates a cookie with the given name, value, and duration (in hours).
 *
 * @param {string} name The name of the cookie.
 * @param {string} value The value of the cookie.
 * @param {number} hours The duration of the cookie (in hours).
 */
const createCookie = (name: string, value: string, hours: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `; expires=${date.toUTCString()}`;

    document.cookie = `${name}=${value}${expires}; path=/`;
};

export default createCookie;
