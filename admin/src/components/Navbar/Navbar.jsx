import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  window.location.replace("http://localhost:5173?forceLogout=1");
};

const Navbar = () => {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <img className="profile" src={assets.profile_image} alt="" />
      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
};
export default Navbar;
