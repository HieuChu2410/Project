import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Validation functions
  const validateFirstName = (firstName) => {
    if (!firstName.trim()) return "Họ là bắt buộc";
    if (firstName.trim().length < 2) return "Họ phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(firstName.trim())) {
      return "Họ chỉ được chứa chữ cái và dấu cách";
    }
    return "";
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) return "Tên là bắt buộc";
    if (lastName.trim().length < 2) return "Tên phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(lastName.trim())) {
      return "Tên chỉ được chứa chữ cái và dấu cách";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Email không đúng định dạng (VD: example@email.com)";
    }
    return "";
  };

  const validateStreet = (street) => {
    if (!street.trim()) return "Địa chỉ đường là bắt buộc";
    if (street.trim().length < 5)
      return "Địa chỉ đường phải có ít nhất 5 ký tự";
    return "";
  };

  const validateCity = (city) => {
    if (!city.trim()) return "Thành phố là bắt buộc";
    if (city.trim().length < 2) return "Thành phố phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(city.trim())) {
      return "Thành phố chỉ được chứa chữ cái và dấu cách";
    }
    return "";
  };

  const validateState = (state) => {
    if (!state.trim()) return "Tỉnh/Thành là bắt buộc";
    if (state.trim().length < 2) return "Tỉnh/Thành phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(state.trim())) {
      return "Tỉnh/Thành chỉ được chứa chữ cái và dấu cách";
    }
    return "";
  };

  const validateZipcode = (zipcode) => {
    if (!zipcode.trim()) return "Mã zip là bắt buộc";
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipcode.trim())) {
      return "Mã zip phải có đúng 5 chữ số";
    }
    return "";
  };

  const validateCountry = (country) => {
    if (!country.trim()) return "Quốc gia là bắt buộc";
    if (country.trim().length < 2) return "Quốc gia phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(country.trim())) {
      return "Quốc gia chỉ được chứa chữ cái và dấu cách";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Số điện thoại là bắt buộc";
    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex =
      /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Số điện thoại không đúng định dạng (VD: 0123456789 hoặc +84123456789)";
    }
    return "";
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));

    // Validate real-time
    let error = "";
    switch (name) {
      case "firstName":
        error = validateFirstName(value);
        break;
      case "lastName":
        error = validateLastName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "street":
        error = validateStreet(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "state":
        error = validateState(value);
        break;
      case "zipcode":
        error = validateZipcode(value);
        break;
      case "country":
        error = validateCountry(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Validate tất cả trường trước khi submit
    const newErrors = {
      firstName: validateFirstName(data.firstName),
      lastName: validateLastName(data.lastName),
      email: validateEmail(data.email),
      street: validateStreet(data.street),
      city: validateCity(data.city),
      state: validateState(data.state),
      zipcode: validateZipcode(data.zipcode),
      country: validateCountry(data.country),
      phone: validatePhone(data.phone),
    };

    setErrors(newErrors);

    // Kiểm tra xem có lỗi nào không
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = {
          _id: item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          quantity: cartItems[item._id],
        };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đặt hàng");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  });

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <div className="input-group">
            <input
              required
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="Họ"
              className={errors.firstName ? "error" : ""}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>
          <div className="input-group">
            <input
              required
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Tên"
              className={errors.lastName ? "error" : ""}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>
        </div>
        <div className="input-group">
          <input
            required
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email"
            className={errors.email ? "error" : ""}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <div className="input-group">
          <input
            required
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            type="text"
            placeholder="Địa chỉ đường"
            className={errors.street ? "error" : ""}
          />
          {errors.street && (
            <span className="error-message">{errors.street}</span>
          )}
        </div>
        <div className="multi-fields">
          <div className="input-group">
            <input
              required
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder="Thành phố"
              className={errors.city ? "error" : ""}
            />
            {errors.city && (
              <span className="error-message">{errors.city}</span>
            )}
          </div>
          <div className="input-group">
            <input
              required
              name="state"
              onChange={onChangeHandler}
              value={data.state}
              type="text"
              placeholder="Tỉnh/Thành"
              className={errors.state ? "error" : ""}
            />
            {errors.state && (
              <span className="error-message">{errors.state}</span>
            )}
          </div>
        </div>
        <div className="multi-fields">
          <div className="input-group">
            <input
              required
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              type="text"
              placeholder="Mã zip (5 số)"
              className={errors.zipcode ? "error" : ""}
            />
            {errors.zipcode && (
              <span className="error-message">{errors.zipcode}</span>
            )}
          </div>
          <div className="input-group">
            <input
              required
              name="country"
              onChange={onChangeHandler}
              value={data.country}
              type="text"
              placeholder="Quốc gia"
              className={errors.country ? "error" : ""}
            />
            {errors.country && (
              <span className="error-message">{errors.country}</span>
            )}
          </div>
        </div>
        <div className="input-group">
          <input
            required
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Số điện thoại"
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
