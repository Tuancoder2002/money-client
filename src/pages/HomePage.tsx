// src/pages/HomePage.tsx
import React, { useEffect } from "react";
import HeaderForm from "../components/HeaderForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const HomePage: React.FC = () => {
  const userStore = useSelector((store: RootState) => store.auth);

  useEffect(() => {
    if (!userStore.loading && !userStore.data) {
    }
  }, [userStore.data, userStore.loading]);

  if (userStore.loading) {
    return <div>Loading...</div>;
  }

  if (!userStore.loading && !userStore.data) {
    return (
      <div>
        <h1>Chưa có dữ liệu người dùng</h1>
      </div>
    );
  }

  return (
    <div>
      <HeaderForm />
    </div>
   
  );
};

export default HomePage;
