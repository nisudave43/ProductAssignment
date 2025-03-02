import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Makes a GET request to the API to fetch a product by ID.
 *
 * @param {string} productId - The ID of the product to be fetched.
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */
const getProductById = async (productId: string) => {

    if (!productId) {
        return Promise.reject({
            error: true,
            message: 'Product Id mandatory',
        });
    }

    const instance = getAxiosInstance();
    return instance.get(`/products/${productId}`);
};

export default getProductById;
