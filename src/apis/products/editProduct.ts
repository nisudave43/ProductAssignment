import getAxiosInstance from '@/apis/getAxiosInstance';

/**
 * Edits a product by making a PUT request to the API.
 *
 * @param {object} productObj - The product object containing details of the product to be edited.
 * @param {string} id - The id of the product to be edited.
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */
const editProduct = async (productObj: any, id: string) => {
    if (!id) {
        return Promise.reject({
            error: true,
            message: 'id mandatory',
        });
    }

    if (!productObj) {
        return Promise.reject({
            error: true,
            message: 'productObj mandatory',
        });
    }

    const instance = getAxiosInstance();
    return instance.put(`/products/${id}`, productObj);
};

export default editProduct;
