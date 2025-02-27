import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProducts = async () => {
    const instance = getAxiosInstance();
    return instance.get('/products');
};

export default getAllProducts;
