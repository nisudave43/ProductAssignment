import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProductList = async () => {
    const instance = getAxiosInstance();
    const params = {
        limit: 0,
    };
    return instance.get('/products', {params});
};

export default getAllProductList;
