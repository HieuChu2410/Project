import React, { useState, useEffect, useContext } from "react";
import "./AdminFoods.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const AdminFoods = () => {
  const { token, user, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [list, setList] = useState([]);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/");
      toast.error("Access denied. Admin only.");
      return;
    }
    if (activeTab === "list") {
      fetchData();
    }
  }, [token, user, navigate, activeTab]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching foods");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch foods");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success("Food removed successfully");
        await fetchData();
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to remove food");
    }
  };

  const onChangeHandle = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandle = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
        toast.success(response.data.message);
        setActiveTab("list");
        await fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add food");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-foods">
      <div className="admin-foods-header">
        <h1>Manage Foods</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === "list" ? "active" : ""}
            onClick={() => setActiveTab("list")}
          >
            Food List
          </button>
          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Food
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="food-list">
          <h3>All Foods List</h3>
          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b>Action</b>
            </div>
            {list.map((item, index) => (
              <div key={index} className="list-table-format">
                <img src={`${url}/images/${item.image}`} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p onClick={() => removeFood(item._id)} className="cursor">
                  X
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="add-food">
          <h3>Add New Food</h3>
          <form className="flex-col" onSubmit={onSubmitHandle}>
            <div className="add-img-upload flex-col">
              <p>Upload Image</p>
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                required
              />
            </div>
            <div className="add-product-name flex-col">
              <p>Product name</p>
              <input
                onChange={onChangeHandle}
                value={data.name}
                type="text"
                name="name"
                placeholder="Type here"
                required
              />
            </div>
            <div className="add-product-description flex-col">
              <p>Product description</p>
              <textarea
                onChange={onChangeHandle}
                value={data.description}
                name="description"
                rows="6"
                placeholder="Write content here"
                required
              ></textarea>
            </div>
            <div className="add-category-price">
              <div className="add-category flex-col">
                <p>Product category</p>
                <select
                  onChange={onChangeHandle}
                  value={data.category}
                  name="category"
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>
              <div className="add-price flex-col">
                <p>Product price</p>
                <input
                  onChange={onChangeHandle}
                  value={data.price}
                  type="Number"
                  name="price"
                  placeholder="$20"
                  required
                />
              </div>
            </div>
            <button type="submit" className="add-btn">
              ADD
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;
