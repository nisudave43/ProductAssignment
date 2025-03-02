
import { createStore, combineReducers } from 'redux';
import { Store } from 'redux';

// Reducer
import configReducer from '@/store/config/reducer';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
    configuration: configReducer,
});

// Define the root state type based on the combined reducers
type RootState = ReturnType<typeof rootReducer>;

// Create the Redux store with the root reducer
const store: Store<RootState> = createStore(rootReducer); // You can add middleware and other configurations here

export default store;
export type { RootState };