// src/pages/RegisterPage.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import { register } from "../redux/authSlice";
import RegisterForm from "../components/RegisterForm";
import API_BASE_URL from "../config/apiConfig";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (
    email: string,
    username: string, // Thay đổi từ name thành username
    password: string
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        username, // Gửi username thay vì name
        password,
      });

      if (response.status === 201) {
        // Thông báo thành công
        toast.success("Đăng ký thành công!");
        dispatch(register());

        // Trì hoãn chuyển hướng để thông báo hiển thị
        setTimeout(() => {
          navigate("/login");
        }, 1000); // Chờ 2 giây trước khi chuyển hướng
      } else {
        // Thông báo lỗi
        toast.error("Đăng ký thất bại!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký!");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Đã xảy ra lỗi không mong muốn!");
      }
    }
  };

  return (
    <div>
      <RegisterForm onSubmit={handleRegister} buttonText="Register" />
      <ToastContainer position="top-right" autoClose={3000} /> {/* Container cho thông báo */}
    </div>
  );
};

export default RegisterPage;