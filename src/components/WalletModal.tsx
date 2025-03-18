// src/components/WalletModal.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet } from "../redux/walletSlice";
import axios from "axios";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userStore = useSelector((store: RootState) => store.auth);
  const wallets = useSelector((store: RootState) => store.wallet.wallets);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null); // Thêm trạng thái để theo dõi ví đang chọn

  useEffect(() => {
    const fetchWallets = async () => {
      const userId = userStore.data?.id;
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/wallet/user/${userId}`
          );
          dispatch(setWallets(response.data)); // Lưu danh sách ví vào Redux
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

  const handleUseWallet = (wallet: { id: number; name: string; balance: number }) => {
    dispatch(selectWallet(wallet)); // Gọi action để chọn ví
    setSelectedWalletId(wallet.id);
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
              <li key={wallet.id} className={`mb-2 p-4 rounded shadow ${selectedWalletId === wallet.id ? 'bg-green-200' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <span>{wallet.name} - Balance: {wallet.balance}</span>
                  <button
                    onClick={() => handleUseWallet(wallet)} 
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Use
                  </button>
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