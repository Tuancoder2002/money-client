// src/redux/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  data: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  data: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.data = null;
    },
    register: (state) => {
      state.isAuthenticated = true;
    },
    getInfoUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserFromToken.pending, (state) => {
      // Có thể thêm logic loading nếu cần
      state.loading = true; 
    });
    builder.addCase(fetchUserFromToken.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true; // Đánh dấu là đã xác thực
      state.loading = false;
    });
    builder.addCase(fetchUserFromToken.rejected, (state) => {
      state.isAuthenticated = false; // Nếu không thành công, đánh dấu là chưa xác thực
       state.loading = false;
    });
  },
});

export const fetchUserFromToken = createAsyncThunk(
  "fetchUserFromToken",
  async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return userResponse.data;
      } catch (error: any) {
        if (error.response.data.message === "err_auth_invalid_token") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        if (error.response.data.message === "err_auth_user_not_found") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        throw error;
      }
    }
  }
);

export const { login, logout, register, getInfoUser } = authSlice.actions;
export default authSlice.reducer;