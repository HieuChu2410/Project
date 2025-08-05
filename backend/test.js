import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";

const testBackend = async () => {
  try {
    // Test database connection
    console.log("Testing database connection...");
    await mongoose.connect(
      "mongodb+srv://greatstack:33858627@cluster0.svsgs6w.mongodb.net/food-del"
    );
    console.log("✅ Database connected successfully!");

    // Test creating admin user
    console.log("\nTesting admin user creation...");
    const existingAdmin = await userModel.findOne({
      email: "admin@fooddel.com",
    });
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      const adminUser = new userModel({
        name: "Admin",
        email: "admin@fooddel.com",
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully!");
    }

    // Test user model
    console.log("\nTesting user model...");
    const users = await userModel.find({});
    console.log(`✅ Found ${users.length} users in database`);

    console.log("\n🎉 All tests passed! Backend is working correctly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testBackend();
