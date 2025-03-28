import React, { useState } from "react";
import { FaWallet, FaMoneyBillWave, FaTimes } from "react-icons/fa"; // Import các icon từ Font Awesome
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets } from "../redux/walletSlice";
import API_BASE_URL from "../config/apiConfig";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

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
      toast.error("Không tìm thấy thông tin người dùng!"); // Thông báo lỗi
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/wallet/create`, {
        userId, // Thêm userId vào yêu cầu POST
        name,
        balance: parseFloat(balance.replace(/\./g, "")) || 0, // Loại bỏ dấu chấm và chuyển đổi thành số, mặc định là 0 nếu không hợp lệ
      });

      // Hiển thị thông báo thành công
      toast.success("Ví đã được thêm thành công!");

      // Gọi lại API để lấy dữ liệu ví mới
      const response = await axios.get(`${API_BASE_URL}/wallet/user/${userId}`);
      dispatch(setWallets(response.data)); // Dispatch action để cập nhật danh sách ví trong Redux store

      // Đóng modal
      onClose();
    } catch (error: any) {
      console.error(
        "Error creating wallet:",
        error.response ? error.response.data : error.message
      );

      // Hiển thị thông báo lỗi
      toast.error("Đã xảy ra lỗi khi thêm ví!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FaTimes className="w-5 h-5" /> {/* Icon đóng */}
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1E3A8A] mb-6 text-center">
          Thêm ví mới
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Wallet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ví
            </label>
            <div className="relative">
              <FaWallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                placeholder="Nhập tên ví"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Wallet Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số dư ban đầu
            </label>
            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                placeholder="0"
                value={balance}
                onChange={(e) =>
                  setBalance(
                    e.target.value
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaTimes className="mr-2 w-4 h-4" /> Đóng {/* Icon đóng */}
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#162E6F] transition duration-200 flex items-center"
          >
            <FaWallet className="mr-2 w-4 h-4" /> Lưu {/* Icon ví */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWalletModal;