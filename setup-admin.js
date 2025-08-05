const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== FOOD DELIVERY ADMIN SETUP ===\n");

// Kiểm tra xem có tài khoản admin chưa
console.log("1. Tạo tài khoản admin...");
exec("cd backend && node createAdmin.js", (error, stdout, stderr) => {
  if (error) {
    console.error("Lỗi khi tạo admin:", error);
    return;
  }
  console.log(stdout);

  console.log("\n2. Hướng dẫn chạy các services:");
  console.log("\n   Backend (port 4000):");
  console.log("   cd backend && npm start");

  console.log("\n   Frontend (port 5173):");
  console.log("   cd frontend && npm run dev");

  console.log("\n   Admin Interface (port 5174):");
  console.log("   cd admin && npm run dev");

  console.log("\n3. Thông tin đăng nhập admin:");
  console.log("   Email: admin@fooddel.com");
  console.log("   Password: admin123");

  console.log(
    "\n4. Sau khi chạy cả 3 services, đăng nhập với tài khoản admin sẽ tự động chuyển hướng đến admin interface!"
  );
});
