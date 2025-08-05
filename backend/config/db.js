import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Thử kết nối MongoDB Atlas trước
    await mongoose.connect(
      "mongodb+srv://greatstack:33858627@cluster0.svsgs6w.mongodb.net/food-del"
    );
    console.log("DB Connected to Atlas");
  } catch (error) {
    console.log("Atlas connection failed, trying local MongoDB...");
    try {
      // Fallback to local MongoDB
      await mongoose.connect("mongodb://localhost:27017/food-del");
      console.log("DB Connected to local MongoDB");
    } catch (localError) {
      console.log("Local MongoDB connection failed:", localError.message);
      console.log(
        "Please make sure MongoDB is running or check your connection string"
      );
    }
  }
};
