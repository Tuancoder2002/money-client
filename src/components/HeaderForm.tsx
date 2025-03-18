import React, { useState } from "react";
import logo from "../assets/logo.png";
import WalletModal from "./WalletModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TransactionModal from "./TransactionModal";
import AddWalletModal from "./AddWalletModal";

const HeaderForm: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);

  const navigate = useNavigate();
  const selectedWallet = useSelector((state: RootState) => state.wallet.selectedWallet); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login")
  }

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
    setIsTransactionModalOpen(false);
    setIsAddWalletModalOpen(false);
  };

  const handleOpenTransactionModal = () => {
    setIsTransactionModalOpen(true);
    setIsWalletModalOpen(false);
    setIsAddWalletModalOpen(false);
  };

  const handleOpenAddWalletModal = () => {
    setIsAddWalletModalOpen(true);
    setIsWalletModalOpen(false);
    setIsTransactionModalOpen(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center text-blue-600 text-xl font-bold">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full cursor-pointer mr-2"
            onClick={handleOpenWalletModal}
          />
           {selectedWallet ? `${selectedWallet.name} - ${selectedWallet.balance.toLocaleString()} đ` : "Chưa Chọn ví"}
        </div>
        <nav className="flex items-center space-x-8 text-gray-800">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200"
            onClick={handleOpenTransactionModal}>
            Add Transaction
          </button>
          <button onClick={handleLogout} className="hover:text-blue-600 flex items-center">
            Log out
            <FontAwesomeIcon className="ml-2" icon={faArrowRightFromBracket} />
          </button>
        </nav>
      </div>
      <TransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onOpenAddWallet={handleOpenAddWalletModal} />
      <AddWalletModal isOpen={isAddWalletModalOpen} onClose={() => setIsAddWalletModalOpen(false)} />
    </header>
  );
};

export default HeaderForm;