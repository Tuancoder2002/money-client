import React, { useState } from "react";
import logo from "../assets/logo.png";
import WalletModal from "./WalletModal";

const HeaderForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        </div>
        <nav className="flex items-center space-x-8 text-gray-800">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200">
            Add Transaction
          </button>
          <a href="#" className="hover:text-blue-600 flex items-center">
            Log out
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </nav>
      </div>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default HeaderForm;
