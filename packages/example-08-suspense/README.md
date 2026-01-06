# 예제 8: Suspense

## 목적

React Suspense 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

하나의 프로젝트에서 Before/After를 토글로 전환하여 비교할 수 있습니다.

- **Before 모드**: 수동 로딩 상태 관리 (useState, useEffect)
- **After 모드**: Suspense를 통한 선언적 로딩 상태 관리

---

## 📚 이론: React Suspense 원리와 전략

### 1. 개요 (Overview)

**React Suspense**는 비동기 작업(데이터 페칭, 코드 스플리팅 등)의 로딩 상태를 선언적으로 관리할 수 있게 해주는 React 기능입니다. 컴포넌트가 데이터를 기다리는 동안 fallback UI를 표시합니다.

**성능 최적화와의 연관성:**

Suspense는 단순히 로딩 상태를 관리하는 것이 아니라, **실제 성능 최적화에 직접적으로 기여**합니다:

1. **Progressive Loading (점진적 로딩)**

   - 빠른 데이터부터 먼저 표시하여 사용자가 더 빨리 콘텐츠를 볼 수 있음
   - FCP (First Contentful Paint) 시간 단축
   - 인지적 성능 개선 (느리게 느껴지지 않음)

2. **병렬 데이터 페칭**

   - 독립적인 데이터를 동시에 로드하여 총 로딩 시간 단축
   - Waterfall 문제 해결 (순차적 로딩 → 병렬 로딩)
   - 네트워크 대역폭 효율적 활용

3. **코드 스플리팅과 결합**

   - 초기 번들 크기 감소로 FCP 개선
   - 필요할 때만 컴포넌트 로드
   - 메모리 효율성 향상

4. **불필요한 리렌더링 방지**

   - Promise가 resolve될 때만 리렌더링
   - 로딩 상태 변경으로 인한 중간 리렌더링 제거
   - 렌더링 성능 개선

5. **인지적 성능 개선**
   - 빠른 피드백 (즉시 로딩 UI 표시)
   - 부분 콘텐츠 표시로 사용자 경험 향상
   - 일관된 UX 제공

### 2. 문제 상황: 수동 로딩 상태 관리

#### ❌ Bad Case: 수동 로딩 상태 관리

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchUser(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;
  return <div>{user.name}</div>;
}
```

**문제점:**

- 로딩 상태를 수동으로 관리해야 함
- 각 컴포넌트마다 반복적인 코드 (boilerplate)
- 에러 처리 로직이 복잡함
- 여러 비동기 작업을 조합하기 어려움

### 3. Suspense 기본 개념

#### 3.1. Suspense란?

Suspense는 컴포넌트가 "준비될 때까지" 기다릴 수 있게 해주는 React 컴포넌트입니다.

```tsx
<Suspense fallback={<div>로딩 중...</div>}>
  <UserProfile userId={1} />
</Suspense>
```

**작동 원리:**

1. `UserProfile`이 데이터를 요청하면 Promise를 throw
2. Suspense가 Promise를 캐치
3. fallback UI를 표시
4. Promise가 resolve되면 컴포넌트 렌더링

#### 3.2. Suspense와 함께 사용하는 방법

**방법 1: React Query / SWR (권장)**

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

function UserProfile({ userId }) {
  // Suspense와 호환되는 훅 사용
  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  // 로딩 상태 관리 불필요 - Suspense가 처리
  return <div>{data.name}</div>;
}

// 사용
<Suspense fallback={<div>로딩 중...</div>}>
  <UserProfile userId={1} />
</Suspense>;
```

**방법 2: 직접 구현 (Promise throw)**

```tsx
// Suspense와 호환되는 데이터 페칭
let cache = new Map();

function fetchUserWithSuspense(userId) {
  if (cache.has(userId)) {
    return cache.get(userId);
  }

  // Promise를 throw하여 Suspense에 알림
  throw fetchUser(userId).then((data) => {
    cache.set(userId, data);
  });
}

function UserProfile({ userId }) {
  const user = fetchUserWithSuspense(userId); // Promise가 throw되면 여기서 멈춤
  return <div>{user.name}</div>; // Promise가 resolve되면 여기서 실행
}
```

