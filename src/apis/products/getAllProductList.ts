import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Makes a GET request to the API to fetch all products.
 *
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */
const getAllProductList = async () => {
    const instance = getAxiosInstance();
    const params = {
        limit: 0,
    };
    return instance.get('/products', {params});
};

export default getAllProductList;
