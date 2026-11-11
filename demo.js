/* Chế độ thử (?demo): giả lập Firebase ngay trong trình duyệt.
   Dữ liệu chỉ nằm trên máy này (localStorage), không đụng tới dữ liệu thật của đoàn.
   Mỗi mục lưu một khóa riêng, nên nhiều tab thử cùng ghi không đè mất dữ liệu của nhau. */
(function () {
  "use strict";
  var PRE = "lt-demo:";
  var store = new Map();
  var ls = null;
  try { ls = window.localStorage; } catch (_) {}
  function lsKeys() { var out = []; if (!ls) return out; for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && k.indexOf(PRE) === 0) out.push(k); } return out; }
  try {
    if (/[?&]reset\b/.test(location.search)) {
      lsKeys().forEach(function (k) { ls.removeItem(k); });
      history.replaceState(null, "", location.pathname + location.search.replace(/&reset\b/, "") + location.hash);
    }
    lsKeys().forEach(function (k) { store.set(k.slice(PRE.length), JSON.parse(ls.getItem(k))); });
  } catch (_) {}

  var clone = function (o) { return o == null ? o : JSON.parse(JSON.stringify(o)); };
  var rid = function () { return Math.random().toString(36).slice(2, 12); };
  function put(p, d) { store.set(p, clone(d)); try { ls && ls.setItem(PRE + p, JSON.stringify(d)); } catch (_) {} }
  function del(p) { store.delete(p); try { ls && ls.removeItem(PRE + p); } catch (_) {} }

  /* Vai trò thử: ?demo = quản trị viên; ?demo&as=khach = người xem (máy khác) */
  var asMatch = /[?&]as=([A-Za-z0-9_-]{1,20})/.exec(location.search);
  var uid = asMatch ? "demo-" + asMatch[1] : "demo-admin";
  var CODES = { edit: "sua-thu", admin: "quantri-thu" };
  window.LT_DEMO_CODES = CODES;
  if (!asMatch && !store.has("admins/demo-admin")) put("admins/demo-admin", { code: CODES.admin, at: Date.now() });

  function deny() { var e = new Error("permission-denied"); e.code = "permission-denied"; return Promise.reject(e); }
  /* Giả lập phần luật bảo mật liên quan tới mã */
  function allowed(p, d) {
    var parts = p.split("/");
    if (parts[0] === "admins") return parts[1] === uid && d.code === CODES.admin && !store.has(p);
    if (parts[0] === "editors") {
      if (d.approvedBy) return store.has("admins/" + uid);
      return parts[1] === uid && d.code === CODES.edit && !store.has(p);
    }
    return true;
  }

  var listeners = new Set();
  function changed() { setTimeout(function () { listeners.forEach(function (f) { f(); }); }, 30); }
  function snapDoc(p) {
    var d = store.get(p);
    return { id: p.split("/").pop(), exists: d !== undefined, data: function () { return clone(d); }, metadata: { fromCache: false, hasPendingWrites: false } };
  }
  function docRef(p) {
    return {
      id: p.split("/").pop(), path: p,
      get: function () { return Promise.resolve(snapDoc(p)); },
      set: function (d) { if (!allowed(p, d || {})) return deny(); put(p, d); changed(); return Promise.resolve(); },
      update: function (d) { put(p, Object.assign({}, store.get(p), clone(d))); changed(); return Promise.resolve(); },
      delete: function () { del(p); changed(); return Promise.resolve(); },
      onSnapshot: function (cb) { var f = function () { cb(snapDoc(p)); }; listeners.add(f); setTimeout(f, 60); return function () { listeners.delete(f); }; }
    };
  }
  function query(col, ord, lim) {
    var depth = col.split("/").length + 1;
    function build() {
      var docs = [];
      store.forEach(function (_, k) { if (k.indexOf(col + "/") === 0 && k.split("/").length === depth) docs.push(snapDoc(k)); });
      if (ord) docs.sort(function (a, b) { var x = a.data()[ord.f], y = b.data()[ord.f]; return (x < y ? -1 : x > y ? 1 : 0) * (ord.dir === "desc" ? -1 : 1); });
      if (lim) docs = docs.slice(0, lim);
      return { docs: docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false } };
    }
    return {
      orderBy: function (f, dir) { return query(col, { f: f, dir: dir }, lim); },
      limit: function (n) { return query(col, ord, n); },
      doc: function (id) { return docRef(col + "/" + (id || rid())); },
      add: function (d) { var r = docRef(col + "/" + rid()); return r.set(d).then(function () { return r; }); },
      get: function () { return Promise.resolve(build()); },
      onSnapshot: function (cb) { var f = function () { cb(build()); }; listeners.add(f); setTimeout(f, 60); return function () { listeners.delete(f); }; }
    };
  }
  var db = {
    doc: docRef,
    collection: function (c) { return query(c); },
    enablePersistence: function () { return Promise.resolve(); },
    batch: function () {
      var ops = [];
      return { set: function (r, d) { ops.push(function () { put(r.path, d); }); }, commit: function () { ops.forEach(function (f) { f(); }); changed(); return Promise.resolve(); } };
    }
  };
  /* Đồng bộ giữa các tab đang mở chế độ thử */
  window.addEventListener("storage", function (e) {
    if (e.key === null) { store.clear(); changed(); return; }
    if (e.key.indexOf(PRE) !== 0) return;
    var p = e.key.slice(PRE.length);
    try { if (e.newValue == null) store.delete(p); else store.set(p, JSON.parse(e.newValue)); } catch (_) {}
    changed();
  });
  var user = { uid: uid };
  window.firebase = {
    initializeApp: function () {},
    firestore: function () { return db; },
    auth: function () {
      return {
        onAuthStateChanged: function (cb) { setTimeout(function () { cb(user); }); return function () {}; },
        signInAnonymously: function () { return Promise.resolve({ user: user }); }
      };
    }
  };
  window.LT_DEMO = true;
})();
