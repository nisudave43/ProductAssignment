// Function to truncate string after number of character
const truncateString = (str: string, num: number = 25) => {
    str = `${str}`;
    if (str?.length > num) {
        return str?.slice(0, num) + ' ...';
    } else {
        return str;
    }
};

export default truncateString;
