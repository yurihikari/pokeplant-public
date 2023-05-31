// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", async (event) => {
  try {
    const cache = await caches.open("static");
    console.log("Opened cache");

    const response = await fetch("asset-manifest.json");
    console.log("Fetched assets");

    if (!response.ok) {
      throw new Error("Failed to fetch assets");
    }

    const assets = await response.json();
    console.log("Converted to JSON", assets);

    const entrypoints = assets.entrypoints;
    // Should be an array of strings
    console.log("entrypoints", entrypoints);
    // Should be an object with keys as strings and values (path) as strings
    const files = assets.files;
    console.log("files", files);
    let urlsToCache = [
      "/",
      "/map",
      "/account",
      "/capture",
      "/battle",
      "/pokedex",
      "/garden",
      "/index.html",
      "/offline.html",
      "/manifest.json",
      "/favicon.ico",
    ];
    urlsToCache = urlsToCache.concat(Object.values(files));
    // For entrypoints, we add to the UrlsToCache each string inside the array
    entrypoints.forEach((entrypoint) => {
      urlsToCache.push(entrypoint);
    });

    console.log("urlsToCache", urlsToCache);

    await Promise.all(
      urlsToCache.map(async (url) => {
        const request = new Request(url);
        const response = await fetch(request);

        if (!response.ok) {
          throw new Error(`Failed to fetch "${url}"`);
        }

        await cache.put(request, response.clone());
      })
    );

    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
    console.log("All assets cached successfully!");
  } catch (error) {
    console.error("Caching failed:", error);
  }
});

// self.addEventListener("install", async (event) => {
//   const cache = await caches.open("static");
//   console.log("Opened cache");
//   const response = await fetch("asset-manifest.json");
//   console.log("Fetched assets");
//   const assets = await response.json();
//   console.log("Converted to json", assets);

//   const urlsToCache = Object.values(assets).concat([
//     "/",
//     "/index.html",
//     "/offline.html",
//     "/manifest.json",
//     "/favicon.ico",
//   ]);
//   // @ts-ignore
//   await cache.addAll(urlsToCache);

//   // eslint-disable-next-line no-restricted-globals
//   self.skipWaiting();
// });

// self.addEventListener("install", (event) => {
//   // ¨Pre-cache everything from React app production mode to make it available offline
//   event.waitUntil(
//     caches.open("static").then((cache) => {
//       return cache.addAll([
//         "/",
//         "/map",
//         "/account",
//         "/capture",
//         "/battle",
//         "/pokedex",
//         "/garden",
//         "/index.html",
//         "/offline.html",
//         "/logo.png",
//         "/logo192.png",
//         "/logo512.png",
//         "/opening.mp3",
//         "/pokemonbg.mp4",
//         "/manifest.json",
//         "/static/js/bundle.js",
//         "/static/js/0.chunk.js",
//         "/static/js/main.chunk.js",
//         "/favicon.ico",
//         "/static/js/vendors~main.chunk.js",
//         "/static/js/vendors~main.chunk.js.LICENSE.txt",
//       ]);
//     })
//   );
//   // eslint-disable-next-line no-restricted-globals
//   self.skipWaiting();
// });

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