### 4. Suspense의 장점

#### 4.1. Progressive Loading (점진적 로딩) - 성능 최적화

빠른 데이터부터 먼저 표시하여 사용자 경험을 개선합니다.

```tsx
// ❌ Before: 모든 데이터가 로드될 때까지 기다림
const [user, setUser] = useState(null);
const [posts, setPosts] = useState(null);
const [comments, setComments] = useState(null);

// 모든 데이터가 준비될 때까지 화면이 비어있음
if (!user || !posts || !comments) {
  return <div>로딩 중...</div>;
}

// ✅ After: Suspense로 각각 독립적으로 로딩
<Suspense fallback={<div>사용자 로딩...</div>}>
  <UserProfile /> {/* 먼저 로드되면 먼저 표시 */}
</Suspense>
<Suspense fallback={<div>게시글 로딩...</div>}>
  <UserPosts /> {/* 나중에 로드되면 나중에 표시 */}
</Suspense>
```

**성능 효과:**

- **FCP 개선**: 빠른 데이터부터 먼저 표시하여 First Contentful Paint 시간 단축
- **인지적 성능**: 사용자가 콘텐츠를 더 빨리 볼 수 있어 느리게 느껴지지 않음
- **총 로딩 시간 단축**: 모든 데이터를 기다리지 않고 부분 콘텐츠부터 표시

#### 4.2. 병렬 데이터 페칭 - 성능 최적화

Suspense는 독립적인 데이터를 자동으로 병렬 처리합니다.

```tsx
// ❌ Before: 순차적 로딩 (Waterfall)
useEffect(() => {
  fetchUser().then((user) => {
    fetchPosts(user.id).then((posts) => {
      // 순차적으로 로드 (총 시간: 요청1 + 요청2)
    });
  });
}, []);

// ✅ After: Suspense는 자동으로 병렬 처리
<Suspense fallback={<div>로딩...</div>}>
  <UserProfile /> {/* 동시에 시작 */}
  <UserPosts /> {/* 동시에 시작 */}
</Suspense>;
// 총 시간: max(요청1, 요청2)
```

**성능 효과:**

- **로딩 시간 단축**: 독립적인 데이터를 동시에 로드하여 총 소요 시간 감소
  - 예: 요청1(200ms) + 요청2(300ms) = 500ms → max(200ms, 300ms) = 300ms
  - 약 40-50% 시간 단축 가능
- **네트워크 활용 최적화**: 여러 요청을 병렬로 처리하여 대역폭 효율적 사용
- **TTI (Time to Interactive) 개선**: 빠른 데이터부터 인터랙티브하게 만듦

#### 4.3. 코드 스플리팅과 결합 - 성능 최적화

Suspense와 Code Splitting을 결합하면 초기 번들 크기를 줄일 수 있습니다.

```tsx
// ✅ Suspense + Code Splitting
const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<div>컴포넌트 로딩 중...</div>}>
  <HeavyComponent /> {/* 필요할 때만 로드 */}
</Suspense>;
```

**성능 효과:**

- **초기 번들 크기 감소**: 무거운 컴포넌트를 필요할 때만 로드
  - 예: 500KB 번들 → 200KB (초기) + 300KB (지연 로드)
  - 초기 로딩 시간 40-60% 단축 가능
- **FCP 개선**: 초기 로딩 시간 단축
- **메모리 효율**: 사용하지 않는 컴포넌트는 로드하지 않음
- **코드 스플리팅 자동화**: Suspense와 결합하여 쉽게 구현

#### 4.4. 불필요한 리렌더링 방지 - 성능 최적화

Suspense는 내부적으로 최적화되어 불필요한 리렌더링을 방지합니다.

```tsx
// ❌ Before: 로딩 상태 변경마다 리렌더링
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData().then((data) => {
    setLoading(false); // 리렌더링 발생
    setData(data);      // 또 리렌더링 발생
  });
}, []);

// ✅ After: Suspense는 내부적으로 최적화
// Promise가 resolve될 때만 리렌더링
function DataComponent() {
  const data = useSuspenseQuery(...); // 한 번만 리렌더링
  return <div>{data.name}</div>;
}
```

