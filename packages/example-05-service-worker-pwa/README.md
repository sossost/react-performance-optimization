# 예제 5: Service Worker 캐싱

## 목적

Service Worker를 통한 캐싱 전략 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

Before와 After를 별도 프로젝트로 분리하여 명확하게 비교할 수 있습니다.

- **`before/`**: Service Worker 없음 (네트워크 요청만 사용, 캐싱 없음)
- **`after/`**: Service Worker 적용 (캐싱 전략으로 성능 개선, 오프라인 지원)

---

## 📚 이론: Service Worker 캐싱 원리와 전략

### 1. 개요 (Overview)

**Service Worker**는 브라우저와 네트워크 사이의 프록시 서버 역할을 하는 JavaScript 워커입니다. 이를 통해 네트워크 요청을 가로채고 캐싱 전략을 구현하여 성능 개선과 오프라인 지원을 달성할 수 있습니다.

**핵심 목적:**

- 정적 리소스 캐싱으로 재방문 시 빠른 로딩
- 네트워크 요청 감소로 성능 개선
- 오프라인 환경에서도 기본 기능 사용 가능

### 2. 문제 상황: 네트워크 의존성

#### ❌ Bad Case: 네트워크 요청만 사용

```javascript
// 네트워크가 없으면 앱이 작동하지 않음
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => {
    // 데이터 표시
  })
  .catch((error) => {
    // 네트워크 오류 시 아무것도 할 수 없음
  });
```

**문제점:**

- 네트워크가 없으면 앱이 완전히 작동하지 않음
- 매번 서버에서 리소스를 다운로드 (캐싱 없음)
- 느린 네트워크 환경에서 사용자 경험 저하
- 오프라인 상태에서 앱 사용 불가

### 3. Service Worker 기본 개념

#### 3.1. Service Worker란?

Service Worker는 브라우저 백그라운드에서 실행되는 JavaScript 워커입니다.

**특징:**

- 메인 스레드와 분리되어 실행 (논블로킹)
- 네트워크 요청을 가로채서 처리 가능
- 브라우저가 종료되어도 실행 가능 (백그라운드)
- HTTPS 환경에서만 작동 (localhost 예외)

#### 3.2. Service Worker 생명주기

```
1. 등록 (Registration)
   └─ navigator.serviceWorker.register()

2. 설치 (Install)
   └─ install 이벤트에서 캐시 생성

3. 활성화 (Activate)
   └─ activate 이벤트에서 이전 캐시 정리

4. 가로채기 (Intercept)
   └─ fetch 이벤트에서 네트워크 요청 처리
```

### 4. 캐싱 전략

#### 4.1. Cache First (캐시 우선)

캐시를 먼저 확인하고, 없으면 네트워크에서 가져옵니다.

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 캐시에 있으면 캐시 반환
      if (cachedResponse) {
        return cachedResponse;
      }
      // 없으면 네트워크에서 가져오고 캐시에 저장
      return fetch(event.request).then((response) => {
        const responseToCache = response.clone();
        caches.open("cache-v1").then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

**사용 사례:**

- 정적 리소스 (이미지, CSS, JS)
- 자주 변경되지 않는 데이터
- 오프라인에서도 반드시 필요한 리소스

**장점:**

- 오프라인에서도 작동
- 빠른 응답 시간

**단점:**

- 업데이트된 리소스를 받기 어려움
- 캐시 무효화 필요

#### 4.2. Network First (네트워크 우선)

네트워크를 먼저 시도하고, 실패하면 캐시를 사용합니다.

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크 성공 시 캐시에 저장
        const responseToCache = response.clone();
        caches.open("cache-v1").then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시 사용
        return caches.match(event.request);
      })
  );
});
```

**사용 사례:**

- 자주 업데이트되는 데이터 (API 응답)
- 실시간성이 중요한 리소스

**장점:**

- 항상 최신 데이터 제공
- 네트워크 실패 시 캐시로 폴백

**단점:**

- 느린 네트워크에서 지연 발생 가능

#### 4.3. Stale While Revalidate (오래된 캐시 사용 + 백그라운드 업데이트)

캐시를 즉시 반환하고, 백그라운드에서 네트워크로 업데이트합니다.

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("cache-v1").then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // 백그라운드에서 네트워크 요청 (캐시 업데이트)
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 캐시가 있으면 즉시 반환, 없으면 네트워크 대기
        return cachedResponse || fetchPromise;
      });
    })
  );
});
```

