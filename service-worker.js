// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
  // ¨Pre-cache everything from React app to make it available offline
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "/",
        "/map",
        "/account",
        "/capture",
        "/battle",
        "/pokedex",
        "/garden",
        "/index.html",
        "/offline.html",
        "/logo.png",
        "/logo192.png",
        "/logo512.png",
        "/opening.mp3",
        "/pokemonbg.mp4",
        "/manifest.json",
        "/static/js/bundle.js",
        "/static/js/0.chunk.js",
        "/static/js/main.chunk.js",
        "/favicon.ico",
        "/static/js/vendors~main.chunk.js",
        "/static/js/vendors~main.chunk.js.LICENSE.txt",
      ]);
    })
  );
  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", async function (event) {
  event.respondWith(
    // Caches every request to make it available offline
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Push notification
// eslint-disable-next-line no-restricted-globals
self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  // Title and body are the same, i want to see the body instead of the website origin in the notification
  const title = "Pokemon";
  const options = {
    body: event.data.text(),
    icon: "logo.png",
    badge: "logo.png",
  };

  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.registration.showNotification(title, options));
});
