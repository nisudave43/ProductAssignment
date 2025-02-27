// Function to set config to store
type ConfigAction = {
    type: string;
    payload?: Record<string, any>;
};

export const setConfig = (configObj: Record<string, any>): ConfigAction => {
    return {
        type: 'SET_CONFIG_OBJECT',
        payload: configObj,
    };
};

// Function to get config from store
export const getConfig = (): ConfigAction => {
    return {
        type: 'GET_CONFIG_OBJECT',
    };
};
