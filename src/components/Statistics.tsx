import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import API_BASE_URL from "../config/apiConfig";
import HistoryTransaction from "./HistoryTransaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";

const Statistics: React.FC = () => {
  const walletId = useSelector(
    (state: RootState) => state.wallet.selectedWallet?.id
  );
  const refreshState = useSelector((state: RootState) => state.wallet.refresh);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [dailyAverage, setDailyAverage] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // State để điều khiển modal

  useEffect(() => {
    const fetchData = async () => {
      if (!walletId) {
        return;
      }

      try {
        // Gọi API để lấy tổng số tiền rút
        const totalResponse = await axios.get(
          `${API_BASE_URL}/transaction/total-expenses/current-month/${walletId}`
        );
        const totalExpenses = totalResponse.data.totalExpenses || 0;
        setTotalExpenses(totalExpenses);

        // Gọi API để lấy danh sách các danh mục
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/transaction/with-category-type/current-month/${walletId}`
        );
        const categoriesData = categoriesResponse.data;

        // Nhóm các mục có cùng tên danh mục và tính tổng số tiền cho mỗi nhóm
        const groupedCategories = categoriesData.reduce(
          (acc: any, category: any) => {
            if (!acc[category.name]) {
              acc[category.name] = {
                name: category.name,
                amount: 0,
                description: category.description,
                icon: category.icon || "https://via.placeholder.com/24", // Sử dụng icon từ API hoặc icon mặc định
              };
            }
            acc[category.name].amount += category.amount;
            return acc;
          },
          {}
        );

        // Chuyển đổi đối tượng thành mảng và tính phần trăm
        const categoriesArray = Object.values(groupedCategories).map(
          (category: any) => ({
            ...category,
            percentage: totalExpenses
              ? (category.amount / totalExpenses) * 100
              : 0,
          })
        );

        setCategories(categoriesArray);

        // Tính toán trung bình hàng ngày
        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        setDailyAverage(totalExpenses / daysInMonth);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, [walletId, refreshState]);

  const chartData = {
    series: categories.map((category) => category.amount),
    options: {
      chart: {
        type: "donut" as const,
      },
      labels: categories.map((category) => category.name),
      legend: {
        fontSize: "16px",
        labels: { colors: "#ffffff" },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
              fontSize: "14px",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      {!walletId ? (
        // Hiển thị nút khi chưa chọn ví
        <div className="flex flex-col items-center justify-center text-center">
          {/* Chữ "Hãy chọn ví" nhấp nháy */}
          <h2 className="text-2xl font-bold text-gray-100 mb-4 animate-pulse">
            Hãy chọn ví
          </h2>
          {/* Vùng nét đứt bao quanh nút */}
          <div className="flex items-center justify-center w-[500px] h-[250px] border-2 border-dashed border-gray-300 rounded-lg">
            <button       
              className="flex items-center justify-center w-40 h-40 bg-white text-indigo-500 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300"
            >
              <FontAwesomeIcon icon={faFrown} className="text-8xl" />
            </button>
          </div>
          <p className="text-lg text-gray-300 mt-4">
            Hãy nhấp vào logo trên cùng để thêm ví
          </p>
        </div>
      ) : (
        // Hiển thị thống kê khi đã chọn ví
<div className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl w-full max-w-2xl h-auto max-h-[500px] overflow-y-auto">
  <div className="flex justify-between mb-4"> {/* Giảm margin-bottom */}
    <div>
      <h3 className="text-lg font-semibold text-gray-400">Tổng cộng</h3>
      <p className="text-red-400 text-2xl font-extrabold"> {/* Giảm kích thước chữ */}
        {totalExpenses.toLocaleString()} đ
      </p>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-400">Trung bình hàng ngày</h3>
      <p className="text-blue-400 text-2xl font-extrabold"> {/* Giảm kích thước chữ */}
        {dailyAverage.toLocaleString()} đ
      </p>
    </div>
  </div>
  <div className="flex justify-center">
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="donut"
      width={300} 
    />
  </div>
  <div className="mt-4"> {/* Giảm margin-top */}
    {categories.slice(0, 3).map((category, index) => (
      <div
        key={index}
        className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2" 
      >
        <div className="flex items-center">
          <img
            src={category.icon}
            alt={category.name}
            className="w-10 h-10 mr-2 rounded-full shadow-lg" 
          />
          <div>
            <span className="text-gray-300 text-base font-medium"> 
              {category.name}
            </span>
          </div>
        </div>
        <span className="text-red-400 text-base font-semibold"> 
          {category.amount.toLocaleString()} đ
        </span>
      </div>
    ))}
    <div className="flex justify-center mt-4"> 
      <button
        onClick={() => setIsHistoryModalOpen(true)} // Mở modal khi nhấn nút
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-sm" 
      >
        Lịch sử giao dịch
      </button>
    </div>
  </div>
</div>
      )}
  
      {/* Modal Lịch sử giao dịch */}
      <HistoryTransaction
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)} // Đóng modal
      />
    </div>
  );
};

export default Statistics;