import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProductCategory = async () => {
    const instance = getAxiosInstance();
    return instance.get('/products/categories');
};

export default getAllProductCategory;
