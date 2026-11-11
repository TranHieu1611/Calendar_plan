# Đưa trang lịch trình lên mạng (khoảng 15 phút, miễn phí)

Trang được đăng bằng GitHub Pages từ kho này, dữ liệu chung lưu trên Firebase.
7 người còn lại **không cần** tài khoản hay cài gì, chỉ cần mở link.

Địa chỉ trang sau khi bật GitHub Pages: **https://tranhieu1611.github.io/Calendar_plan/**

## Bước 1. Tạo dự án Firebase
1. Vào https://console.firebase.google.com, đăng nhập Google, bấm **Create a project** (Tạo dự án).
2. Đặt tên, ví dụ `lich-trinh-doan`. Có thể tắt Google Analytics. Bấm tạo.

## Bước 2. Bật kho dữ liệu Firestore
1. Menu trái: **Build → Firestore Database → Create database**.
2. Chọn vị trí gần Việt Nam, ví dụ `asia-southeast1 (Singapore)`.
3. Chọn **Start in production mode** → **Create**.
4. Mở tab **Rules**, xóa hết nội dung, dán toàn bộ tệp `firestore.rules`.
5. **Ngay trong Firebase Console**, đổi `doi-ma-nay-di` thành mã bí mật của bạn, ví dụ `dalat-8nguoi-k27x`. Bấm **Publish**.
   Không sửa mã này trong tệp `firestore.rules` trên GitHub, vì kho công khai thì ai cũng đọc được.

## Bước 3. Bật đăng nhập ẩn danh
**Build → Authentication → Get started → Sign-in method → Anonymous → Enable → Save.**
(Mọi người không phải đăng nhập gì. Mỗi máy tự nhận một id riêng để ghi vào lịch sử.)

## Bước 4. Lấy cấu hình và dán vào trang
1. Bấm biểu tượng bánh răng → **Project settings** → kéo xuống **Your apps** → bấm biểu tượng web `</>`.
2. Đặt tên app bất kỳ, **không** cần tích Firebase Hosting, bấm **Register app**.
3. Firebase hiện một đoạn `const firebaseConfig = { apiKey: "...", ... }`.
4. Mở `index.html`, tìm dòng `window.FIREBASE_CONFIG = {`, chép 6 giá trị vào đúng chỗ, lưu lại.
   (Cấu hình này để công khai là bình thường. Quyền sửa được giữ bằng mã bí mật ở Bước 2.)
5. Đưa thay đổi lên GitHub:
   ```
   git add index.html
   git commit -m "Thêm cấu hình Firebase"
   git push
   ```
   Hoặc sửa thẳng trên github.com: mở `index.html` → biểu tượng bút chì → dán → **Commit changes**.

## Bước 5. Bật GitHub Pages
1. Trên GitHub, mở kho `Calendar_plan` → **Settings → Pages**.
2. Mục **Build and deployment**: Source chọn **Deploy from a branch**, Branch chọn **main** và thư mục **/ (root)** → **Save**.
3. Đợi 1–2 phút, trang sẽ có ở https://tranhieu1611.github.io/Calendar_plan/
   (Kho phải để **Public** nếu bạn dùng GitHub miễn phí.)
4. Quay lại Firebase: **Authentication → Settings → Authorized domains → Add domain**, thêm `tranhieu1611.github.io`.

## Bước 6. Mở lần đầu và chia sẻ
1. Mở **link sửa** của bạn: `https://tranhieu1611.github.io/Calendar_plan/?ma=<mã bí mật>`.
   Lần đầu, trang tự nạp chuyến mẫu Đà Lạt 3 ngày. Bạn là "chủ trang" vì là người mở đầu tiên.
2. Chọn "Bạn là ai", xem thử, rồi bấm **Xóa dữ liệu mẫu** và **Tạo chuyến đi** để nhập chuyến thật và tên 8 người.
3. Bấm **Chia sẻ** trên trang để sao chép:
   - **Link sửa**: gửi vào nhóm Zalo hoặc Messenger riêng của 8 người. Mỗi người mở link một lần, chọn tên mình là xong. Từ lần sau, mở link thường cũng sửa được.
   - **Link xem**: gửi cho người chỉ cần xem, ví dụ bố mẹ. Họ chỉ xem được, không sửa được.

## Phân quyền: quản trị, người sửa, người xem
- **Quản trị viên (trưởng đoàn):** mở trang, bấm **Nhập mã sửa** và nhập **mã quản trị**. Mỗi trình duyệt chỉ cần nhập một lần. Quản trị viên thấy nút **Yêu cầu sửa** để duyệt hoặc từ chối.
- **Người sửa:** nhập **mã sửa** do trưởng đoàn gửi riêng, hoặc bấm **Xin quyền sửa** rồi chờ trưởng đoàn duyệt. Được duyệt xong, trang tự chuyển sang chế độ sửa.
- **Người xem:** chỉ xem. Gửi **link xem** cho cả đoàn là đủ.
- Hai mã nằm trong luật bảo mật (`editCode` và `adminCode`). Chỉ đổi trong Firebase Console, không sửa mã thật trong tệp trên GitHub.

## Lưu ý
- Ai có link sửa đều thêm, sửa, xóa được, kể cả khi link bị chuyển tiếp cho người ngoài. Nếu link bị lộ: đổi mã trong Rules rồi gửi link mới. Những máy đã vào trước vẫn giữ quyền sửa. Muốn chặn hẳn, xóa các mục trong **Firestore → Data → editors**.
- Tùy chọn "Chỉ người tạo hoạt động hoặc chủ trang mới được sửa" chỉ là chặn trên giao diện.
- Gói miễn phí của Firebase (50.000 lượt đọc, 20.000 lượt ghi mỗi ngày) dư sức cho 8 người.
- Sửa trang sau này: sửa `index.html` rồi push lên GitHub, 1–2 phút sau trang tự cập nhật. Dữ liệu vẫn giữ nguyên.
