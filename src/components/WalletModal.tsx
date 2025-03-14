// src/components/WalletModal.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Đảm bảo bạn đã import RootState
import axios from "axios";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [wallets, setWallets] = useState<
    { id: number; name: string; balance: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.userId); // Lấy ID người dùng từ Redux

  useEffect(() => {
    const fetchWallets = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/wallet/user/${userId}`
          );
          setWallets(response.data); // Giả sử response.data là mảng các ví
        } catch (error) {
          console.error("Error fetching wallets:", error);
        } finally {
          setLoading(false); // Đặt loading thành false sau khi hoàn thành
        }
      } else {
        console.log("No userId found"); // Log nếu không có userId
        setLoading(false); // Nếu userId không hợp lệ, cũng đặt loading thành false
      }
    };

    fetchWallets();
  }, [userId, isOpen]); // Thêm isOpen vào dependency array để gọi lại khi modal mở

  if (!isOpen) return null; // Nếu modal không mở, không hiển thị gì
  if (loading) return <div>Loading...</div>; // Hiển thị loading khi đang gọi API

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
        <h2 className="text-xl font-bold mb-4">Your Wallets</h2>
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.id} className="mb-2">
              {wallet.name} - Balance: {wallet.balance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletModal;
