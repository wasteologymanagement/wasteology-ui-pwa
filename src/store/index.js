import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import rootReducer from './rootReducer'; // Your root reducer (user slice and others)

const persistConfig = {
  key: 'root', // Key to identify the persisted data
  storage, // Use localStorage for persistence
  whitelist: ['user'], // Only persist the 'user' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
