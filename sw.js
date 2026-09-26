/**
 * Simulador Hídrico Cidadão — Service Worker (Operação Offline Segura)
 *
 * Cache direcionado exclusivamente aos recursos públicos da aplicação.
 * Não inclui arquivos internos, PDFs brutos ou dados privados.
 */

const CACHE_VERSION = "shc-v2.0.3";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./calculos.js",
  "./assets/logo-simulador-hidrico.svg",
  "./assets/vendor/three.module.js",
  "./src/constants.js",
  "./src/mathEngine.js",
  "./src/state.js",
  "./src/charts.js",
  "./src/scene3d.js",
  "./src/router.js",
  "./src/sw-register.js",
  "./src/views/homeView.js",
  "./src/views/simularView.js",
  "./src/views/dashboardView.js",
  "./src/views/cienciaView.js",
  "./src/views/memoriaView.js",
  "./src/views/sobreView.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_VERSION) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Apenas métodos GET são armazenáveis
  if (req.method !== "GET") return;

  // Para navegações de página (SPA), se estiver offline, responde com index.html do cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match("./index.html") || caches.match("./");
      })
    );
    return;
  }

  // Estratégia Stale-While-Revalidate com Cache First para recursos conhecidos
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza cache em background se online
        fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(req, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
