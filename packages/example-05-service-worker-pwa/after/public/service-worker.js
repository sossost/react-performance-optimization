// ✅ After: Service Worker 캐싱 전략
// Cache First 전략 사용

const CACHE_NAME = "cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
  "/images/hero.jpg",
];

// 설치 시 캐시 생성
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시 생성:", CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
  // 새 Service Worker가 즉시 활성화되도록 강제
  self.skipWaiting();
});

// 활성화 시 이전 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("이전 캐시 삭제:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 모든 클라이언트에 즉시 제어권 부여
  return self.clients.claim();
});

// 네트워크 요청 가로채기 (Cache First 전략)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 캐시에 있으면 캐시 반환
      if (cachedResponse) {
        return cachedResponse;
      }
      // 없으면 네트워크에서 가져오고 캐시에 저장
      return fetch(event.request).then((response) => {
        // 유효한 응답만 캐시
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

