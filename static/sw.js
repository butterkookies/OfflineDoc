// static/sw.js - OfflineDoc Service Worker for 100% Air-Gapped PWA Execution
const CACHE_NAME = "offlinedoc-pwa-v1.6";
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/OfflineDoc-logo.jpg",
  "/test_taglish.mp3"
];

// Install: Pre-cache core app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[OfflineDoc SW] Pre-caching app shell assets...");
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for app shell/static assets (always pick up the latest
// code after a git pull while the laptop is reachable), cache fallback when offline.
// API calls go to the network with an offline JSON fallback.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "offline", message: "Edge server is temporarily unreachable in air-gapped mode." }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
      }
      return networkResponse;
    }).catch(() => caches.match(event.request))
  );
});
