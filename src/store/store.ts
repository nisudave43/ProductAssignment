// redux
import { createStore, combineReducers } from 'redux';
import { Store } from 'redux';

// Reducer
import configReducer from '@/store/config/reducer';

const rootReducer = combineReducers({
    configuration: configReducer,
});

type RootState = ReturnType<typeof rootReducer>;

const store: Store<RootState> = createStore(rootReducer); // You can add middleware and other configurations here

export default store;
export type { RootState };