**성능 효과:**

- **리렌더링 횟수 감소**: 로딩 상태 변경으로 인한 불필요한 리렌더링 제거
  - Before: 로딩 시작 → 로딩 완료 → 데이터 설정 (3번 리렌더링)
  - After: 데이터 준비 완료 (1번 리렌더링)
- **렌더링 성능 개선**: 필요한 시점에만 리렌더링
- **메모리 효율**: 중간 상태를 저장하지 않아 메모리 사용량 감소

#### 4.5. 선언적 코드

```tsx
// ❌ Before: 명령형 (수동 관리)
function UserProfile({ userId }) {
  const [loading, setLoading] = useState(true);
  // ... 복잡한 상태 관리
  if (loading) return <div>로딩 중...</div>;
  return <div>{user.name}</div>;
}

// ✅ After: 선언적 (Suspense가 관리)
function UserProfile({ userId }) {
  const user = useSuspenseQuery(...); // 로딩 상태 불필요
  return <div>{user.name}</div>;
}

<Suspense fallback={<div>로딩 중...</div>}>
  <UserProfile userId={1} />
</Suspense>
```

#### 4.6. 중첩된 Suspense

여러 레벨에서 독립적으로 로딩 상태를 관리할 수 있습니다.

```tsx
<Suspense fallback={<div>전체 로딩 중...</div>}>
  <UserProfile userId={1} />
  <Suspense fallback={<div>게시글 로딩 중...</div>}>
    <UserPosts userId={1} />
  </Suspense>
</Suspense>
```

**효과:**

- 각 컴포넌트가 독립적으로 로딩 상태 표시
- 빠른 컴포넌트는 먼저 표시 (Progressive Loading)
- 사용자 경험 개선

**성능 효과:**

- **FCP 개선**: 빠른 컴포넌트부터 표시하여 First Contentful Paint 시간 단축
- **인지적 성능**: 부분 콘텐츠 표시로 사용자가 더 빨리 콘텐츠를 볼 수 있음
- **LCP 개선**: Largest Contentful Paint 요소가 더 빨리 표시됨

#### 4.7. 에러 경계와 함께 사용

```tsx
<ErrorBoundary fallback={<div>에러 발생</div>}>
  <Suspense fallback={<div>로딩 중...</div>}>
    <UserProfile userId={1} />
  </Suspense>
</ErrorBoundary>
```

### 5. 성능 최적화 측면에서의 Suspense 요약

**핵심 성능 지표 개선:**

| 지표          | Before (수동 관리)  | After (Suspense)     | 개선율      |
| :------------ | :------------------ | :------------------- | :---------- |
| **FCP**       | 모든 데이터 로드 후 | 빠른 데이터부터 표시 | 30-50% 개선 |
| **로딩 시간** | 순차적 (Waterfall)  | 병렬 처리            | 40-50% 단축 |
| **초기 번들** | 모든 코드 포함      | 코드 스플리팅        | 40-60% 감소 |
| **리렌더링**  | 로딩 상태마다       | 데이터 준비 시만     | 66% 감소    |

**실무에서의 성능 효과:**

- **사용자 경험**: Progressive Loading으로 인지적 성능 크게 개선
- **실제 성능**: 병렬 처리와 코드 스플리팅으로 로딩 시간 단축
- **개발 생산성**: 코드 복잡도 감소로 유지보수성 향상

### 6. Suspense 사용 사례

#### 5.1. 데이터 페칭

```tsx
// React Query의 useSuspenseQuery 사용
function UserProfile({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{data.name}</div>;
}
```

#### 5.2. 코드 스플리팅

```tsx
const LazyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<div>컴포넌트 로딩 중...</div>}>
  <LazyComponent />
</Suspense>;
```

#### 5.3. 여러 비동기 작업 조합

```tsx
<Suspense fallback={<div>로딩 중...</div>}>
  <UserProfile userId={1} />
  <UserPosts userId={1} />
  <UserComments userId={1} />
</Suspense>
```

### 7. 주의사항

#### 6.1. Promise를 throw해야 함

Suspense는 Promise를 throw하는 방식으로 작동합니다.

