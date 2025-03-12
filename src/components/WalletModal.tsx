// src/components/Modal.tsx
import React from "react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Danh sách ví tạm thời
  const wallets = ["Wallet 1", "Wallet 2", "Wallet 3"];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20 ">
      <div
        className="absolute inset-0 bg-gray-300 opacity-30"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white p-6 rounded shadow-lg w-1/3 z-30 "
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-red-500 float-right">
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">Your Wallets</h2>
        <ul>
          {wallets.map((wallet, index) => (
            <li key={index} className="mb-2">
              {wallet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletModal;
