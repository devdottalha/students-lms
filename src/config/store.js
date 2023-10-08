import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from '../redux/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [thunk], 
});

export default store;
