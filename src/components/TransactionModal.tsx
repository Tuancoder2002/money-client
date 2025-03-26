import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet, refreshHld } from "../redux/walletSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faNoteSticky,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const selectedWallet = useSelector(
    (state: RootState) => state.wallet.selectedWallet
  );
  const categories = useSelector(
    (state: RootState) => state.category.categories
  ); // Lấy dữ liệu danh mục từ Redux store

  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedValue);
  };

  const handleSave = async () => {
    console.log("selectedCategory", selectedCategory);
    try {
      const transactionRes = await axios.post(
        `${API_BASE_URL}/transaction/create`,
        {
          amount: parseFloat(amount.replace(/\./g, "")), // Loại bỏ dấu chấm và chuyển đổi thành số
          description: note,
          createdAt: date,
          walletId: selectedWallet?.id,
          categoryId: +selectedCategory,
        }
      );
      console.log(transactionRes);
      dispatch(refreshHld())

      // Gọi lại API để lấy dữ liệu ví mới
      const response = await axios.get(
        `${API_BASE_URL}/wallet/user/${selectedWallet?.userId}`
      );
      dispatch(setWallets(response.data)); // Dispatch action để cập nhật danh sách ví trong Redux store

      // Cập nhật ví được chọn
      const updatedWallet = response.data.find(
        (wallet: any) => wallet.id === selectedWallet?.id
      );
      if (updatedWallet) {
        dispatch(selectWallet(updatedWallet));
      }

      onClose();
    } catch (error: any) {
      console.error(
        "Error creating transaction:",
        error.response ? error.response.data : error.message
      );
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
        className="relative bg-gradient-to-r from-cyan-400 to-blue-500 p-8 rounded-2xl shadow-lg w-1/3 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-red-500 float-right">
          Close
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Add Transactions
        </h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-2 rounded-full mr-4">
              <img
                src="https://png.pngtree.com/png-vector/20240905/ourmid/pngtree-3d-cartoon-money-wallet-transparent-background-png-image_13760333.png"
                alt="Wallet Icon"
                className="w-10 h-10 rounded-full"
              />
            </div>
            {selectedWallet
              ? `${selectedWallet.name} - ${selectedWallet.balance} đ`
              : "Chưa Chọn ví"}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">VND</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faSort} />
            </div>
            <select
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faNoteSticky} />
            </div>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <input
              type="date"
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
