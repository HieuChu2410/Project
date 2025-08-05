import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const UserList = ({ url }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUsers(response.data.data.filter((u) => u.role === "user"));
      } else {
        toast.error("Lỗi tải danh sách tài khoản");
      }
    } catch (err) {
      toast.error("Lỗi kết nối server");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="list add flex-col">
      <p>Danh sách tài khoản khách hàng</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>STT</b>
          <b>Tên</b>
          <b>Email</b>
          <b>Vai trò</b>
        </div>
        {users.map((user, index) => (
          <div key={index} className="list-table-format">
            <p>{index + 1}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
