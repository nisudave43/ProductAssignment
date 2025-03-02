
type ConfigAction = {
    type: string;
    payload?: Record<string, any>;
};

/**
 * Action creator to set the configuration object in the store.
 *
 * @param {Record<string, any>} configObj - The configuration object to be set.
 * @returns {ConfigAction} - The action object with type 'SET_CONFIG_OBJECT' and the given payload.
 */
export const setConfig = (configObj: Record<string, any>): ConfigAction => {
    return {
        type: 'SET_CONFIG_OBJECT',
        payload: configObj,
    };
};

/**
 * Action creator to get the configuration object from the store.
 *
 * @returns {ConfigAction} - The action object with type 'GET_CONFIG_OBJECT'.
 */
export const getConfig = (): ConfigAction => {
    return {
        type: 'GET_CONFIG_OBJECT',
    };
};
