import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

// ✅ CUSTOM LOCALSTORAGE (IMPORTANT FIX)
const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

import authReducer from './slices/authSlice';
import noteReducer from './slices/noteSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notes: noteReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔥 important
    }),
});

export const persistor = persistStore(store);