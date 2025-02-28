import getAxiosInstance from '@/apis/getAxiosInstance';

const editProduct = async (productObj: any, id: string) => {
    if (!id) {
        return Promise.reject({
            error: true,
            message: 'id mandatory',
        });
    }

    if (!productObj) {
        return Promise.reject({
            error: true,
            message: 'productObj mandatory',
        });
    }

    const instance = getAxiosInstance();
    return instance.put(`/products/${id}`, productObj);
};

export default editProduct;
