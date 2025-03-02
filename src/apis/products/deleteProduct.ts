import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Deletes a product by making a DELETE request to the API.
 *
 * @param {string} productId - The id of the product to be deleted.
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */
const deleteProduct = async (productId: string) => {

    if (!productId) {
        return Promise.reject({
            error: true,
            message: 'Product Id mandatory',
        });
    }

    const instance = getAxiosInstance();
    return instance.delete(`/products/${productId}`);
};

export default deleteProduct;
