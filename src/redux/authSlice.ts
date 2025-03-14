import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null; // Thêm userId
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null, // Khởi tạo userId là null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<number>) => {
      state.isAuthenticated = true;
      state.userId = action.payload; // Lưu userId khi đăng nhập
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null; // Đặt userId về null khi đăng xuất
    },
    register: (state) => {
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
