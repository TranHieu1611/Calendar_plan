// Máy chủ thử trên máy: chạy `node dev-server.js` rồi mở link in ra.
// Không cần cài thêm gì, chỉ cần Node.js.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5500;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || p.split("/").some(s => s.startsWith("."))) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Không tìm thấy"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("  Thử với dữ liệu giả (an toàn):  http://localhost:" + PORT + "/?demo");
  console.log("  Xóa dữ liệu giả, làm lại từ đầu: http://localhost:" + PORT + "/?demo&reset");
  console.log("  Dữ liệu THẬT của đoàn:           http://localhost:" + PORT + "/   (cẩn thận, thay đổi là thật)");
  console.log("");
  console.log("  Nhấn Ctrl+C để dừng.");
});
