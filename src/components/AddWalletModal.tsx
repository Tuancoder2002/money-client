import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const userId = useSelector((state: RootState) => state.auth.data?.id); // Lấy userId từ Redux store

  const handleSave = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/wallet/create", {
        userId, // Thêm userId vào yêu cầu POST
        name,
        balance: parseFloat(balance.replace(/\./g, "")), // Loại bỏ dấu chấm và chuyển đổi thành số
      });
      console.log("Wallet created:", response.data);
      onClose();
    } catch (error: any) {
      console.error("Error creating wallet:", error.response ? error.response.data : error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div
        className="absolute inset-0 bg-gray-300 opacity-30"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white p-6 rounded shadow-lg w-1/3 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-red-500 float-right">
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Wallet</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Name</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              placeholder="Wallet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Balance</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
              Close
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWalletModal;