# Lịch trình cả đoàn

Web quản lý lịch trình chuyến đi cho nhóm 8 người. Giao diện tiếng Việt, dùng tốt trên điện thoại, dữ liệu chung cập nhật theo thời gian thực.

- `web/`: bản web độc lập dùng Firebase. Ai có link là dùng được, không cần tài khoản. Xem [web/HUONG-DAN.md](web/HUONG-DAN.md) để cài đặt.
- `lich-trinh.html`: bản artifact chạy trên claude.ai (cần tài khoản claude.ai).

Tính năng: xem theo ngày và theo người, thêm/sửa/xóa hoạt động, báo trùng giờ, lịch sử thay đổi có khôi phục, sao chép lịch để dán vào Zalo hoặc Messenger.

> Không đưa mã bí mật thật vào `web/firestore.rules` trong kho này. Chỉ sửa mã đó trong Firebase Console.
