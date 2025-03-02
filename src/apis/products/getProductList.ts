import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Makes a GET request to the API to fetch the list of products.
 *
 * @param {number} page - The page number to fetch. Defaults to 1.
 * @param {number} limit - The number of products to fetch per page. Defaults to 10.
 * @param {string} search - The search query to apply. Defaults to none.
 *
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */
const getProductList = async (page: number = 1, limit: number = 10, search: string) => {
    const skip = (page) * limit; // Calculate the correct 'skip' value

    const params = {};

    if (skip) params.skip = skip;
    if (limit) params.limit = limit;
    if (search) params.q = search;

    const instance = getAxiosInstance();
    return instance.get('/products/search', { params });
};

export default getProductList;
