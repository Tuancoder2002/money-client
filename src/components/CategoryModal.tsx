import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/categorySlice"; // Import action từ categorySlice
import { RootState } from "../redux/store"; // Import RootState

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.category.categories); // Lấy dữ liệu danh mục từ Redux store

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
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
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="mb-2 p-4 rounded shadow bg-gray-100">
              <span>{category.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryModal;