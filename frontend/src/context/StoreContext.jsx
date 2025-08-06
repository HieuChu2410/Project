import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as food_list_data } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4001";
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [food_list, setFoodList] = useState(food_list_data);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodList, setFilteredFoodList] = useState(food_list_data);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Function to search food items
  const searchFood = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredFoodList(food_list);
    } else {
      const filtered = food_list.filter((food) =>
        food.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFoodList(filtered);
    }
  };

  // Update filtered list when food_list changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFoodList(food_list);
    } else {
      const filtered = food_list.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoodList(filtered);
    }
  }, [food_list, searchTerm]);

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    sessionStorage.removeItem("cartItems");
  };

  // Thêm useEffect để load cart khi token thay đổi
  useEffect(() => {
    if (token && user) {
      // Load cart data khi có token và user
      loadCartData(token);
    } else if (!token) {
      clearCart();
    }
  }, [token, user]);

  // Thêm useEffect để reset cart khi token thay đổi
  useEffect(() => {
    if (!token) {
      clearCart();
    }
  }, [token]);

  // Thêm useEffect để đồng bộ cartItems với localStorage
  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      localStorage.removeItem("cartItems");
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (itemId) => {
    try {
      // Always update local state first for better UX
      if (!cartItems[itemId]) {
        setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }

      // If user is logged in, sync with backend
      if (token) {
        const response = await axios.post(
          url + "/api/cart/add",
          {
            itemId: itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          console.error("Failed to sync cart with backend");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // If backend sync fails, we still have the local state updated
      // so user experience is not affected
    }
  };

  const removeFromCart = async (itemId) => {
    // Always update local state first for better UX
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    // If user is logged in, sync with backend
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error syncing cart removal with backend:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      // Keep using default food_list_data if API fails
      setFoodList(food_list_data);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && response.data.CartData) {
        setCartItems(response.data.CartData);
      } else {
        clearCart(); // Fallback to empty object
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      clearCart(); // Fallback to empty object
    }
  };

  const loadUserInfo = async (token) => {
    try {
      const response = await axios.get(url + "/api/user/info", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000, // 5 giây timeout
      });
      if (response.data.success) {
        setUser(response.data.user);
        return true; // Trả về true nếu thành công
      } else {
        // Token không hợp lệ
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        // Nếu timeout, giữ user data hiện tại (có thể do network chậm)
        return true;
      } else if (error.response && error.response.status === 401) {
        // Token không hợp lệ
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        return false;
      } else {
        // Lỗi khác, giữ user data hiện tại
        return true;
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          // Load user info trước, nếu thành công thì load cart data
          const userLoaded = await loadUserInfo(storedToken);
          if (userLoaded) {
            await loadCartData(storedToken);
          }
        } else {
          // Không có token, đảm bảo state sạch
          setToken("");
          setUser(null);
          clearCart(); // Xóa cart khi không có token
        }
      } catch (error) {
        console.error("Error in loadData:", error);
      } finally {
        setIsAuthLoading(false);
      }
    }
    loadData();
  }, []);

  // Chỉ reset user khi token bị xóa hoàn toàn (không phải khi đang load)
  useEffect(() => {
    if (!token && !isAuthLoading) {
      setUser(null);
    }
  }, [token, isAuthLoading]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    searchFood,
    searchTerm,
    filteredFoodList,
    isAuthLoading,
    clearCart, // Thêm vào context
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
