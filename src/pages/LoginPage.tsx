
import React from "react";
import axios from "axios";
import LoginForm from "../components/LoginForm";
import API_BASE_URL from "../config/apiConfig";

const LoginPage: React.FC = () => {

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Login successful");
        const token = response.data.token; 
        localStorage.setItem("token", token);
       
        // navigate("/home");
        window.location.href = "/home"
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