// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { fetchUserFromToken } from "./authSlice"; // Import action thunk\
import walletReducer from "./walletSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
  },
});

// Gọi action để lấy thông tin người dùng từ token trong localStorage
// const token = localStorage.getItem("token");

store.dispatch(fetchUserFromToken()); // Gọi action thunk


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;