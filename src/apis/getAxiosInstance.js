// Common axios instance for all apis call.
// Response and error handing has done in instance for api call
// Function will return axios instance

import axios from 'axios';
import { CONFIG } from '@/helpers/getApiBase';
import { getApiBase } from '@/helpers/getApiBase';

const getAxiosInstance = () => {

    // baseURL for every request
    const instance = axios.create({
        baseURL : getApiBase(),
        'headers' : {
            'Content-Type': 'application/json',
        },
    });

    // array of possible error statuses
    const errorStatusArray = [409, 404, 401, 500, 400, 302];

    // Default instance configuration
    instance.defaults.timeout = CONFIG.timeout || 5000;

    // Common interceptor for request object
    instance.interceptors.request.use((config) => {
        return config;
    });

    //Common interceptor for response object
    instance.interceptors.response.use(
        // Code for success
        (response) => {
            return response?.data || {};
        },
        // Code for error
        (err) => {
            const status = err?.response?.status || 500;
            if (axios.isCancel(err)) {
                return Promise.reject(err);
            } else if(errorStatusArray.indexOf(status) !== -1) {
                return Promise.reject(err?.response?.data || {});
            } else {
                return Promise.reject({
                    'message' : 'Something went wrong',
                    'status' : null,
                    'data' : null,
                });
            }
        },
    );

    return instance;
};

export default getAxiosInstance;
