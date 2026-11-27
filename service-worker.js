const CACHE_NAME = "tarifklar-shell-v16";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/vergleich.css",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/tarifklar-icon.svg",
  "/apple-touch-icon.png",
  "/strom-check.html",
  "/feedback.html",
  "/feedback-admin.html",
  "/consent.js",
  "/strom.html",
  "/gas.html",
  "/kfz.html",
  "/kfz-wechsel-2026.html",
  "/motorrad.html",
  "/reisen.html",
  "/c24bank.html",
  "/affiliate-hinweis.html",
  "/impressum.html",
  "/datenschutz.html",
  "/script.js"
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const responsePromise = fetch(request);
    const cachePromise = responsePromise.then(response => {
      if (!response.ok) return;
      return caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    });
    event.waitUntil(cachePromise);
    event.respondWith(
      responsePromise.catch(async () =>
        (await caches.match(request, { ignoreSearch: true })) ||
        (await caches.match(new URL(request.url).pathname)) ||
        (await caches.match("/index.html"))
      )
    );
    return;
  }

  const responsePromise = caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request);
  });
  const cachePromise = responsePromise.then(response => {
    if (!response || !response.ok || response.type === "opaque") return;
    return caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
  });
  event.waitUntil(cachePromise);
  event.respondWith(responsePromise);
});
