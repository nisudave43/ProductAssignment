import { CONFIG } from '@/helpers/getApiBase';

type ConfigState = {
    config: {
        env: string;
        baseUrl: string | undefined;
    };
    loading: boolean;
    error: boolean;
};

type ConfigAction = {
    type: 'LOAD_CONFIG_OBJECT' | 'GET_CONFIG_OBJECT' | 'SET_CONFIG_OBJECT' | 'ERROR_CONFIG_OBJECT';
    payload?: Record<string, any>;
};

// initialState state for config
const initialState: ConfigState = {
    config: {
        env: CONFIG.env,
        baseUrl: process.env.BASEURL || process.env.NEXT_PUBLIC_BASEURL,
    },
    loading: false,
    error: false,
};

// Config reducer to handle action
const configReducer = (state: ConfigState = initialState, action: ConfigAction): ConfigState => {
    switch (action.type) {
    case 'LOAD_CONFIG_OBJECT':
        return { ...state, config: {}, error: false, loading: true };
    case 'GET_CONFIG_OBJECT':
        return state;
    case 'SET_CONFIG_OBJECT':
        return { ...state, config: action.payload || {}, error: false, loading: false };
    case 'ERROR_CONFIG_OBJECT':
        return { ...state, config: {}, error: true, loading: false };
    default:
        return state;
    }
};

export default configReducer;