**사용 사례:**

- 빠른 응답이 필요하지만 최신 데이터도 원하는 경우
- 뉴스 피드, 소셜 미디어 타임라인

**장점:**

- 빠른 응답 (캐시 사용)
- 백그라운드에서 자동 업데이트

### 5. PWA (참고)

**참고:** Service Worker는 PWA(Progressive Web App)의 핵심 구성 요소이지만, 이 예제는 Service Worker의 캐싱 기능에 초점을 맞춥니다.

PWA는 Service Worker + Web App Manifest를 통해 웹 서비스를 앱처럼 사용할 수 있게 하는 기술입니다. 이 예제에서는 Service Worker의 캐싱 전략을 통한 성능 개선에 집중합니다.

### 6. 주의사항

#### 6.1. 캐시 무효화

캐시 버전을 관리하여 오래된 리소스를 제거해야 합니다.

```javascript
const CACHE_NAME = "cache-v1";
const urlsToCache = ["/", "/styles.css", "/script.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 이전 버전 캐시 삭제
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 6.2. HTTPS 필수

Service Worker는 HTTPS 환경에서만 작동합니다 (localhost 예외).

#### 6.3. 캐시 크기 제한

브라우저마다 캐시 크기 제한이 있으므로 주의해야 합니다.

#### 6.4. 개발 환경에서의 캐시 문제

**문제:** Service Worker가 등록되면 같은 포트의 다른 프로젝트를 열었을 때 이전 프로젝트의 캐시가 남아있을 수 있습니다.

**원인:**

- Service Worker 캐시는 브라우저가 자동으로 삭제하지 않음
- 같은 포트(`localhost:5178`)를 사용하면 Service Worker가 계속 활성화됨
- 캐시는 수동으로 삭제하거나 Service Worker가 업데이트될 때만 삭제됨

**해결 방법:**

1. **개발자 도구에서 수동 삭제 (권장)**

   - 개발자 도구 > Application 탭
   - Service Workers 섹션에서 "Unregister" 클릭
   - Cache Storage 섹션에서 캐시 삭제

2. **브라우저 캐시 초기화**

   - 개발자 도구 > Application 탭 > Clear storage
   - 또는 브라우저 설정에서 캐시 삭제

3. **다른 포트 사용**

   - 각 예제 프로젝트를 다른 포트로 실행
   - 예: 예제 5는 5178, 예제 6은 5179

4. **시크릿 모드 사용**
   - 시크릿 모드에서는 Service Worker가 탭을 닫으면 자동으로 삭제됨

**참고:** 프로덕션 환경에서는 Service Worker 버전을 변경하면 자동으로 이전 캐시가 삭제됩니다.

#### 6.5. 프로덕션 배포 시 캐시 업데이트

**방법:** Service Worker 파일이 변경되면 브라우저가 자동으로 새 버전을 감지하고 업데이트합니다.

```javascript
// 배포 시마다 CACHE_NAME 버전 업데이트
const CACHE_NAME = "cache-v2"; // v1 → v2로 변경

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 이전 버전 캐시 삭제 (cache-v1 등)
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**작동 원리:**

1. **새 배포 시:** Service Worker 파일이 변경되면 브라우저가 새 버전을 감지
2. **설치:** 새 Service Worker가 백그라운드에서 설치됨
3. **활성화:** `activate` 이벤트에서 이전 캐시(`cache-v1`) 삭제
4. **새 캐시 생성:** 새 리소스가 `cache-v2`에 캐싱됨

**주의사항:**

- Service Worker 파일이 변경되지 않으면 업데이트되지 않음
- 파일 내용이 조금이라도 변경되어야 새 버전으로 인식됨
- 빌드 시 해시를 추가하거나 버전 번호를 변경하는 것이 좋음

