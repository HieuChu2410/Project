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
Dự án Food Delivery App được xây dựng với hai loại giao diện chính, phục vụ cho hai nhóm người dùng riêng biệt: User (khách hàng) và Admin (quản trị viên).

## Giao diện Admin
- Giao diện quản trị đã được tích hợp trực tiếp vào frontend, sử dụng các thành phần từ thư viện Ant Design Vue để đảm bảo tính hiện đại, nhất quán và dễ sử dụng. Admin panel cho phép quản lý hệ thống thông qua các trang như: quản lý sản phẩm, đơn hàng, thương hiệu, kiểu dáng và kho hàng. Tất cả các chức năng admin được bảo vệ bằng hệ thống phân quyền thông qua trường role, đảm bảo chỉ người dùng có vai trò admin mới được truy cập.
! Nếu một user thông thường cố truy cập trang quản trị, hệ thống sẽ tự động chuyển hướng về trang chủ, đảm bảo an toàn và đúng chức năng.

## Giao diện User
- Giao diện dành cho khách hàng được tùy biến từ template Adara - Modern & Multipurpose eCommerce Template, có bố cục rõ ràng, hiện đại, dễ thao tác. Người dùng có thể duyệt thực đơn, tìm kiếm món ăn, thêm vào giỏ hàng và đặt hàng một cách dễ dàng.
- Toàn bộ giao diện được thiết kế thống nhất, tối ưu cho trải nghiệm người dùng lẫn quản trị viên, hỗ trợ hiệu quả cho cả phía frontend và backend.

### 1. Trang trủ ('/')

- Hiển thị thông tin tổng quan về cửa hàng.
   ![image](https://github.com/user-attachments/assets/03e6e15b-6a63-4758-aef2-19f996cb68ed).

- Đưa ra các loại món mà cửa hàng đang bán.
  ![image](https://github.com/user-attachments/assets/8b8427fe-5d04-4e45-8094-879fc06af219)

### 2. Đăng nhập, đăng ký 

- Khi ấn nút đăng nhập sẽ hiện ra from nhập email, mật khẩu.
 ![image](https://github.com/user-attachments/assets/2cb31338-6508-4068-af26-9d4e73d13905)

- Đăng nhập thành công sẽ hiện thông báo và có tài khoản để thực hiện việc đặt hàng.
 ![image](https://github.com/user-attachments/assets/67f96227-ba89-4844-a8f3-27bc17166237)

- From đăng ký
  ![image](https://github.com/user-attachments/assets/4311c7e6-4717-4f1e-b481-6025026383b5)

- Khi nhập sai mật khẩu hoặc email sẽ thông báo lỗi
  ![image](https://github.com/user-attachments/assets/047e79c6-059a-4ad2-b717-09ecf05cbff2)
  
- Điều hướng về trang đăng nhập sau khi đăng ký thành công
  ![image](https://github.com/user-attachments/assets/44ac075a-b762-4e66-a39d-aa6321bc5d1c)

### 3. Mục sản phẩm

- Hiển thị danh sách món ăn: Phần tròn là các loại món hiện tại là có 8 loại, dưới là danh sách các món ăn theo tưng loại dưới món ăn là giá tiền từng món, dấu + là để đặt số lượng của món đó có thể tùy chỉnh đặt bao nhiêu khi chọn xong sẽ ấn vào giỏ hàng bên trên cùng để đặt.
 ![image](https://github.com/user-attachments/assets/5f3183f6-b97d-4053-b75a-217ff9dab9ca)
 ![image](https://github.com/user-attachments/assets/886ef279-455e-4cbe-9fe8-5543eec79182)

### 4. Trang giỏ hàng

- Danh sách sản phẩm đã thêm vào giỏ hàng: Sau khi thêm vào giỏ hàng người dùng sẽ xem được chi tiết món đã đặt số lượng nếu đặt nhiều có thể hủy thông qua dấu 'x', khi đã chốt xong ấn vào 'PROCEED TO CHECKOUT' để tiếp tục.
  ![image](https://github.com/user-attachments/assets/7b8892d8-b419-4a4d-bec2-cad28a6b352e)

- Sau khi chọn xong sản phẩm khách hàng nhấn nút đặt hàng: Cần nhập đầy đủ thông tin của khách hàng, nếu đã đăng nhập thì thông tin khách hàng sẽ được tự động điền. Sau khi xác nhận hoàn tất sẽ có thông báo đặt hàng thành công và sẽ trừ số lượng sản phẩm tương ứng ở trong kho hàng.
 ![image](https://github.com/user-attachments/assets/79478107-dced-407c-9403-ddde9fc305d2)
