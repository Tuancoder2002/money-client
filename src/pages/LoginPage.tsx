// src/pages/LoginPage.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../redux/authSlice"; // Đảm bảo import đúng action
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Login successful");
        const token = response.data.token; // Lấy token từ phản hồi
        // Gửi yêu cầu để lấy thông tin người dùng hiện tại
        const userResponse = await axios.get("http://localhost:3000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });
        const userId = userResponse.data.id; // Lấy userId từ phản hồi
        dispatch(login(userId)); // Lưu userId vào Redux
        navigate("/home");
      } else {
        alert("Failed to login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in");
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} buttonText="Login" />
    </div>
  );
};

export default LoginPage;