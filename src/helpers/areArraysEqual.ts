/**
 * Checks if two arrays are equal, in terms of their length and each element at each index.
 * @param {any[]} arr1 - The first array to compare.
 * @param {any[]} arr2 - The second array to compare.
 * @returns {boolean} true if the arrays are equal, false otherwise.
 */
const areArraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
};

export default areArraysEqual;
