// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import uploadReducer from "./slices/uploadSlice";

// const storedAuth = localStorage.getItem("auth");
// const initialAuthState = storedAuth ? JSON.parse(storedAuth) : undefined;

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     upload: uploadReducer,
//   },
//   preloadedState: {
//     auth: initialAuthState, // Set initial state from localStorage
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Cause I use react query
//     }),
// });

// // Types for Redux
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";
import { AuthState } from "@/types/types";

const loadPersistedState = (): AuthState | undefined => {
  try {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      // Validate shape of persisted state
      if (
        parsed &&
        typeof parsed.isAuthenticated === "boolean" &&
        (parsed.user === null || typeof parsed.user === "object")
      ) {
        return {
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated,
          isLoading: false,
        };
      }
    }
  } catch (error) {
    console.error("Failed to load auth state from localStorage:", error);
  }
  return undefined;
};

const initialAuthState = loadPersistedState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
  },
  preloadedState: initialAuthState ? { auth: initialAuthState } : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabled for react-query compatibility
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
