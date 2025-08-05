import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  let authHeaders = req.headers.authorization;

  // Nếu không có Authorization header, kiểm tra token header (cho admin)
  if (!authHeaders) {
    authHeaders = req.headers.token;
  }

  console.log("HEADER:", authHeaders); // Log token header
  if (authHeaders) {
    let token = authHeaders;
    // Check if token is in "Bearer <token>" format
    if (authHeaders.startsWith("Bearer ")) {
      token = authHeaders.split(" ")[1];
    }

    try {
      const jwtSecret =
        process.env.JWT_SECRET || "fallback_jwt_secret_key_123456789";
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.id;
      console.log("USER ID:", req.userId); // Log userId sau khi decode
      next();
    } catch (error) {
      console.log("JWT VERIFY ERROR:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.log("NO AUTH HEADER");
    return res.status(401).json({ message: "Access denied" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { verifyToken, verifyAdmin };
