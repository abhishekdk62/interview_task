import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import eventReducer from './slices/eventSlice';
import logReducer from './slices/logSlice';

export const store = configureStore({
  reducer: {
    profiles: profileReducer,
    events: eventReducer,
    logs: logReducer,
  },
});
