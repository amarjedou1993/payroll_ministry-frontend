import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, IUserResponse } from "../../types/types";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserResponse | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.isLoading = false;

      // Persist only necessary state to localStorage
      const persistState = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      };
      try {
        localStorage.setItem("auth", JSON.stringify(persistState));
      } catch (error) {
        console.error("Failed to persist auth state to localStorage:", error);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      try {
        localStorage.removeItem("auth");
      } catch (error) {
        console.error("Failed to clear auth state from localStorage:", error);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setAuthStatus } =
  authSlice.actions;
export default authSlice.reducer;
