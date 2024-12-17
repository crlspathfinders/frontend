// const CACHE_NAME = 'api-cache-v1';

// // Install: Cache static assets (optional, as this focuses on API caching)
// self.addEventListener('install', (event) => {
//   event.waitUntil(self.skipWaiting());
// });

// // Activate: Clean up old caches if needed
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames
//           .filter((cacheName) => cacheName !== CACHE_NAME)
//           .map((cacheName) => caches.delete(cacheName))
//       )
//     )
//   );
//   self.clients.claim();
// });

// // Fetch: Intercept API requests
// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   // Check if the request matches the FastAPI endpoint
//   if (url.pathname.startsWith('/read/')) {
//     event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         if (cachedResponse) {
//           // Return the cached response if available
//           return cachedResponse;
//         }
//         // Fetch the response from the network
//         return fetch(event.request).then((networkResponse) => {
//           // Cache the new response
//           return caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, networkResponse.clone());
//             return networkResponse;
//           });
//         });
//       })
//     );
//   }
// });

// const MAX_AGE = 3600; // Cache duration in seconds

// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   if (url.pathname.startsWith('/read/')) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(async (cache) => {
//         const cachedResponse = await cache.match(event.request);

//         if (cachedResponse) {
//           const dateHeader = cachedResponse.headers.get('date');
//           if (dateHeader) {
//             const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
//             if (age < MAX_AGE) {
//               return cachedResponse; // Return valid cached response
//             }
//           }
//         }

//         // Fetch new data from the network and update the cache
//         return fetch(event.request).then((networkResponse) => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         });
//       })
//     );
//   }
// });
