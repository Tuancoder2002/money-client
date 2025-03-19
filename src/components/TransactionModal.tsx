import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet } from "../redux/walletSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faNoteSticky, faSort } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const walletsStore = useSelector((store: RootState) => store.wallet);
  const selectedWallet = useSelector((state: RootState) => state.wallet.selectedWallet);

  const [amount, setAmount] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchWalletsId = async () => {
      const walletId = walletsStore.selectedWallet?.id;
      console.log("walletId", walletId);
    };
    fetchWalletsId();
  }, [walletsStore.selectedWallet?.id]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedValue);
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:3000/transaction/create", {
        amount: parseFloat(amount.replace(/\./g, "")), // Loại bỏ dấu chấm và chuyển đổi thành số
        transactionType,
        description: note,
        createdAt: date,
        walletId: selectedWallet?.id,
      });
      console.log("Transaction created successfully!");

      // Gọi lại API để lấy dữ liệu ví mới
      const response = await axios.get(`http://localhost:3000/wallet/user/${selectedWallet?.userId}`);
      dispatch(setWallets(response.data)); // Dispatch action để cập nhật danh sách ví trong Redux store

      // Cập nhật ví được chọn
      const updatedWallet = response.data.find((wallet: any) => wallet.id === selectedWallet?.id);
      if (updatedWallet) {
        dispatch(selectWallet(updatedWallet));
      }

      onClose();
    } catch (error: any) {
      console.error("Error creating transaction:", error.response ? error.response.data : error.message);
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
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Add Transactions</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-2 rounded-full mr-4">
              <img src="https://png.pngtree.com/png-vector/20240905/ourmid/pngtree-3d-cartoon-money-wallet-transparent-background-png-image_13760333.png" alt="Wallet Icon" className="w-10 h-10 rounded-full" />
            </div>
            {selectedWallet ? `${selectedWallet.name} - ${selectedWallet.balance} đ` : "Chưa Chọn ví"}
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
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="" disabled>Chọn loại</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAW">WITHDRAW</option>
              {/* Thêm các tùy chọn khác nếu cần */}
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

export default TransactionModal;