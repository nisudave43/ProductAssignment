import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProducts = async (page: number = 1, limit: number = 10, search: string) => {
    console.log('search',search)
    const skip = (page) * limit; // Calculate the correct 'skip' value

    const params = {};

    if (skip) params.skip = skip;
    if (limit) params.limit = limit;
    if (search) params.q = search;

    const instance = getAxiosInstance();
    return instance.get('/products/search', { params });
};

export default getAllProducts;