**실무 권장사항:**

```javascript
// 빌드 시 자동으로 버전 생성
const CACHE_NAME = `cache-${process.env.BUILD_VERSION || Date.now()}`;
// 또는
const CACHE_NAME = `cache-${BUILD_HASH}`;
```

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

### Before (최적화 전)

```bash
# 루트에서 실행
yarn dev:e5:before
# 접속: http://localhost:5177

```

- Service Worker 없음
- 네트워크 요청만 사용
- 오프라인 상태에서 작동하지 않음
- 매번 서버에서 리소스 다운로드

### After (최적화 후)

```bash
# 루트에서 실행
yarn dev:e5:after
# 접속: http://localhost:5178

```

- Service Worker 등록 및 캐싱 전략 적용
- 정적 리소스 캐싱으로 재방문 시 빠른 로딩
- 오프라인 지원

---

## 측정 방법

### 1. Network 탭 분석 (캐싱 확인)

1. 크롬 개발자 도구 > **Network** 탭 클릭
2. **"Disable cache"** 체크 해제 (캐시 활성화)
3. 첫 로드 후 새로고침

**예상 결과:**

- **Before:** 모든 리소스가 네트워크에서 로드됨
- **After:** 두 번째 로드부터 캐시에서 로드됨 (Size 컬럼에 "disk cache" 또는 "memory cache" 표시)

### 2. Application 탭 확인

1. 개발자 도구 > **Application** 탭
2. **Service Workers** 섹션에서 등록 상태 확인
3. **Cache Storage** 섹션에서 캐시된 리소스 확인

**확인 사항:**

- Service Worker가 등록되어 있는가?
- 캐시에 어떤 리소스가 저장되어 있는가?
- 캐시 버전이 올바른가?

### 3. 오프라인 테스트

1. 개발자 도구 > **Network** 탭
2. **Throttling** 드롭다운에서 **"Offline"** 선택
3. 페이지 새로고침

**예상 결과:**

- **Before:** 페이지가 로드되지 않음 (네트워크 오류)
- **After:** 캐시된 리소스로 페이지가 정상 작동

### 4. Lighthouse 측정

1. 개발자 도구 > **Lighthouse** 탭
2. **Navigation** 모드 > **Analyze page load** 클릭

**주요 확인 지표:**

- **성능 점수:** 캐싱으로 인해 재방문 시 로딩 시간이 단축되었는가?
- **캐시 활용:** 정적 리소스가 캐시에서 로드되는가?

---

## 주요 코드 변경점

### Service Worker 등록 (`main.tsx` 또는 `App.tsx`)

```tsx
// Before
// Service Worker 없음

// After
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker 등록 성공:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker 등록 실패:", error);
      });
  });
}
```

### Service Worker 파일 (`public/service-worker.js`)

```javascript
// Cache First 전략 예시
const CACHE_NAME = "cache-v1";
const urlsToCache = ["/", "/styles.css", "/script.js", "/images/logo.png"];

// 설치 시 캐시 생성
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 활성화 시 이전 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 가로채기
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
```

---

## 📚 참고 자료 (References)

**Service Worker 가이드**

- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Service Worker API 완벽 가이드
- [Web.dev: Service Workers](https://web.dev/service-workers-cache-storage/) - Service Worker와 캐싱 전략
- [Google Developers: Caching Strategies](https://developers.google.com/web/tools/workbox/guides/cache-strategies) - 다양한 캐싱 전략 비교

**PWA (참고)**

- [Web.dev: Progressive Web Apps](https://web.dev/progressive-web-apps/) - PWA 완벽 가이드 (Service Worker + Manifest)

**도구 및 라이브러리**

- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker 생성을 위한 라이브러리
- [PWA Builder](https://www.pwabuilder.com/) - PWA 생성 및 검증 도구
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/) - PWA 점수 측정

**브라우저 호환성**

- [Can I Use: Service Workers](https://caniuse.com/serviceworkers) - Service Worker 브라우저 호환성
