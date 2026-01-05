# 예제 7: 데이터 캐싱 전략

## 목적

데이터 캐싱 전략 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

하나의 프로젝트에서 Before/After를 토글로 전환하여 비교할 수 있습니다.

- **Before 모드**: 캐싱 없음 (매번 API 호출)
- **After 모드**: 캐싱 전략 적용 (메모리 캐싱, TTL, 캐시 무효화)

---

## 📚 이론: 데이터 캐싱 전략 원리와 전략

### 1. 개요 (Overview)

**데이터 캐싱**은 API 응답을 메모리에 저장하여 동일한 요청 시 네트워크 호출 없이 캐시에서 반환하는 최적화 기법입니다. 이를 통해 네트워크 요청을 줄이고 응답 시간을 단축할 수 있습니다.

### 2. 문제 상황: 중복 API 호출

#### ❌ Bad Case: 매번 API 호출

```typescript
// 같은 데이터를 여러 번 요청
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser); // 매번 네트워크 요청
  }, [userId]);
}

// 다른 컴포넌트에서도 같은 데이터 요청
function UserAvatar({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser); // 또 네트워크 요청
  }, [userId]);
}
```

**문제점:**

- 같은 데이터를 여러 번 요청
- 불필요한 네트워크 트래픽
- 서버 부하 증가
- 사용자 경험 저하 (로딩 시간)

### 3. 캐싱 전략

#### 3.1. 메모리 캐싱 (Memory Caching)

API 응답을 메모리에 저장하여 재사용합니다.

```typescript
// ✅ After: 메모리 캐싱
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchUserCached(userId: number) {
  const cacheKey = `user-${userId}`;
  const cached = cache.get(cacheKey);

  // 캐시가 있고 유효하면 캐시 반환
  if (cached && Date.now() - cached.timestamp < 60000) {
    // 60초 이내면 캐시 사용
    return cached.data;
  }

  // 캐시가 없거나 만료되었으면 네트워크 요청
  const data = await fetchUser(userId);
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}
```

**효과:**

- 네트워크 요청 감소
- 응답 시간 단축 (캐시 히트 시 즉시 반환)
- 서버 부하 감소

**사용 사례:**

- 자주 조회되는 데이터
- 자주 변경되지 않는 데이터
- 사용자 정보, 설정 등

**추상화 라이브러리:**

- **React Query**: 자동 메모리 캐싱 (기본 기능)
- **SWR**: 자동 메모리 캐싱 및 재검증 (기본 기능)
- **Apollo Client**: GraphQL 쿼리 자동 캐싱

#### 3.2. TTL (Time To Live)

캐시의 유효 기간을 설정하여 오래된 데이터를 자동으로 무효화합니다.

```typescript
// ✅ After: TTL 적용
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time To Live (밀리초)
}

const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // TTL 확인
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key); // 만료된 캐시 삭제
    return null;
  }

  return entry.data;
}

function setCached<T>(key: string, data: T, ttl: number = 60000) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}
```

**효과:**

- 오래된 데이터 자동 무효화
- 캐시 크기 관리
- 데이터 일관성 유지

**TTL 선택 가이드:**

- **짧은 TTL (1-5분)**: 자주 변경되는 데이터 (뉴스 피드, 실시간 데이터)
- **중간 TTL (5-30분)**: 가끔 변경되는 데이터 (사용자 프로필, 설정)
- **긴 TTL (30분-24시간)**: 거의 변경되지 않는 데이터 (정적 데이터, 설정)

#### 3.3. 캐시 무효화 (Cache Invalidation)

특정 조건에서 캐시를 수동으로 삭제합니다.

```typescript
// ✅ After: 캐시 무효화
const cache = new Map<string, CacheEntry<any>>();

// 특정 키의 캐시 삭제
function invalidateCache(key: string) {
  cache.delete(key);
}

// 패턴으로 여러 캐시 삭제
function invalidateCachePattern(pattern: string) {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

// 모든 캐시 삭제
function clearCache() {
  cache.clear();
}

// 사용 예시: 사용자 정보 업데이트 후 캐시 무효화
async function updateUser(userId: number, data: any) {
  await updateUserAPI(userId, data);
  invalidateCache(`user-${userId}`); // 캐시 무효화
}
```

**무효화 전략:**

1. **명시적 무효화**: 데이터 업데이트 시 해당 캐시 삭제
2. **TTL 기반 무효화**: 시간이 지나면 자동 삭제
3. **태그 기반 무효화**: 관련된 모든 캐시를 태그로 그룹화하여 삭제

**사용 사례:**

- 데이터 업데이트 후
- 사용자 로그아웃 시
- 특정 이벤트 발생 시

#### 3.4. 캐시 전략 비교

| 전략                       | 설명                                         | 사용 사례                           |
| :------------------------- | :------------------------------------------- | :---------------------------------- |
| **Cache First**            | 캐시를 먼저 확인, 없으면 네트워크            | 자주 변경되지 않는 데이터           |
| **Network First**          | 네트워크를 먼저 시도, 실패하면 캐시          | 최신 데이터가 중요한 경우           |
| **Stale While Revalidate** | 캐시를 즉시 반환하고 백그라운드에서 업데이트 | 빠른 응답 + 최신 데이터 모두 필요   |
| **Network Only**           | 항상 네트워크 요청                           | 실시간 데이터, 캐싱 불가능한 데이터 |
| **Cache Only**             | 항상 캐시 사용                               | 오프라인 모드, 정적 데이터          |

