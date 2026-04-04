const CACHE_VERSION = "v1";
const CACHE_NAME = `bladetools-cache-${CACHE_VERSION}`;
const STATIC_ASSETS = /\.(js|css|woff2|woff|ttf|svg|png|ico|webp)$/;

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(["/"])),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)),
                ),
            ),
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            // cache-first for static assets, they're hashed and immutable
            if (STATIC_ASSETS.test(url.pathname) && cached) {
                return cached;
            }

            // stale-while-revalidate for HTML pages
            const fetchPromise = fetch(request).then((response) => {
                if (response.ok) {
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(request, response.clone()));
                }
                return response;
            });

            return cached ?? fetchPromise;
        }),
    );
});
