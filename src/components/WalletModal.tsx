import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet } from "../redux/walletSlice";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddWallet: () => void; // Thêm hàm callback để mở modal thêm ví
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onOpenAddWallet }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userStore = useSelector((store: RootState) => store.auth);
  const wallets = useSelector((store: RootState) => store.wallet.wallets);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      const userId = userStore.data?.id;
      if (userId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/wallet/user/${userId}`
          );
          dispatch(setWallets(response.data));
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

  const handleUseWallet = (wallet: { id: number; name: string; balance: number; userId: number }) => {
    dispatch(selectWallet(wallet));
    setSelectedWalletId(wallet.id);
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;

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
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Your Wallets</h2>
        {wallets.length === 0 ? (
          <p>No wallets found.</p>
        ) : (
          <ul>
            {wallets.map((wallet) => (
              <li key={wallet.id} className={`mb-2 p-4 rounded shadow ${selectedWalletId === wallet.id ? 'bg-green-200' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <span>{wallet.name} - Balance: {wallet.balance !== undefined ? wallet.balance.toLocaleString() : '0'} đ</span>
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
        <button onClick={onOpenAddWallet} className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition duration-200">Add Wallet</button>
      </div>
    </div>
  );
};

export default WalletModal;