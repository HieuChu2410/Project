import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (req, res) => {
  if (!req.file) {
    console.log("⚠️ Không có file nào được gửi lên.");
    return res
      .status(400)
      .json({ success: false, message: "No image file uploaded" });
  }

  // Validate required fields
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  let image_filename = req.file.filename;

  const food = new foodModel({
    name: name,
    description: description,
    price: price,
    category: category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// add food list

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    // Validate if id is provided
    if (!req.body.id) {
      return res
        .status(400)
        .json({ success: false, message: "Food ID is required" });
    }

    const food = await foodModel.findById(req.body.id);

    // Check if food exists
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // Remove image file if exists
    if (food.image) {
      const imagePath = `uploads/${food.image}`;
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.log("Error deleting image file:", err);
        }
      });
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