#### 3.5. 캐시 크기 관리

메모리 사용량을 제한하기 위해 캐시 크기를 관리합니다.

```typescript
// ✅ After: LRU (Least Recently Used) 캐시
class LRUCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // 사용된 항목을 맨 뒤로 이동 (LRU)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 가장 오래된 항목 삭제 (맨 앞)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}
```

**효과:**

- 메모리 사용량 제한
- 자주 사용되는 데이터 유지
- 오래된 데이터 자동 제거

### 4. 주의사항

#### 4.1. 캐시 일관성

캐시된 데이터가 서버 데이터와 일치하지 않을 수 있습니다.

**해결 방법:**

- TTL을 적절히 설정
- 데이터 업데이트 시 캐시 무효화
- Stale While Revalidate 전략 사용

#### 4.2. 메모리 관리

캐시가 계속 쌓이면 메모리 누수가 발생할 수 있습니다.

**해결 방법:**

- LRU 캐시 사용
- 최대 크기 제한
- 주기적으로 오래된 캐시 정리

#### 4.3. 민감한 데이터

민감한 데이터는 캐싱하지 않거나 짧은 TTL을 사용해야 합니다.

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

```bash
# 루트에서 실행
yarn dev:e7
# 접속: http://localhost:5180
```

페이지 상단의 버튼을 클릭하여 Before/After 모드를 전환할 수 있습니다.

### Before 모드 (최적화 전)

- 캐싱 없음
- 매번 API 호출
- 같은 데이터를 여러 번 요청

### After 모드 (최적화 후)

- 메모리 캐싱 적용
- TTL 기반 자동 무효화
- 캐시 무효화 기능
- LRU 캐시로 메모리 관리

---

## 측정 방법

### 1. Network 탭 분석 (요청 횟수 비교)

1. 크롬 개발자 도구 > **Network** 탭 클릭
2. **"Disable cache"** 체크 (필수)
3. 같은 데이터를 여러 번 요청

**예상 결과:**

- **Before:**

  - 같은 데이터를 요청할 때마다 네트워크 요청 발생
  - Network 탭에서 여러 개의 요청 확인 가능

- **After:**
  - 첫 번째 요청만 네트워크 요청
  - 두 번째 요청부터는 캐시에서 반환 (Network 탭에 요청 없음)

### 2. 콘솔 로그 확인

코드에서 캐시 히트/미스 로그를 출력하여 확인합니다.

### 3. 성능 비교

Before/After 모드에서 같은 작업을 수행하고 소요 시간을 비교합니다.

---

## 주요 코드 변경점

### 메모리 캐싱 (`utils/cache.ts`)

```tsx
// Before: 캐싱 없음
async function fetchUser(userId: number) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json(); // 매번 네트워크 요청
}

// After: 메모리 캐싱 적용
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

async function fetchUserCached(userId: number) {
  const cacheKey = `user-${userId}`;
  const cached = cache.get(cacheKey);

  // 캐시 히트
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    console.log("캐시 히트:", cacheKey);
    return cached.data;
  }

  // 캐시 미스 - 네트워크 요청
  console.log("캐시 미스:", cacheKey);
  const data = await fetchUser(userId);
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl: 60000, // 60초
  });

  return data;
}
```

### TTL 적용 (`utils/cache.ts`)

```tsx
// After: TTL 적용
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // TTL 확인
  const age = Date.now() - entry.timestamp;
  if (age > entry.ttl) {
    cache.delete(key); // 만료된 캐시 삭제
    return null;
  }

  return entry.data;
}
```

### 캐시 무효화 (`utils/cache.ts`)

```tsx
// After: 캐시 무효화
function invalidateCache(key: string) {
  cache.delete(key);
}

function invalidateCachePattern(pattern: string) {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

// 사용 예시
async function updateUser(userId: number, data: any) {
  await updateUserAPI(userId, data);
  invalidateCache(`user-${userId}`); // 업데이트 후 캐시 무효화
}
```

### LRU 캐시 (`utils/lru-cache.ts`)

```tsx
// After: LRU 캐시
class LRUCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // 사용된 항목을 맨 뒤로 이동
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 가장 오래된 항목 삭제
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}
```

---

## 📚 참고 자료 (References)

**데이터 캐싱 가이드**

- [Web.dev: HTTP Caching](https://web.dev/http-caching/) - HTTP 캐싱 가이드
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) - HTTP 캐싱 상세 설명
- [Web.dev: Cache API](https://web.dev/cache-api/) - Cache API 사용법

**캐싱 전략**

- [Web.dev: Caching strategies](https://web.dev/offline-cookbook/) - 다양한 캐싱 전략 비교
- [Google Developers: HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) - HTTP 캐싱 최적화

**실무 라이브러리**

- [React Query](https://tanstack.com/query/latest) - 자동 캐싱, TTL, 캐시 무효화
- [SWR](https://swr.vercel.app/) - 자동 캐싱 및 재검증 (stale-while-revalidate)
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL 쿼리 캐싱
- [lru-cache](https://github.com/isaacs/node-lru-cache) - LRU 캐시 구현

**추상화 라이브러리:**

- **React Query**: 자동 메모리 캐싱, TTL, 캐시 무효화 (기본 기능)
- **SWR**: 자동 메모리 캐싱 및 재검증 (stale-while-revalidate)
- **Apollo Client**: GraphQL 쿼리 자동 캐싱
- **lru-cache**: LRU 캐시 구현 라이브러리
