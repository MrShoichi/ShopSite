import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
    reducer: rootReducer,
    // Redux Toolkit automatically adds redux-thunk middleware
});

export default store;