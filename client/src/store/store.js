import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import landReducer from './slices/landSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    land: landReducer,
  },
});

export default store;
