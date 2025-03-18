// src/components/WalletModal.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [wallets, setWallets] = useState<
    { id: number; name: string; balance: number; isSelected: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const userStore = useSelector((store: RootState) => store.auth);

  useEffect(() => {
    const fetchWallets = async () => {
      const userId = userStore.data?.id;
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/wallet/user/${userId}`
          );
          const walletsWithSelection = response.data.map((wallet: any) => ({
            ...wallet,
            isSelected: false, // Thêm trạng thái isSelected
          }));
          setWallets(walletsWithSelection);
        } catch (error) {
          console.error("Error fetching wallets:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchWallets();
  }, [userStore.data?.id]);

  const handleUseWallet = (id: number) => {
    setWallets((prevWallets) =>
      prevWallets.map((wallet) =>
        wallet.id === id
          ? { ...wallet, isSelected: !wallet.isSelected } // Chuyển đổi trạng thái isSelected
          : { ...wallet, isSelected: false } // Đặt các ví khác thành không được chọn
      )
    );
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;

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
        {wallets.length === 0 ? (
          <p>No wallets found.</p>
        ) : (
          <ul>
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className={`mb-2 p-4 rounded shadow ${
                  wallet.isSelected ? " bg-green-500 text-white" : "bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{wallet.name} - Balance: {wallet.balance}</span>
                  <div>
                  <button
                    onClick={() => handleUseWallet(wallet.id)} // Gọi hàm khi nhấn vào "Use"
                    className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800"
                  >
                    {wallet.isSelected ? "Used" : "Use"}
                  </button>
                  <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" > Edit </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WalletModal;