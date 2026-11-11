# Lịch trình cả đoàn

Web quản lý lịch trình chuyến đi cho nhóm 8 người. Giao diện tiếng Việt, dùng tốt trên điện thoại, dữ liệu chung cập nhật theo thời gian thực.

Trang: https://tranhieu1611.github.io/Calendar_plan/ (sau khi bật GitHub Pages)

- `index.html`: trang web, dữ liệu lưu trên Firebase. Ai có link là dùng được, không cần tài khoản. Xem [HUONG-DAN.md](HUONG-DAN.md) để cài đặt.
- `firestore.rules`: luật bảo mật dán vào Firebase.
- `lich-trinh.html`: bản artifact chạy trên claude.ai (cần tài khoản claude.ai).

Tính năng: xem theo ngày và theo người, thêm/sửa/xóa hoạt động, báo trùng giờ, lịch sử thay đổi có khôi phục, sao chép lịch để dán vào Zalo hoặc Messenger.

> Không đưa mã bí mật thật vào `firestore.rules` trong kho này. Chỉ sửa mã đó trong Firebase Console.

## Thử trên máy trước khi đẩy lên

```
node dev-server.js
```

- http://localhost:5500/?demo : dữ liệu giả, chỉ lưu trên trình duyệt của bạn. Thêm, sửa, xóa thoải mái.
- http://localhost:5500/?demo&reset : xóa dữ liệu giả, nạp lại chuyến mẫu.
- http://localhost:5500/ : dữ liệu **thật** của đoàn (cẩn thận).
