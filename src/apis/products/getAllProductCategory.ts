import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Fetches all product categories from the API.
 *
 * @returns {Promise} Resolves with the API response data containing an array of product categories.
 */
const getAllProductCategory = async () => {
    const instance = getAxiosInstance();
    return instance.get('/products/categories');
};

export default getAllProductCategory;
