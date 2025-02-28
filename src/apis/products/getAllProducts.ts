import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProducts = async (page: number = 1, limit: number = 10) => {

    const skip = (page) * limit; // Calculate the correct 'skip' value

    const params = {};

    if (skip) params.skip = skip;
    if (limit) params.limit = limit;

    const instance = getAxiosInstance();
    return instance.get('/products', { params });
};

export default getAllProducts;
