// /src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import { combineReducers } from 'redux';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable to prevent issues with non-serializable values
    }),
});

export const persistor = persistStore(store);

// Custom hook to dispatch actions with types
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Redux store type
export type RootState = ReturnType<typeof store.getState>;
