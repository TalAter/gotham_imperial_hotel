importScripts('/js/reservations-store.js');

var CACHE_NAME = 'gih-cache-v6';
var CACHED_URLS = [
  // Our HTML
  '/index.html',
  '/my-account.html',
  // Stylesheets
  '/css/gih.css',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css?family=Lato:300,600,900',
  // JavaScript
  'https://code.jquery.com/jquery-3.0.0.min.js',
  '/js/app.js',
  '/js/offline-map.js',
  '/js/my-account.js',
  '/js/reservations-store.js',
  // Images
  '/img/logo.png',
  '/img/logo-header.png',
  '/img/event-calendar-link.jpg',
  '/img/logo-top-background.png',
  '/img/jumbo-background.jpg',
  '/img/about-hotel-spa.jpg',
  '/img/about-hotel-luxury.jpg',
  '/img/event-default.jpg',
  '/img/map-offline.jpg',
  // JSON
  '/events.json'
];
var googleMapsAPIJS = 'https://maps.googleapis.com/maps/api/js?key='+
  'AIzaSyDm9jndhfbcWByQnrivoaWAEQA8jy3COdE&callback=initMap';

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  // Handle requests for index.html
  if (requestURL.pathname === '/' || requestURL.pathname === '/index.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('/index.html').then(function(cachedResponse) {
          var fetchPromise = fetch('/index.html').then(function(networkResponse) {
            cache.put('/index.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  // Handle requests for the account page
  } else if (requestURL.pathname === '/my-account' || requestURL.pathname === '/my-account.html') {
    event.respondWith(
      caches.match('/my-account.html').then(function(response) {
        return response || fetch('/my-account.html');
      })
    );
  // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+'&'+Date.now(),
        { mode: 'no-cors', cache: 'no-store' }
      ).catch(function() {
        return caches.match('/js/offline-map.js');
      })
    );
  // Handle requests for events JSON file
  } else if (requestURL.pathname === '/events.json') {
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
  } else if (requestURL.pathname.indexOf('/img/event-') === 0) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match('/img/event-default.jpg');
          });
        });
      })
    );
  // Handle analytics requests
  } else if (requestURL.host === 'www.google-analytics.com') {
    event.respondWith(fetch(event.request));
  // Handle requests for files cached during installation
  } else if (
    CACHED_URLS.indexOf(requestURL.href) === -1 ||
    CACHED_URLS.indexOf(requestURL.pathname) === -1
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

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

var syncReservations = function() {
  return getReservations('idx_status', 'Sending').then(function(reservations) {
    return Promise.all(
      reservations.map(function(reservation) {
        var makeReservationUrl = new URL('http://localhost:8443/make-reservation');
        Object.keys(reservation).forEach(function(key) {
          makeReservationUrl.searchParams.append(key, reservation[key]);
        });
        return fetch(makeReservationUrl).then(function(response) {
          return response.json().then(function(newReservation) {
            return updateInObjectStore('reservations', newReservation.id, newReservation);
          });
        });
      })
    );
  });
};

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-reservations') {
    event.waitUntil(syncReservations());
  }
});
