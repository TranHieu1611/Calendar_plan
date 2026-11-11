/* Chế độ thử (?demo): giả lập Firebase ngay trong trình duyệt.
   Dữ liệu chỉ nằm trên máy này (localStorage), không đụng tới dữ liệu thật của đoàn. */
(function () {
  "use strict";
  var KEY = "lt-demo-store";
  var store = new Map();
  try {
    if (/[?&]reset\b/.test(location.search)) {
      localStorage.removeItem(KEY);
      history.replaceState(null, "", location.pathname + "?demo" + location.hash);
    }
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) Object.keys(saved).forEach(function (k) { store.set(k, saved[k]); });
  } catch (_) {}
  store.set("editors/demo-user", { code: "demo" });

  var listeners = new Set();
  var clone = function (o) { return o == null ? o : JSON.parse(JSON.stringify(o)); };
  var rid = function () { return Math.random().toString(36).slice(2, 12); };
  function persist() { try { var o = {}; store.forEach(function (v, k) { o[k] = v; }); localStorage.setItem(KEY, JSON.stringify(o)); } catch (_) {} }
  function changed() { persist(); setTimeout(function () { listeners.forEach(function (f) { f(); }); }, 30); }
  function snapDoc(p) {
    var d = store.get(p);
    return { id: p.split("/").pop(), exists: d !== undefined, data: function () { return clone(d); }, metadata: { fromCache: false, hasPendingWrites: false } };
  }
  function docRef(p) {
    return {
      id: p.split("/").pop(), path: p,
      get: function () { return Promise.resolve(snapDoc(p)); },
      set: function (d) { store.set(p, clone(d)); changed(); return Promise.resolve(); },
      update: function (d) { store.set(p, Object.assign({}, store.get(p), clone(d))); changed(); return Promise.resolve(); },
      delete: function () { store.delete(p); changed(); return Promise.resolve(); },
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
      return { set: function (r, d) { ops.push(function () { store.set(r.path, clone(d)); }); }, commit: function () { ops.forEach(function (f) { f(); }); changed(); return Promise.resolve(); } };
    }
  };
  var user = { uid: "demo-user" };
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
