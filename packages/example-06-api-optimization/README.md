# 예제 6: API 호출 최적화

## 목적

API 호출 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

하나의 프로젝트에서 Before/After를 토글로 전환하여 비교할 수 있습니다.

- **Before 모드**: 비최적화된 API 호출 (Waterfall, 중복 요청, Debouncing 없음)
- **After 모드**: 최적화된 API 호출 (병렬 요청, 중복 제거, Debouncing 적용)

---

## 📚 이론: API 호출 최적화 원리와 전략

### 1. 개요 (Overview)

프론트엔드 애플리케이션에서 **API 호출 최적화**는 사용자 경험과 성능에 직접적인 영향을 미칩니다. 불필요한 요청을 줄이고, 요청을 효율적으로 처리하여 로딩 시간을 단축하고 서버 부하를 감소시킬 수 있습니다.

### 2. 문제 상황: 비효율적인 API 호출

#### ❌ Bad Case: Waterfall (순차적 요청)

```typescript
// 첫 번째 요청 완료 후 두 번째 요청 시작
const user = await fetchUser(userId);
const posts = await fetchPosts(userId); // user 응답 후 시작
const comments = await fetchComments(postId); // posts 응답 후 시작
```

**문제점:**

- 총 소요 시간 = 요청1 시간 + 요청2 시간 + 요청3 시간
- 불필요한 대기 시간 발생
- 사용자가 오래 기다려야 함

**예시:**

- 요청1: 200ms
- 요청2: 300ms
- 요청3: 150ms
- **총 시간: 650ms**

#### ❌ Bad Case: 중복 요청 (Request Duplication)

```typescript
// 같은 컴포넌트가 여러 번 렌더링되면서 같은 API를 여러 번 호출
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser); // 컴포넌트가 리렌더링될 때마다 호출
  }, [userId]);
}
```

**문제점:**

- 같은 데이터를 여러 번 요청
- 불필요한 네트워크 트래픽
- 서버 부하 증가

#### ❌ Bad Case: 불필요한 요청 (검색 입력 시)

```typescript
// 사용자가 타이핑할 때마다 API 호출
function SearchInput() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) {
      searchAPI(query); // "react" 입력 시: "r", "re", "rea", "reac", "react" 모두 호출
    }
  }, [query]);
}
```

**문제점:**

- 사용자가 타이핑하는 동안 불필요한 요청 발생
- 서버 부하 증가
- 네트워크 트래픽 낭비

### 3. 최적화 전략

#### 3.1. 병렬 요청 (Parallel Requests)

독립적인 요청을 동시에 실행하여 총 소요 시간을 단축합니다.

```typescript
// ❌ Before: 순차적 요청
const user = await fetchUser(userId);
const posts = await fetchPosts(userId);
const comments = await fetchComments(postId);
// 총 시간: 200ms + 300ms + 150ms = 650ms

// ✅ After: 병렬 요청
const [user, posts, comments] = await Promise.all([
  fetchUser(userId),
  fetchPosts(userId),
  fetchComments(postId),
]);
// 총 시간: max(200ms, 300ms, 150ms) = 300ms
```

**효과:**

- 총 소요 시간이 가장 느린 요청 시간으로 단축
- 약 50-70% 시간 단축 가능

**사용 사례:**

- 독립적인 데이터를 동시에 가져올 때
- 여러 API 엔드포인트에서 데이터를 가져올 때

**추상화 라이브러리:**

- **React Query / SWR**: 여러 `useQuery` 훅을 사용하면 자동으로 병렬 처리됨
- **Promise.all**: 네이티브 JavaScript API (추가 라이브러리 불필요)

#### 3.2. Request Deduplication (요청 중복 제거)

같은 요청이 여러 번 발생할 때 하나의 요청만 실행하고 결과를 공유합니다.

```typescript
// ✅ After: 요청 중복 제거
const requestCache = new Map();

async function fetchUserDeduplicated(userId: string) {
  const cacheKey = `user-${userId}`;

  // 이미 진행 중인 요청이 있으면 그 요청의 Promise 반환
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  // 새로운 요청 시작
  const promise = fetchUser(userId);
  requestCache.set(cacheKey, promise);

  // 요청 완료 후 캐시에서 제거
  promise.finally(() => {
    requestCache.delete(cacheKey);
  });

  return promise;
}
```

**효과:**

- 같은 요청이 여러 번 발생해도 실제로는 한 번만 실행
- 네트워크 트래픽 감소
- 서버 부하 감소

**사용 사례:**

- React 컴포넌트가 여러 번 리렌더링될 때
- 여러 컴포넌트에서 같은 데이터를 요청할 때

**추상화 라이브러리:**

- **React Query**: `queryKey`가 같으면 자동으로 중복 제거 (기본 기능)
- **SWR**: 같은 키의 요청은 자동으로 중복 제거 (기본 기능)
- **Apollo Client**: GraphQL 쿼리 자동 중복 제거

