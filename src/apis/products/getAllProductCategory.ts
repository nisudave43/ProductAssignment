import getAxiosInstance from '@/apis/getAxiosInstance';

const getAllProductCategory = async () => {
    const instance = getAxiosInstance();
    return instance.get('/products/category');
};

export default getAllProductCategory;
