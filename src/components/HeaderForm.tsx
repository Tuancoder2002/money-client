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
import CategoryModal from "./CategoryModal"; // Import CategoryModal

const HeaderForm: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // State for CategoryModal

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
    setIsCategoryModalOpen(false);
  };

  const handleOpenTransactionModal = () => {
    setIsTransactionModalOpen(true);
    setIsWalletModalOpen(false);
    setIsAddWalletModalOpen(false);
    setIsCategoryModalOpen(false);
  };

  const handleOpenAddWalletModal = () => {
    setIsAddWalletModalOpen(true);
    setIsWalletModalOpen(false);
    setIsTransactionModalOpen(false);
    setIsCategoryModalOpen(false);
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
    setIsWalletModalOpen(false);
    setIsTransactionModalOpen(false);
    setIsAddWalletModalOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center text-white text-xl font-bold">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full cursor-pointer mr-2"
            onClick={handleOpenWalletModal}
          />
           {selectedWallet ? `${selectedWallet.name} - ${selectedWallet.balance.toLocaleString()} đ` : "No Wallet"}
        </div>
        <nav className="flex items-center space-x-8 text-white">
          <button className="bg-gradient-to-r text-white px-4 py-2 rounded-full border hover:from-neutral-300 hover:to-neutral-500 transition duration-200"
            onClick={handleOpenCategoryModal}>
            Category
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition duration-200"
            onClick={handleOpenTransactionModal}>
            Add Transaction
          </button>
          <button onClick={handleLogout} className="hover:text-gray-200 flex items-center">
            Log out
            <FontAwesomeIcon className="ml-2" icon={faArrowRightFromBracket} />
          </button>
        </nav>
      </div>
      <TransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onOpenAddWallet={handleOpenAddWalletModal} />
      <AddWalletModal isOpen={isAddWalletModalOpen} onClose={() => setIsAddWalletModalOpen(false)} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} /> {/* Add CategoryModal */}
    </header>
  );
};

export default HeaderForm;