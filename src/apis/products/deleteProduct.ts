import getAxiosInstance from '@/apis/getAxiosInstance';

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
