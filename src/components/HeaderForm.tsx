import React, { useState } from "react";
import logo from "../assets/logo.png";
import WalletModal from "./WalletModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TransactionModal from "./TransactionModal";

const HeaderForm: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const navigate = useNavigate();
  const selectedWallet = useSelector((state: RootState) => state.wallet.selectedWallet); 

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
            className="w-10 h-10 rounded-full cursor-pointer mr-2"
            onClick={() => setIsWalletModalOpen(true)}
          />
          {selectedWallet ? `${selectedWallet.name} - ${selectedWallet.balance} đ` : "Chưa Chọn ví"}
        </div>
        <nav className="flex items-center space-x-8 text-gray-800">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200"
            onClick={() => setIsTransactionModalOpen(true)}>
            Add Transaction
          </button>
          <button onClick={handleLogout} className="hover:text-blue-600 flex items-center">
            Log out
            <FontAwesomeIcon className="ml-2" icon={faArrowRightFromBracket} />
          </button>
        </nav>
      </div>
      <TransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </header>
  );
};

export default HeaderForm;
