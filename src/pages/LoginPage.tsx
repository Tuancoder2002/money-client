import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../redux/authSlice";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Login successful");
        localStorage.setItem("token", response.data.token);
        dispatch(login());
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
