// src/pages/RegisterPage.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { register } from "../redux/authSlice";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (
    email: string,
    username: string, // Thay đổi từ name thành username
    password: string
  ) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email,
        username, // Gửi username thay vì name
        password,
      });

      if (response.status === 201) {
        alert("User registered successfully");
        dispatch(register());
        navigate("/login");
      } else {
        alert("Failed to register user");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
      alert("An error occurred while registering");
    }
  };

  return (
    <div>
      <RegisterForm onSubmit={handleRegister} buttonText="Register" />
    </div>
  );
};

export default RegisterPage;