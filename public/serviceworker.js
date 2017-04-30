var CACHE_NAME = "gih-cache-v4";
var CACHED_URLS = [
  // Our HTML
  "/index.html",
  // Stylesheets
  "/css/gih.css",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
  "https://fonts.googleapis.com/css?family=Lato:300,600,900",
  // JavaScript
  "https://code.jquery.com/jquery-3.0.0.min.js",
  "/js/app.js",
  // Images
  "/img/logo.png",
  "/img/logo-header.png",
  "/img/event-calendar-link.jpg",
  "/img/switch.png",
  "/img/logo-top-background.png",
  "/img/jumbo-background-sm.jpg",
  "/img/jumbo-background.jpg",
  "/img/reservation-gih.jpg",
  "/img/about-hotel-spa.jpg",
  "/img/about-hotel-luxury.jpg"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});