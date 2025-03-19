import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets } from "../redux/walletSlice";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const userId = useSelector((state: RootState) => state.auth.data?.id); // Lấy userId từ Redux store
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      await axios.post("http://localhost:3000/wallet/create", {
        userId, // Thêm userId vào yêu cầu POST
        name,
        balance: parseFloat(balance.replace(/\./g, "")) || 0, // Loại bỏ dấu chấm và chuyển đổi thành số, mặc định là 0 nếu không hợp lệ
      });
      console.log("Wallet created successfully!");

      // Gọi lại API để lấy dữ liệu ví mới
      const response = await axios.get(`http://localhost:3000/wallet/user/${userId}`);
      dispatch(setWallets(response.data)); // Dispatch action để cập nhật danh sách ví trong Redux store
      onClose();
    } catch (error: any) {
      console.error("Error creating wallet:", error.response ? error.response.data : error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white p-8 rounded-2xl shadow-lg w-1/3 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-red-500 float-right">
          Close
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Add New Wallet</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              placeholder="Wallet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Balance</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200">
              Close
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWalletModal;