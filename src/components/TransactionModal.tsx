import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faNoteSticky, faSort } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
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
      const response = await axios.post("http://localhost:3000/transaction/create", {
        amount: parseFloat(amount.replace(/\./g, "")), // Loại bỏ dấu chấm và chuyển đổi thành số
        transactionType,
        description: note,
        createdAt: date,
        walletId: selectedWallet?.id,
      });
      console.log("Transaction created:", response);
      onClose();
    } catch (error: any) {
      console.error("Error creating transaction:", error.response ? error.response.data : error.message);
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
        className="relative bg-white p-6 rounded-2xl shadow-lg w-1/3 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-red-500 float-right">
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">Add Transactions</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full mr-4">
              <img src="https://png.pngtree.com/png-vector/20240905/ourmid/pngtree-3d-cartoon-money-wallet-transparent-background-png-image_13760333.png" alt="Wallet Icon" className="w-10 h-10 rounded-full" />
            </div>
            {selectedWallet ? `${selectedWallet.name} - ${selectedWallet.balance} đ` : "Chưa Chọn ví"}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">VND</span>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faSort} />
            </div>
            <select
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="" disabled>Chọn loại</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAW">WITHDRAW</option>
              {/* Thêm các tùy chọn khác nếu cần */}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faNoteSticky} />
            </div>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <input
              type="date"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

export default WalletModal;