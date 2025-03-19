import React from "react";
import ReactApexChart from "react-apexcharts";

const Statistics: React.FC = () => {
  const totalWithdraw = 4687000;
  const dailyAverage = 246684.21;
  const categories = [
    { name: "Hóa đơn & Tiện ích", amount: 2500000, percentage: 54, icon: "https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-paying-bills-rgb-color-icon-gas-literacy-art-vector-png-image_38871094.png" },
    { name: "Ăn uống", amount: 1737000, percentage: 37, icon: "https://png.pngtree.com/png-clipart/20240131/original/pngtree-iconbuttonpictogram--eateryrestaurant--dining-photo-png-image_14199886.png" },
    { name: "Mua sắm", amount: 250000, percentage: 5, icon: "https://cdn.pixabay.com/photo/2017/03/29/04/09/shopping-icon-2184065_1280.png" },
    { name: "Di chuyển", amount: 200000, percentage: 4, icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Circle-icons-plane.svg/768px-Circle-icons-plane.svg.png" },
  ];

  const chartData = {
    series: categories.map(category => category.amount),
    options: {
      chart: {
        type: 'donut' as const,
      },
      labels: categories.map(category => category.name),
      legend: {
        fontSize: '16px',
        labels: { colors: '#ffffff' },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
            fontSize: '14px',
          }
        }
      }]
    },
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500 text-white">
      <div className="p-6 bg-gradient-to-r from-zinc-600 to-cyan-800 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300">Tổng cộng</h3>
            <p className="text-red-400 text-2xl font-bold">{totalWithdraw.toLocaleString()} đ</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300">Trung bình hàng ngày</h3>
            <p className="text-blue-400 text-2xl font-bold">{dailyAverage.toLocaleString()} đ</p>
          </div>
        </div>
        <div className="flex justify-center">
          <ReactApexChart options={chartData.options} series={chartData.series} type="donut" width={400} />
        </div>
        <div className="mt-6">
          {categories.map((category, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
              <div className="flex items-center">
                <img src={category.icon} alt={category.name} className="w-6 h-6 mr-2" />
                <span className="text-gray-300 text-lg">{category.name}</span>
              </div>
              <span className="text-red-400 text-lg font-semibold">{category.amount.toLocaleString()} đ</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
