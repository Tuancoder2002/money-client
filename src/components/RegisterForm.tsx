// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../default.css";

interface AuthFormProps {
  onSubmit: (
    email: string,
    username: string,
    password: string
  ) => void;
  buttonText: string;
}

const RegisterForm: React.FC<AuthFormProps> = ({ onSubmit, buttonText }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, username, password); // Gọi onSubmit với email, username và password
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/mau-background-dep-83.jpg')",
      }}
    >
      <div className="bg-opacity-50 p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white text-white"
              required
            />
          </div>
          <div className="mb-4">
            <input
              onChange={(e) => setUsername(e.target.value)} // Thay đổi từ setName thành setUsername
              value={username} // Thay đổi từ name thành username
              type="text"
              placeholder="Username" // Thay đổi placeholder thành Username
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white text-white"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-white"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-200"
          >
            {buttonText}
          </button>
          <div className="text-center my-4">
            <span className="text-white">or</span>
          </div>
          <div className="flex justify-between">
            <button className="w-1/2 bg-blue-600 text-white py-2 rounded mr-2 hover:bg-blue-700 transition duration-200">
              Facebook
            </button>
            <button className="w-1/2 bg-red-400 text-white py-2 rounded ml-2 hover:bg-blue-500 transition duration-200">
              Google
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-white hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;