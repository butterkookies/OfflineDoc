// static/sw.js - OfflineDoc Service Worker for 100% Air-Gapped PWA Execution
const CACHE_NAME = "offlinedoc-pwa-v2.1";
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

// Fetch: Network-first with cache fallback for app shell and read-only API calls
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle read-only API endpoints (Patients directory & visits ledger)
  if (url.pathname === "/api/patients" || url.pathname === "/api/visits" || url.pathname.startsWith("/api/patients/") || url.pathname.startsWith("/api/export-pdf/")) {
    if (event.request.method === "GET") {
      event.respondWith(
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        })
      );
      return;
    }
  }

  // Other API calls (POST/DELETE mutations)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "offline", detail: "Server unreachable in offline / airplane mode." }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // App Shell & Static Assets: Network-first, fallback to cache
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
