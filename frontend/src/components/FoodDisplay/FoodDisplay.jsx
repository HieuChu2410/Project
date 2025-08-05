import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { filteredFoodList, searchTerm } = useContext(StoreContext);

  // Kiểm tra filteredFoodList có tồn tại và là array
  const foodList = Array.isArray(filteredFoodList) ? filteredFoodList : [];

  return (
    <div className="food-display" id="food-display">
      <hr />
      <h2>
        {searchTerm
          ? `Search results for "${searchTerm}"`
          : "Top dishes near you"}
      </h2>
      <div className="food-display-list">
        {foodList.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
      {searchTerm && foodList.length === 0 && (
        <div className="no-results">
          <p>No food items found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
