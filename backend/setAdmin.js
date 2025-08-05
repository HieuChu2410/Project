import mongoose from "mongoose";
import userModel from "./models/userModel.js";

const MONGO_URL = "mongodb://localhost:27017/fooddel"; // Sửa lại nếu database tên khác

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    const result = await userModel.updateOne(
      { email: "admin@fooddel.com" },
      { $set: { role: "admin" } }
    );
    if (result.modifiedCount > 0) {
      console.log("Đã cập nhật role admin thành công!");
    } else {
      console.log("Không tìm thấy user hoặc role đã là admin.");
    }
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
