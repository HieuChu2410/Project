import React, { useState, useEffect, useContext } from "react";
import "./Admin.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Admin = () => {
  const { token, user, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalFoods: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/");
      toast.error("Access denied. Admin only.");
      return;
    }
    fetchStats();
  }, [token, user, navigate]);

  const fetchStats = async () => {
    try {
      const [ordersRes, foodsRes, usersRes] = await Promise.all([
        axios.get(`${url}/api/order/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}/api/food/list`),
        axios.get(`${url}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const orders = ordersRes.data.data || [];
      const foods = foodsRes.data.data || [];
      const users = usersRes.data.data || [];

      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.amount || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalFoods: foods.length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Foods</h3>
          <p>{stats.totalFoods}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={() => navigate("/admin/foods")} className="admin-btn">
          Manage Foods
        </button>
        <button onClick={() => navigate("/admin/orders")} className="admin-btn">
          Manage Orders
        </button>
        <button onClick={() => navigate("/admin/users")} className="admin-btn">
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default Admin;
