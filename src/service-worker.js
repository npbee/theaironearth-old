/* global workbox, importScripts */

// import { timestamp, files, shell } from "@sapper/service-worker";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

// const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
// const to_cache = shell.concat(files);
// const cached = new Set(to_cache);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

workbox.routing.registerRoute(
  /^https:\/\/use\.typekit\.net\/(?:.*)\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

/**
 * Cache underling typekit fonts with a cache-first strategy for 1 year
 */
workbox.routing.registerRoute(
  /^https:\/\/use\.typekit\.net\/af/,
  new workbox.strategies.CacheFirst({
    cacheName: "typekit-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);
// self.addEventListener("install", event => {
//   event.waitUntil(
//     caches
//       .open(ASSETS)
//       .then(cache => cache.addAll(to_cache))
//       .then(() => {
//         self.skipWaiting();
//       })
//   );
// });

// self.addEventListener("activate", event => {
//   event.waitUntil(
//     caches.keys().then(async keys => {
//       // delete old caches
//       for (const key of keys) {
//         if (key !== ASSETS) await caches.delete(key);
//       }

//       self.clients.claim();
//     })
//   );
// });

// self.addEventListener("fetch", event => {
//   if (event.request.method !== "GET" || event.request.headers.has("range"))
//     return;

//   const url = new URL(event.request.url);

//   // don't try to handle e.g. data: URIs
//   if (!url.protocol.startsWith("http")) return;

//   // ignore dev server requests
//   if (
//     url.hostname === self.location.hostname &&
//     url.port !== self.location.port
//   )
//     return;

//   // always serve static files and bundler-generated assets from cache
//   if (url.host === self.location.host && cached.has(url.pathname)) {
//     event.respondWith(caches.match(event.request));
//     return;
//   }

//   // for pages, you might want to serve a shell `service-worker-index.html` file,
//   // which Sapper has generated for you. It's not right for every
//   // app, but if it's right for yours then uncomment this section
//   /*
// 	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
// 		event.respondWith(caches.match('/service-worker-index.html'));
// 		return;
// 	}
// 	*/

//   if (event.request.cache === "only-if-cached") return;

//   // for everything else, try the network first, falling back to
//   // cache if the user is offline. (If the pages never change, you
//   // might prefer a cache-first approach to a network-first one.)
//   event.respondWith(
//     caches.open(`offline${timestamp}`).then(async cache => {
//       try {
//         const response = await fetch(event.request);
//         cache.put(event.request, response.clone());
//         return response;
//       } catch (err) {
//         const response = await cache.match(event.request);
//         if (response) return response;

//         throw err;
//       }
//     })
//   );
// });