#### 3.3. Debouncing (디바운싱)

연속된 이벤트에서 마지막 이벤트만 처리합니다.

```typescript
// ✅ After: Debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예시
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // 300ms 후에만 업데이트

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery); // 사용자가 타이핑을 멈춘 후 300ms 후에만 호출
    }
  }, [debouncedQuery]);
}
```

**효과:**

- 사용자가 타이핑을 멈춘 후에만 API 호출
- 불필요한 요청 대폭 감소

**사용 사례:**

- 검색 입력
- 필터 변경
- 자동완성

**추상화 라이브러리:**

- **lodash.debounce**: 범용 디바운스 함수
- **use-debounce**: React 훅 형태의 디바운스 (`useDebouncedValue`, `useDebouncedCallback`)
- **react-hook-form**: 폼 입력 시 자동 디바운싱 지원

#### 3.4. Throttling (스로틀링)

일정 시간 간격으로만 이벤트를 처리합니다.

```typescript
// ✅ After: Throttling
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
```

**Debouncing vs Throttling:**

- **Debouncing:** 마지막 이벤트만 처리 (검색 입력에 적합)
- **Throttling:** 일정 간격으로 처리 (스크롤 이벤트에 적합)

**추상화 라이브러리:**

- **lodash.throttle**: 범용 스로틀 함수
- **use-throttle**: React 훅 형태의 스로틀 (`useThrottledValue`, `useThrottledCallback`)
- **react-use**: `useThrottle`, `useDebounce` 훅 제공

#### 3.5. Request Cancellation (요청 취소)

더 이상 필요 없는 요청을 취소합니다.

```typescript
// ✅ After: Request Cancellation
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((response) => response.json())
    .then((data) => {
      // 데이터 처리
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("요청 취소됨");
      }
    });

  // 컴포넌트 언마운트 시 요청 취소
  return () => {
    controller.abort();
  };
}, []);
```

**효과:**

- 불필요한 네트워크 요청 방지
- 메모리 누수 방지
- 서버 부하 감소

**사용 사례:**

- 컴포넌트 언마운트 시
- 사용자가 다른 페이지로 이동할 때
- 조건이 변경되어 이전 요청이 불필요해질 때

**추상화 라이브러리:**

- **React Query**: 컴포넌트 언마운트 시 자동으로 요청 취소 (기본 기능)
- **SWR**: 컴포넌트 언마운트 시 자동으로 요청 취소 (기본 기능)
- **Axios**: `CancelToken` 또는 `AbortController` 지원
- **fetch API**: 네이티브 `AbortController` 지원 (추가 라이브러리 불필요)

#### 3.6. Batch Requests (배치 요청)

여러 개의 작은 요청을 하나의 큰 요청으로 묶습니다.

```typescript
// ❌ Before: 여러 개의 작은 요청
await fetchUser(1);
await fetchUser(2);
await fetchUser(3);
// 3번의 네트워크 요청

// ✅ After: 배치 요청
await fetchUsers([1, 2, 3]);
// 1번의 네트워크 요청
```

**효과:**

- 네트워크 요청 횟수 감소
- HTTP 오버헤드 감소
- 서버 부하 감소

**사용 사례:**

- 여러 항목의 상세 정보를 가져올 때
- 리스트 아이템의 추가 데이터를 가져올 때

**추상화 라이브러리:**

- **GraphQL**: 배치 요청을 위한 `DataLoader` 패턴
- **Apollo Client**: GraphQL 배치 요청 자동 처리
- **React Query**: `useQueries` 훅으로 여러 쿼리 배치 처리

### 4. 전략 선택 가이드

| 상황                     | 권장 전략               | 이유               |
| :----------------------- | :---------------------- | :----------------- |
| 독립적인 여러 데이터     | 병렬 요청 (Promise.all) | 총 시간 단축       |
| 같은 요청이 여러 번 발생 | Request Deduplication   | 중복 제거          |
| 검색 입력                | Debouncing              | 마지막 입력만 처리 |
| 스크롤 이벤트            | Throttling              | 일정 간격으로 처리 |
| 컴포넌트 언마운트        | Request Cancellation    | 불필요한 요청 방지 |
| 여러 작은 요청           | Batch Requests          | 요청 횟수 감소     |

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

```bash
# 루트에서 실행
yarn dev:e6
# 접속: http://localhost:5179
```

페이지 상단의 버튼을 클릭하여 Before/After 모드를 전환할 수 있습니다.

### Before 모드 (최적화 전)

- 순차적 API 호출 (Waterfall)
- 중복 요청 발생
- 검색 입력 시 매번 API 호출
- 불필요한 요청 취소 없음

### After 모드 (최적화 후)

