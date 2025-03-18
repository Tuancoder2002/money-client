import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const walletsStore = useSelector((store: RootState) => store.wallet);
  const selectedWallet = useSelector((state: RootState) => state.wallet.selectedWallet);

  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
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

  const handleSave = () => {
    // Handle save logic here
    onClose();
    console.log({ amount, category, note, date });
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
        <h2 className="text-xl font-bold mb-4">Thêm Giao Dịch</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <img src="wallet-icon.png" alt="Wallet Icon" className="w-6 h-6" />
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
              <img src="group-icon.png" alt="Group Icon" className="w-6 h-6" />
            </div>
            <select
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Chọn loại</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <img src="note-icon.png" alt="Note Icon" className="w-6 h-6" />
            </div>
            <input
              type="text"
              className="border-b border-gray-300 focus:outline-none focus:border-black w-full"
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <img src="calendar-icon.png" alt="Calendar Icon" className="w-6 h-6" />
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
              Hủy
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;