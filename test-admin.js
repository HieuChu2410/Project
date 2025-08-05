const mongoose = require("mongoose");
const userModel = require("./backend/models/userModel.js");

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/food-delivery")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Kiểm tra tài khoản admin
async function checkAdmin() {
  try {
    const admin = await userModel.findOne({ email: "admin@fooddel.com" });

    if (admin) {
      console.log("✅ Tài khoản admin đã tồn tại:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log("❌ Tài khoản admin chưa tồn tại!");
      console.log("Chạy lệnh: cd backend && node createAdmin.js");
    }

    // Kiểm tra tất cả users
    const allUsers = await userModel.find({}).select("-password");
    console.log("\n📋 Danh sách tất cả users:");
    allUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdmin();
