import React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import LoginForm from "../components/LoginForm";
import API_BASE_URL from "../config/apiConfig";

const LoginPage: React.FC = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
  
      // Kiểm tra trạng thái và nội dung phản hồi từ API
      if (response.status === 200 || response.status === 201) {
        const { token, message } = response.data;
        if (token) {
          toast.success(message || "Đăng nhập thành công!"); // Thông báo thành công
          localStorage.setItem("token", token); // Lưu token vào localStorage
  
          // Trì hoãn chuyển hướng để thông báo hiển thị
          setTimeout(() => {
            window.location.href = "/home";
          }, 2000); // Chờ 2 giây trước khi chuyển hướng
        } else {
          // Hiển thị thông báo lỗi nếu không có token
          toast.error("Sai thông tin đăng nhập! Vui lòng thử lại.");
        }
      } else {
        // Thông báo lỗi nếu mã trạng thái không hợp lệ
        toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    } catch (error: any) {
      // Xử lý lỗi từ Axios
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ API
      } else {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi đăng nhập!"); // Thông báo lỗi chung
      }
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} buttonText="Login" />
      <ToastContainer position="top-right" autoClose={3000} /> {/* Container cho thông báo */}
    </div>
  );
};

export default LoginPage;