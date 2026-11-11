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

Tất cả link (thử, trang thật, Firebase Console) nằm trong [dev.config.json](dev.config.json) và được in ra khi chạy lệnh trên.

- `?demo`: dữ liệu giả, vai trò quản trị viên. Mã thử: sửa `sua-thu`, quản trị `quantri-thu`.
- `?demo&as=khach`: dữ liệu giả, vai trò người xem (máy khác). Mở song song hai tab để thử xin quyền và duyệt.
- `?demo&reset`: xóa dữ liệu giả, làm lại từ đầu.
- Không có `?demo`: dữ liệu **thật** của đoàn (cẩn thận).
