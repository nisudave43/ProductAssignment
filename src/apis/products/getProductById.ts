import getAxiosInstance from '@/apis/getAxiosInstance';

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
