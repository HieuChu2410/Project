# Food Delivery App - Admin Integration

## Tích hợp Admin vào Frontend

Dự án này đã được tích hợp admin panel vào frontend, cho phép admin quản lý từ cùng một hệ thống với user thường.

### Các thay đổi đã thực hiện:

#### Backend Changes:

1. **User Model**: Thêm trường `role` để phân biệt admin và user thường
2. **User Controller**: Cập nhật để trả về thông tin user và role
3. **Auth Middleware**: Thêm middleware `verifyAdmin` để bảo vệ route admin
4. **User Routes**: Thêm route `/api/user/list` để lấy danh sách user (admin only)

#### Frontend Changes:

1. **StoreContext**: Thêm state `user` và `setUser` để lưu thông tin user
2. **Admin Pages**: Tạo các trang admin trong `frontend/src/pages/Admin/`
   - `Admin.jsx` - Dashboard chính
   - `AdminFoods.jsx` - Quản lý món ăn
   - `AdminOrders.jsx` - Quản lý đơn hàng
3. **App.jsx**: Thêm routes admin
4. **Navbar**: Thêm link "Admin Panel" cho admin
5. **LoginPopup**: Cập nhật để lưu thông tin user

### Cách sử dụng:

#### 1. Tạo Admin User:

```bash
cd backend
npm run create-admin
```

Admin credentials:

- Email: admin@fooddel.com
- Password: admin123

#### 2. Chạy Backend:

```bash
cd backend
npm run dev
```

#### 3. Chạy Frontend:

```bash
cd frontend
npm run dev
```

#### 4. Đăng nhập Admin:

1. Mở frontend (thường là http://localhost:5173)
2. Click "sign in"
3. Đăng nhập với email: admin@fooddel.com, password: admin123
4. Sau khi đăng nhập, bạn sẽ thấy "Admin Panel" trong dropdown menu
5. Click "Admin Panel" để vào trang quản lý

### Tính năng Admin:

1. **Dashboard**: Xem thống kê tổng quan
2. **Manage Foods**:
   - Xem danh sách món ăn
   - Thêm món ăn mới
   - Xóa món ăn
3. **Manage Orders**:
   - Xem tất cả đơn hàng
   - Cập nhật trạng thái đơn hàng

### Bảo mật:

- Chỉ user có `role: 'admin'` mới có thể truy cập admin panel
- Tất cả API admin đều được bảo vệ bằng middleware `verifyAdmin`
- Nếu user không phải admin cố gắng truy cập admin panel, sẽ bị redirect về trang chủ

### Lưu ý:

- Admin panel được tích hợp hoàn toàn vào frontend, không cần chạy riêng
- Tất cả chức năng admin từ folder `admin/` đã được chuyển vào frontend
- Có thể xóa folder `admin/` sau khi đã tích hợp thành công

# Giao diện các trang
