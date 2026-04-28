import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        ui: uiReducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});

export default store;