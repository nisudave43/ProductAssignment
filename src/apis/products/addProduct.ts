import getAxiosInstance from '@/apis/getAxiosInstance'; // Importing a function to get an Axios instance

/**
 * Adds a new product by making a POST request to the API.
 *
 * @param {any} productObj - The product object containing details of the product to be added.
 * @returns {Promise} - Resolves with the response from the API or rejects with an error.
 */

const addProduct = async (productObj: any) => {

    // Validate input: Ensure productObj is provided
    if (!productObj) {
        return Promise.reject({
            error: true,
            message: 'productObj is mandatory', // Minor grammar correction for clarity
        });
    }

    // Get an Axios instance for making API requests
    const instance = getAxiosInstance();

    // Make a POST request to add a new product
    return instance.post('/products/add', productObj);
};

export default addProduct;