```tsx
// ✅ 올바른 방법
function fetchData() {
  if (cache.has(key)) {
    return cache.get(key);
  }
  throw fetch(url).then((data) => {
    cache.set(key, data);
  });
}

// ❌ 잘못된 방법
function fetchData() {
  return fetch(url); // Promise를 반환하면 Suspense가 작동하지 않음
}
```

#### 6.2. 에러 처리

Suspense는 에러를 처리하지 않으므로 ErrorBoundary와 함께 사용해야 합니다.

```tsx
<ErrorBoundary>
  <Suspense fallback={<div>로딩 중...</div>}>
    <UserProfile userId={1} />
  </Suspense>
</ErrorBoundary>
```

#### 6.3. React 18+ 필요

Suspense for Data Fetching은 React 18에서 안정적으로 지원됩니다.

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

```bash
# 루트에서 실행
yarn dev:e8
# 접속: http://localhost:5181
```

페이지 상단의 버튼을 클릭하여 Before/After 모드를 전환할 수 있습니다.

### 예제 구성

1. **Progressive Loading (점진적 로딩)**

   - Before: 모든 데이터가 로드될 때까지 기다림 (Promise.all로 모든 데이터 완료 후 한 번에 표시)
   - After: Suspense로 각각 독립적으로 로딩 (빠른 데이터부터 먼저 표시)
   - 각 예제의 "데이터 로드" 버튼을 클릭하여 테스트

2. **병렬 데이터 페칭**
   - Before: 순차적 로딩 (Waterfall) - 첫 번째 요청 완료 후 두 번째 요청 시작
   - After: Suspense로 병렬 로딩 - 모든 요청을 동시에 시작
   - 각 예제의 "데이터 로드" 버튼을 클릭하여 소요 시간 비교

### Before 모드 (최적화 전)

- 수동 로딩 상태 관리 (useState, useEffect)
- 모든 데이터가 준비될 때까지 기다림 (Progressive Loading 예제)
- 순차적 로딩 (병렬 데이터 페칭 예제)
- 각 컴포넌트마다 로딩 UI 반복
- 복잡한 에러 처리 로직

### After 모드 (최적화 후)

- Suspense를 통한 선언적 로딩 상태 관리
- 빠른 데이터부터 먼저 표시 (Progressive Loading 예제)
- 병렬 로딩으로 총 시간 단축 (병렬 데이터 페칭 예제)
- 중앙화된 로딩 UI (fallback)
- 간결한 코드

---

## 측정 방법

### 1. Progressive Loading 비교

**Before 모드:**

1. "데이터 로드" 버튼 클릭
2. 모든 데이터(user, posts)가 로드될 때까지 "로딩 중..." 표시
3. 모든 데이터가 준비되면 한 번에 표시

**After 모드:**

1. "데이터 로드" 버튼 클릭
2. 빠른 데이터(user)부터 먼저 표시
3. 느린 데이터(posts)는 나중에 표시

**측정 지표:**

- **FCP (First Contentful Paint)**: After 모드에서 빠른 데이터부터 표시되어 FCP 개선
- **인지적 성능**: After 모드에서 사용자가 콘텐츠를 더 빨리 볼 수 있음

### 2. 병렬 데이터 페칭 비교

**Before 모드:**

1. "데이터 로드 (순차적)" 버튼 클릭
2. Network 탭에서 순차적 요청 확인 (첫 번째 요청 완료 후 두 번째 요청 시작)
3. 소요 시간 확인 (요청1 + 요청2)

**After 모드:**

1. "데이터 로드 (병렬)" 버튼 클릭
2. Network 탭에서 병렬 요청 확인 (모든 요청이 동시에 시작)
3. 소요 시간 확인 (max(요청1, 요청2))

**측정 지표:**

- **로딩 시간**: After 모드에서 약 40-50% 시간 단축
- **Network 탭**: 요청이 병렬로 실행되는지 확인

### 3. 코드 복잡도 비교

Before/After 모드의 코드를 비교하여 복잡도 차이를 확인합니다.

**예상 결과:**

- **Before:** 각 컴포넌트마다 로딩 상태 관리 코드 필요
- **After:** Suspense로 로딩 상태 관리 코드 제거

