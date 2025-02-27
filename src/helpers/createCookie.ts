const createCookie = (name: string, value: string, hours: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `; expires=${date.toUTCString()}`;

    document.cookie = `${name}=${value}${expires}; path=/`;
};

export default createCookie;
