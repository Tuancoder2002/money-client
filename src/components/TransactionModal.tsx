import React, { useEffect, useState } from "react";
import Select from "react-select"; // Import react-select
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet, refreshHld } from "../redux/walletSlice";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { setCategories } from "../redux/categorySlice";
import {
  FaMoneyBillWave,
  FaClipboard,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa"; // Import các icon từ Font Awesome
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/category`);
        dispatch(setCategories(response.data)); // Lưu dữ liệu vào Redux store
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Gọi hàm async
  }, [dispatch]);

  const handleSave = async () => {
    const formattedDate = new Date(date).toISOString(); 
  
    try {
      if (!amount) {
        toast.error("Số tiền không hợp lệ. Vui lòng nhập số tiền hợp lệ.");
        return;
      }
      if (!selectedCategory) {
        toast.error("Vui lòng chọn danh mục.");
        return;
      }
      if (!selectedWallet) {
        toast.error("Vui lòng chọn ví.");
        return;
      }

      await axios.post(`${API_BASE_URL}/transaction/create`, {  
        amount: parseFloat(amount.replace(/\./g, "")), // Loại bỏ dấu chấm và chuyển đổi thành số
        description: note,
        createdAt: formattedDate, // Sử dụng formattedDate với định dạng đầy đủ
        walletId: selectedWallet?.id,
        categoryId: +selectedCategory,
      });
  
      // Hiển thị thông báo thành công
      toast.success("Giao dịch đã được thêm thành công!");
  
      dispatch(refreshHld());
  
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
  
      onClose(); // Đóng modal
    } catch (error: any) {
      console.error(
        "Error creating transaction:",
        error.response ? error.response.data : error.message
      );
  
      // Hiển thị thông báo lỗi
      toast.error("Đã xảy ra lỗi khi thêm giao dịch!");
    }
  };

  if (!isOpen) return null;

  // Tùy chỉnh giao diện cho react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: "100%",
      minWidth: "345px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "4px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#1E3A8A", // Màu xanh đậm
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      padding: "10px",
      backgroundColor: state.isFocused ? "#E0E7FF" : "white", // Màu xanh nhạt khi hover
      color: "#1E3A8A", // Màu xanh đậm
    }),
  };

  // Chuyển đổi dữ liệu categories thành định dạng react-select
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: (
      <div className="flex items-center">
        <img
          src={category.icon}
          alt={category.name}
          className="w-6 h-6 mr-2 rounded-full"
        />
        {category.name}
      </div>
    ),
  }));

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg z-30"
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
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Thêm giao dịch
        </h2>

        <div className="space-y-4">
          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Số tiền
            </label>
            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <Select
              options={categoryOptions}
              styles={customStyles}
              onChange={(selectedOption: any) =>
                setSelectedCategory(selectedOption.value)
              }
            />
          </div>

          {/* Note */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <div className="relative">
              <FaClipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                placeholder="Nhập ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Ngày
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                value={date}
                onChange={(e) => {
      
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center"
            >
              <FaTimes className="mr-2 w-4 h-4" /> Đóng
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200 flex items-center"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
