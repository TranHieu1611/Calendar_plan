// Máy chủ thử trên máy: chạy `node dev-server.js` rồi mở link in ra.
// Không cần cài thêm gì, chỉ cần Node.js.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
let CONFIG = { port: 5500, links: {} };
try { CONFIG = Object.assign(CONFIG, JSON.parse(fs.readFileSync(path.join(ROOT, "dev.config.json"), "utf8"))); }
catch (e) { console.warn("Không đọc được dev.config.json, dùng cổng 5500."); }
const PORT = Number(process.env.PORT) || Number(CONFIG.port) || 5500;
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
  console.log("  Các link (sửa trong dev.config.json):");
  const names = Object.keys(CONFIG.links || {});
  const w = Math.max(0, ...names.map(n => n.length));
  names.forEach(n => console.log("  " + n.padEnd(w) + "  " + CONFIG.links[n]));
  console.log("");
  console.log("  Nhấn Ctrl+C để dừng.");
});
