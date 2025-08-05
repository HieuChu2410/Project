import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import UserList from "./pages/List/UserList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPopup from "./components/LoginPopup";
import axios from "axios";

const App = () => {
  const url = "http://localhost:4001";
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token và xác thực
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      setShowLogin(true);
      return;
    }

    try {
      // Kiểm tra token có hợp lệ không bằng cách gọi API với timeout
      const response = await axios.get(`${url}/api/user/info`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000, // 5 giây timeout
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        // Token không hợp lệ
        localStorage.removeItem("token");
        setShowLogin(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Nếu có lỗi network hoặc token không hợp lệ
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.log("Network timeout, keeping token for now");
        // Nếu timeout, giữ token và cho phép truy cập (có thể do network chậm)
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        localStorage.removeItem("token");
        setShowLogin(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Nhận token từ URL nếu có (chuyển từ frontend sang admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Xóa token khỏi URL để tránh lộ ra ngoài
      window.history.replaceState({}, document.title, "/users");
      window.location.reload();
    } else {
      checkAuth();
    }
  }, []);

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Đang tải...
      </div>
    );
  }

  // Hiển thị login popup nếu chưa đăng nhập
  if (!isAuthenticated || showLogin) {
    return <LoginPopup setShowLogin={setShowLogin} url={url} />;
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<UserList url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/users" element={<UserList url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
