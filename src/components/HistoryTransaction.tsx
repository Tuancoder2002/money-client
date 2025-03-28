import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Import RootState
import API_BASE_URL from "../config/apiConfig";

interface HistoryTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryTransaction: React.FC<HistoryTransactionProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]); // State để lưu danh sách giao dịch
  const walletId = useSelector(
    (state: RootState) => state.wallet.selectedWallet?.id
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletId) return; // Nếu chưa chọn ví, không gọi API

      try {
        const response = await axios.get(
          `${API_BASE_URL}/transaction/all-transactions/current-month/${walletId}`
        );
        setTransactions(response.data); // Lưu danh sách giao dịch vào state
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, walletId]);

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;

  // Gom nhóm giao dịch theo ngày
  const groupedTransactions = transactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("vi-VN", {
      weekday: "long", // Thêm thông tin về "Thứ"
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          Đóng
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Lịch sử giao dịch
        </h2>

        {/* Transaction List */}
        <div className="max-h-96 overflow-y-auto space-y-6">
          {Object.keys(groupedTransactions).map((date) => (
            <div key={date}>
              {/* Ngày giao dịch */}
              <div className="text-lg font-semibold text-blue-700 mb-2">
                {date} {/* Hiển thị ngày kèm "Thứ" */}
              </div>
              <ul className="space-y-4">
                {groupedTransactions[date].map((transaction: any) => (
                  <li
                    key={transaction.id}
                    className="p-4 rounded-lg shadow bg-gray-100 flex justify-between items-center"
                  >
                    {/* Icon và nội dung giao dịch */}
                    <div className="flex items-center">
                      <img
                        src={transaction.icon}
                        alt={transaction.name}
                        className="w-10 h-10 mr-4 rounded-full"
                      />
                      <div>
                        <div className="text-lg font-semibold text-gray-800">
                          {transaction.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {transaction.description}
                        </div>
                      </div>
                    </div>

                    {/* Số tiền */}
                    <div
                      className={`text-lg font-semibold ${
                        transaction.categoryType === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.categoryType === "INCOME"
                        ? `+${transaction.amount.toLocaleString("vi-VN")} ₫`
                        : `-${transaction.amount.toLocaleString("vi-VN")} ₫`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryTransaction;
