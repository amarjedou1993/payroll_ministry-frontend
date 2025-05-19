import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";

const storedAuth = localStorage.getItem("auth");
const initialAuthState = storedAuth ? JSON.parse(storedAuth) : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
  },
  preloadedState: {
    auth: initialAuthState, // Set initial state from localStorage
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [
      //     "FLUSH",
      //     "REHYDRATE",
      //     "PAUSE",
      //     "PERSIST",
      //     "PURGE",
      //     "REGISTER",
      //   ],
      // },
      serializableCheck: false, // Cause I use react query
    }),
});

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
