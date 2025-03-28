// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { fetchUserFromToken } from "./authSlice"; // Import action thunk\
import walletReducer from "./walletSlice"
import categoryReducer from "./categorySlice"
import transactionReducer from "./transactionSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    category: categoryReducer,
    transaction: transactionReducer,
  },
});

// Gọi action để lấy thông tin người dùng từ token trong localStorage
// const token = localStorage.getItem("token");

store.dispatch(fetchUserFromToken()); // Gọi action thunk


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;