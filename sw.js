const CACHE = "keeper-v3";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("/api/")) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const clone = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
