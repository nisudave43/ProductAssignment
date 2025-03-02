/**
 * Truncates a given string to a specified length, defaulting to 25.
 * If the string is longer than the specified length, it will be truncated
 * and have ' ...' appended to the end.
 * @param {string} str String to truncate.
 * @param {number} [num=25] Length of string to truncate to.
 * @returns {string} Truncated string.
 */
const truncateString = (str: string, num: number = 25) => {
    str = `${str}`;
    if (str?.length > num) {
        return str?.slice(0, num) + ' ...';
    } else {
        return str;
    }
};

export default truncateString;
