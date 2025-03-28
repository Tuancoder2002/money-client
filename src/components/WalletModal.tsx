import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWallets, selectWallet } from "../redux/walletSlice";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { FaCheck, FaPlus, FaWallet } from "react-icons/fa"; // Import thêm các icon từ Font Awesome

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddWallet: () => void; // Hàm callback để mở modal thêm ví
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onOpenAddWallet,
}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userStore = useSelector((store: RootState) => store.auth);
  const wallets = useSelector((store: RootState) => store.wallet.wallets);
  const selectedWallet = useSelector(
    (store: RootState) => store.wallet.selectedWallet
  );

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
  }, [userStore.data?.id, dispatch]);

  const handleUseWallet = (wallet: {
    id: number;
    name: string;
    balance: number;
    userId: number;
  }) => {
    dispatch(selectWallet(wallet));
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
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6 flex items-center justify-center">
          <FaWallet className="mr-2 w-6 h-6 text-blue-900" /> Danh sách ví
        </h2>

        {/* Wallet List */}
        {wallets.length === 0 ? (
          <p className="text-gray-600 text-center">Không tìm thấy ví nào.</p>
        ) : (
          <ul className="space-y-4">
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className={`p-4 rounded-lg shadow flex justify-between items-center ${
                  selectedWallet?.id === wallet.id
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <FaWallet className="text-blue-900 w-6 h-6 mr-3" />
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {wallet.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Số dư:{" "}
                      <span className="font-medium text-blue-900">
                        {wallet.balance !== undefined
                          ? wallet.balance.toLocaleString()
                          : "0"}{" "}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleUseWallet(wallet)}
                  className={`transition duration-200 flex items-center justify-center ${
                    selectedWallet?.id === wallet.id
                      ? "cursor-default"
                      : "bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-lg"
                  }`}
                  disabled={selectedWallet?.id === wallet.id}
                >
                  {selectedWallet?.id === wallet.id ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white w-4 h-4" /> {/* Icon dấu kiểm nhỏ gọn trong hình tròn */}
                    </div>
                  ) : (
                    "Sử dụng"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Wallet Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onOpenAddWallet}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200 flex items-center justify-center"
          >
            <FaPlus className="mr-2 w-4 h-4" /> Thêm ví {/* Icon dấu cộng nhỏ gọn */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;