import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Statistics: React.FC = () => {
  const walletId = useSelector(
    (state: RootState) => state.wallet.selectedWallet?.id
  );
  const refreshState = useSelector((state: RootState) => state.wallet.refresh);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [dailyAverage, setDailyAverage] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletId) {
        return;
      }

      try {
        // Gọi API để lấy tổng số tiền rút
        const totalResponse = await axios.get(
          `http://localhost:3000/transaction/total-expenses/current-month/${walletId}`
        );
        const totalExpenses = totalResponse.data.totalExpenses || 0;
        setTotalExpenses(totalExpenses);

        // Gọi API để lấy danh sách các danh mục
        const categoriesResponse = await axios.get(
          `http://localhost:3000/transaction/with-category-type/current-month/${walletId}`
        );
        const categoriesData = categoriesResponse.data;

        // Nhóm các mục có cùng tên danh mục và tính tổng số tiền cho mỗi nhóm
        const groupedCategories = categoriesData.reduce(
          (acc: any, category: any) => {
            if (!acc[category.name]) {
              let icon = "https://via.placeholder.com/24";
              if (category.name === "Food") {
                icon =
                  "https://png.pngtree.com/png-clipart/20240131/original/pngtree-iconbuttonpictogram--eateryrestaurant--dining-photo-png-image_14199886.png";
              } else if (category.name === "Bill") {
                icon =
                  "https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-paying-bills-rgb-color-icon-gas-literacy-art-vector-png-image_38871094.png";
              } else if (category.name === "Shopping") {
                icon =
                  "https://cdn.pixabay.com/photo/2017/03/29/04/09/shopping-icon-2184065_1280.png";
              } else if (category.name === "Move") {
                icon =
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Circle-icons-plane.svg/768px-Circle-icons-plane.svg.png";
              }
              acc[category.name] = {
                name: category.name,
                amount: 0,
                description: category.description,
                icon: icon,
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500 text-white">
      <div className="p-6 bg-gradient-to-r from-zinc-600 to-cyan-800 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300">Tổng cộng</h3>
            <p className="text-red-400 text-2xl font-bold">
              {totalExpenses.toLocaleString()} đ
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300">
              Trung bình hàng ngày
            </h3>
            <p className="text-blue-400 text-2xl font-bold">
              {dailyAverage.toLocaleString()} đ
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            width={400}
          />
        </div>
        <div className="mt-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2"
            >
              <div className="flex items-center">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-10 h-10 mr-4"
                />
                <div>
                  <span className="text-gray-300 text-lg">{category.name}</span>
                  {/* <p className="text-gray-400 text-sm">{category.description}</p> */}
                </div>
              </div>
              <span className="text-red-400 text-lg font-semibold">
                {category.amount.toLocaleString()} đ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
