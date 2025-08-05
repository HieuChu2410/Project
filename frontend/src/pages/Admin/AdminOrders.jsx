import React, { useState, useEffect, useContext } from "react";
import "./AdminOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const AdminOrders = () => {
  const { token, user, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/");
      toast.error("Access denied. Admin only.");
      return;
    }
    fetchAllOrders();
  }, [token, user, navigate]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId: orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>Manage Orders</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-icon">
                <img src={assets.parcel_icon} alt="" />
              </div>
              <div className="order-details">
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <div className="order-info">
                <p className="order-items-count">Items: {order.items.length}</p>
                <p className="order-amount">${order.amount}</p>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="order-status"
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
