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
      // setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.isLoading = false;

      localStorage.setItem("auth", JSON.stringify(state)); // Persist to localStorage
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem("auth"); // Clear from localStorage on logout
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<boolean | null>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setAuthStatus } =
  authSlice.actions;
export default authSlice.reducer;
