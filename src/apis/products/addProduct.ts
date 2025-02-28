import getAxiosInstance from '@/apis/getAxiosInstance';

const addProduct = async (productObj: any) => {

    if (!productObj) {
        return Promise.reject({
            error: true,
            message: 'productObj mandatory',
        });
    }

    const instance = getAxiosInstance();
    return instance.post(`/products`, productObj);
};

export default addProduct;
