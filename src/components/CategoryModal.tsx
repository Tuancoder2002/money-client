import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/categorySlice"; // Import action từ categorySlice
import { RootState } from "../redux/store"; // Import RootState
import API_BASE_URL from "../config/apiConfig";
import { FaTimes, FaListAlt } from "react-icons/fa"; // Import các icon từ Font Awesome

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.category.categories
  ); // Lấy dữ liệu danh mục từ Redux store

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/category`);
        dispatch(setCategories(response.data)); // Lưu dữ liệu vào Redux store
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FaTimes className="w-5 h-5" /> {/* Icon đóng */}
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center justify-center text-center">
  <FaListAlt className="mr-2 w-6 h-6" /> Danh mục
</h2>

        {/* Category List */}
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="p-4 rounded-lg shadow flex items-center bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                {/* Hiển thị icon bên trái */}
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-8 h-8 mr-4 rounded-full"
                />
                <span className="text-gray-800 font-medium">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;