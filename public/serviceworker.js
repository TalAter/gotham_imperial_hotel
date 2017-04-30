var CACHE_NAME = "gih-cache-v5";
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
  "/js/offline-map.js",
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
  "/img/about-hotel-luxury.jpg",
  "/img/event-default.jpg",
  "/img/map-offline.jpg",
  // JSON
  "/events.json"
];
var googleMapsAPIJS = "https://maps.googleapis.com/maps/api/js?key="+
  "AIzaSyDm9jndhfbcWByQnrivoaWAEQA8jy3COdE&callback=initMap";

self.addEventListener("install", function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  // Handle requests for index.html
  if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match("/index.html").then(function(cachedResponse) {
          var fetchPromise = fetch("/index.html").then(function(networkResponse) {
            cache.put("/index.html", networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+"&"+Date.now(),
        { mode: "no-cors", cache: "no-store" }
      ).catch(function() {
        return caches.match("/js/offline-map.js");
      })
    );
  // Handle requests for events JSON file
  } else if (requestURL.pathname === "/events.json") {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  // Handle requests for event images.
  } else if (requestURL.pathname.startsWith("/img/event-")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match("/img/event-default.jpg");
          });
        });
      })
    );
  // Handle analytics requests
  } else if (requestURL.host === "www.google-analytics.com") {
    event.respondWith(fetch(event.request));
  // Handle requests for files cached during installation
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
      })
    );
  }
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