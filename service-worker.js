const CACHE_NAME = "todo-app-v3";

const ASSETS = [
  "/My_task_app/",
  "/My_task_app/index.html",
  "/My_task_app/style.css",
  "/My_task_app/main.js",
  "/My_task_app/manifest.json",
  "/My_task_app/icons/icon-192.png",
  "/My_task_app/icons/icon-512.png"
];


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
