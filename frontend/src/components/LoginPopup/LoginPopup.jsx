import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUser } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      // Kiểm tra xác nhận mật khẩu
      if (data.password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);

        // Thông báo thành công bằng toast
        if (currState === "Login") {
          toast.success("Đăng nhập thành công!");
        } else {
          toast.success("Đăng ký thành công!");
        }

        // Đóng popup ngay lập tức
        setShowLogin(false);

        // Kiểm tra role của user và chuyển hướng nếu là admin
        if (response.data.user.role === "admin") {
          console.log("Admin detected, redirecting to admin interface...");
          setTimeout(() => {
            window.location.href = `http://localhost:5174?token=${response.data.token}`;
          }, 1000);
        } else {
          console.log("Regular user, staying on frontend");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      if (error.response) {
        alert(error.response.data.message || "An error occurred");
      } else if (error.request) {
        alert("Cannot connect to server. Please check if backend is running.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-close" onClick={() => setShowLogin(false)}>
          ✕
        </div>
        <div className="login-popup-title">
          <h2>{currState}</h2>
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <div style={{ position: "relative" }}>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
            {data.password && (
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? assets.hide_icon : assets.view_icon}
                  alt=""
                  style={{ width: 16, height: 16 }}
                />
              </span>
            )}
          </div>
          {currState === "Sign Up" && (
            <div style={{ position: "relative" }}>
              <input
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                required
                style={{ width: "100%", paddingRight: "40px" }}
              />
              {confirmPassword && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <img
                    src={
                      showConfirmPassword ? assets.hide_icon : assets.view_icon
                    }
                    alt=""
                    style={{ width: 16, height: 16 }}
                  />
                </span>
              )}
            </div>
          )}
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}> Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}> Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