- 병렬 API 호출 (Promise.all)
- Request Deduplication 적용
- Debouncing으로 검색 최적화
- Request Cancellation 적용

---

## 측정 방법

### 1. Network 탭 분석 (요청 시간 비교)

1. 크롬 개발자 도구 > **Network** 탭 클릭
2. **"Disable cache"** 체크 (필수)
3. 새로고침 후 요청 타임라인 확인

**예상 결과:**

- **Before:**

  - 요청들이 순차적으로 실행됨 (Waterfall)
  - 같은 요청이 여러 번 발생
  - 검색 입력 시 매번 요청 발생
  - 총 소요 시간: 요청1 + 요청2 + 요청3

- **After:**
  - 독립적인 요청들이 병렬로 실행됨
  - 중복 요청이 하나로 합쳐짐
  - 검색 입력 시 Debouncing으로 마지막 입력만 처리
  - 총 소요 시간: max(요청1, 요청2, 요청3)

### 2. Performance 탭 분석

1. 개발자 도구 > **Performance** 탭
2. **Record** 클릭 후 페이지와 상호작용
3. **Stop** 클릭 후 Network 트랙 확인

**주요 확인 지표:**

- **요청 시작 시점:** 병렬 요청이 동시에 시작되는가?
- **총 소요 시간:** Before vs After 비교

### 3. 콘솔 로그 확인

코드에서 요청 시작/완료 시간을 로그로 출력하여 비교합니다.

---

## 주요 코드 변경점

### 병렬 요청 (`components/DataLoader.tsx`)

```tsx
// Before: 순차적 요청
useEffect(() => {
  const loadData = async () => {
    const user = await fetchUser(userId); // 200ms
    const posts = await fetchPosts(userId); // 300ms (user 완료 후 시작)
    const comments = await fetchComments(postId); // 150ms (posts 완료 후 시작)
    // 총 시간: 650ms
  };
  loadData();
}, [userId]);

// After: 병렬 요청
useEffect(() => {
  const loadData = async () => {
    const [user, posts, comments] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
      fetchComments(postId),
    ]);
    // 총 시간: max(200ms, 300ms, 150ms) = 300ms
  };
  loadData();
}, [userId]);
```

### Request Deduplication (`utils/api.ts`)

```tsx
// Before: 중복 요청 발생
function UserProfile({ userId }) {
  useEffect(() => {
    fetchUser(userId); // 컴포넌트 리렌더링 시마다 호출
  }, [userId]);
}

// After: 요청 중복 제거
const requestCache = new Map<string, Promise<any>>();

export function fetchUserDeduplicated(userId: string) {
  const cacheKey = `user-${userId}`;

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  const promise = fetchUser(userId);
  requestCache.set(cacheKey, promise);

  promise.finally(() => {
    requestCache.delete(cacheKey);
  });

  return promise;
}
```

### Debouncing (`hooks/useDebounce.ts`)

```tsx
// Before: 매번 API 호출
function SearchInput() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) {
      searchAPI(query); // "react" 입력 시 5번 호출
    }
  }, [query]);
}

// After: Debouncing 적용
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery); // 타이핑 멈춘 후 300ms 후 1번만 호출
    }
  }, [debouncedQuery]);
}
```

### Request Cancellation (`components/DataFetcher.tsx`)

```tsx
// Before: 요청 취소 없음
useEffect(() => {
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      setData(data); // 컴포넌트 언마운트 후에도 실행됨
    });
}, []);

// After: Request Cancellation 적용
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((response) => response.json())
    .then((data) => {
      setData(data);
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });

  return () => {
    controller.abort(); // 컴포넌트 언마운트 시 요청 취소
  };
}, []);
```

---

## 📚 참고 자료 (References)

**API 호출 최적화 가이드**

- [Web.dev: Optimize long tasks](https://web.dev/optimize-long-tasks/) - 긴 작업 최적화 가이드
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) - 요청 취소 API
- [React Query Documentation](https://tanstack.com/query/latest) - React Query를 통한 자동 최적화

**Debouncing & Throttling**

- [Web.dev: Debounce your input handlers](https://web.dev/debounce-your-input-handlers/) - 입력 핸들러 디바운싱
- [Lodash: debounce](https://lodash.com/docs/4.17.15#debounce) - Lodash debounce 함수
- [Lodash: throttle](https://lodash.com/docs/4.17.15#throttle) - Lodash throttle 함수

**병렬 처리**

- [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) - Promise.all 사용법
- [MDN: Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) - 모든 Promise 완료 대기

**실무 라이브러리**

- [React Query](https://tanstack.com/query/latest) - 자동 캐싱, 중복 제거, 요청 취소
- [SWR](https://swr.vercel.app/) - 데이터 페칭 라이브러리
- [Axios](https://axios-http.com/) - HTTP 클라이언트 (요청 취소 지원)
