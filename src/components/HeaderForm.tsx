import React, { useState } from "react";
import logo from "../assets/logo.png";
import WalletModal from "./WalletModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const HeaderForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center text-blue-600 text-2xl font-bold">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <p className="ml-2">Balance - </p>
        </div>
        <nav className="flex items-center space-x-8 text-gray-800">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200">
            Add Transaction
          </button>
          <button onClick={handleLogout} className="hover:text-blue-600 flex items-center">
            Log out
            <FontAwesomeIcon className="ml-2" icon={faArrowRightFromBracket} />
          </button>
        </nav>
      </div>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default HeaderForm;