---

## 주요 코드 변경점

### 수동 로딩 상태 관리 → Suspense

```tsx
// Before: 수동 로딩 상태 관리
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;
  return <div>{user.name}</div>;
}

// After: Suspense 사용
function UserProfile({ userId }) {
  const user = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  // 로딩 상태 관리 불필요
  return <div>{user.name}</div>;
}

<Suspense fallback={<div>로딩 중...</div>}>
  <UserProfile userId={1} />
</Suspense>;
```

### 여러 컴포넌트 조합

```tsx
// Before: 각 컴포넌트가 독립적으로 로딩 상태 관리
function Dashboard({ userId }) {
  return (
    <div>
      <UserProfile userId={userId} /> {/* 각각 로딩 상태 */}
      <UserPosts userId={userId} /> {/* 각각 로딩 상태 */}
      <UserComments userId={userId} /> {/* 각각 로딩 상태 */}
    </div>
  );
}

// After: Suspense로 중앙화
function Dashboard({ userId }) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <UserComments userId={userId} />
    </Suspense>
  );
}
```

### Progressive Loading 구현

```tsx
// Before: 모든 데이터가 로드될 때까지 기다림
function ProgressiveLoadingBefore() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    // 모든 데이터를 병렬로 로드하지만, 모두 완료될 때까지 기다림
    const [userData, postsData] = await Promise.all([
      fetchUser(1),
      fetchPosts(1),
    ]);
    setUser(userData);
    setPosts(postsData);
    setLoading(false);
  };

  if (loading || !user || posts.length === 0) {
    return <div>로딩 중...</div>;
  }
  // 모든 데이터가 준비된 후에만 표시
  return (
    <>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
    </>
  );
}

// After: Suspense로 각각 독립적으로 로딩
function ProgressiveLoadingAfter() {
  return (
    <>
      <Suspense fallback={<div>사용자 로딩 중...</div>}>
        <UserProfile userId={1} />
      </Suspense>
      <Suspense fallback={<div>게시글 로딩 중...</div>}>
        <UserPosts userId={1} />
      </Suspense>
    </>
  );
}
```

### 병렬 데이터 페칭 구현

```tsx
// Before: 순차적 로딩 (Waterfall)
async function loadDataSequential() {
  const startTime = performance.now();
  const user = await fetchUser(1); // 첫 번째 요청
  const posts = await fetchPosts(1); // 두 번째 요청 (첫 번째 완료 후)
  const endTime = performance.now();
  // 총 시간 = 요청1 + 요청2
}

// After: Suspense로 병렬 처리
function ParallelFetchingAfter() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UserProfile userId={1} /> {/* 동시에 시작 */}
      <UserPosts userId={1} /> {/* 동시에 시작 */}
    </Suspense>
  );
  // 총 시간 = max(요청1, 요청2)
}
```

---

## 📚 참고 자료 (References)

**React Suspense 가이드**

- [React 공식 문서: Suspense](https://react.dev/reference/react/Suspense) - Suspense 공식 문서
- [React 공식 문서: Suspense for Data Fetching](https://react.dev/reference/react/Suspense#handling-loading-states) - 데이터 페칭에서 Suspense 사용
- [Web.dev: React Suspense](https://web.dev/react-suspense/) - Suspense 완벽 가이드

**Suspense와 함께 사용하는 라이브러리**

- [React Query: useSuspenseQuery](https://tanstack.com/query/latest/docs/react/guides/suspense) - Suspense와 호환되는 쿼리 훅
- [SWR: Suspense Mode](https://swr.vercel.app/docs/suspense) - SWR의 Suspense 모드
- [Relay: Suspense](https://relay.dev/docs/guided-tour/rendering/loading-states/) - GraphQL Relay의 Suspense 지원

**에러 처리**

- [React 공식 문서: Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) - Error Boundary 사용법
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary) - Error Boundary 라이브러리

**추상화 라이브러리:**

- **React Query**: `useSuspenseQuery` 훅으로 Suspense와 완벽 호환
- **SWR**: Suspense 모드 지원
- **Relay**: GraphQL 쿼리에서 Suspense 지원
