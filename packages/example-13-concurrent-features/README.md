# 예제 13: React 18 Concurrent Features

## 목적

React 18의 **Concurrent Features**를 독립적으로 학습하기 위한 예제입니다.
현재는 문서만 제공하며, 실습 코드는 추후 추가될 예정입니다.

---

## 구조

아래는 구현 예정 구조입니다.

- **Before 모드**

  - 입력/필터 변경 시 동기 렌더링으로 UI가 멈춤
  - 큰 리스트 업데이트가 우선 처리되어 타이핑이 끊김
  - 로딩 상태가 거칠게 전환됨

- **After 모드**

  - `useTransition`/`startTransition`으로 비긴급 업데이트 분리
  - `useDeferredValue`로 입력 반응성 유지
  - `isPending`으로 부드러운 진행 상태 표시
  - 필요 시 Suspense와 결합하여 UI 안정성 향상

- **레이아웃**

  - Before/After 모드를 나란히 비교하는 레이아웃
  - 검색/필터 입력과 대용량 리스트를 동시에 배치
  - 렌더링 지연 시간과 스로틀링 체감 가능

---

## 📚 이론: React 18 Concurrent Features 원리와 전략

## 1. 개요 (Overview)

React 18의 Concurrent Features는 **업데이트 우선순위**를 분리해
사용자 입력과 같은 **긴급 업데이트**의 응답성을 유지하면서,
무거운 렌더링은 **비긴급 업데이트**로 처리하도록 돕습니다.

핵심 개념:

- **Transitions**: 비긴급 업데이트를 낮은 우선순위로 실행
- **Deferred Value**: 값 업데이트를 지연시켜 입력 반응성 유지
- **Suspense**: 대기 상태를 선언적으로 표현하고 점진적 표시
- **Automatic Batching**: 여러 상태 업데이트를 묶어 렌더링 최소화

---

## 2. Concurrent Features와 성능의 관계

### 2.1 입력 응답성 유지

- **Before**: 필터 입력 시 큰 리스트가 즉시 렌더링되어 입력이 끊김
- **After**: 입력은 즉시 반영, 리스트는 낮은 우선순위로 업데이트
- **효과**: 타이핑 지연 감소, UI 멈춤 최소화

### 2.2 사용자 인지 성능 개선

- **Before**: 빈 화면 전환이나 갑작스러운 로딩 표시
- **After**: `isPending`으로 진행 상태 표시, 화면 안정성 증가
- **효과**: UX 안정감 향상, 인터랙션 지속성 확보

### 2.3 렌더링 비용 분산

- **Before**: 단일 큰 렌더링으로 메인 스레드 점유
- **After**: 우선순위가 분리되어 렌더링 비용을 분산
- **효과**: 메인 스레드 블로킹 감소

---

## 3. 문제 상황: 동기 렌더링으로 UI가 멈추는 경우

### ❌ Bad Case

```tsx
function SearchPage({ items }) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <BigList items={filtered} />
    </>
  );
}
```

### 문제점

- 입력과 리스트 렌더링이 동일 우선순위로 처리됨
- 입력 시 타이핑이 끊기거나 지연됨
- UI가 멈춘 것처럼 느껴짐

---

## 4. Transitions: 비긴급 업데이트 분리

`useTransition`과 `startTransition`은 무거운 렌더링을 낮은 우선순위로 처리합니다.

### 4.1 useTransition

```tsx
function SearchPage({ items }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const onChange = (e) => {
    const next = e.target.value;
    setQuery(next); // 긴급 업데이트
    startTransition(() => {
      setFilter(next); // 비긴급 업데이트
    });
  };

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <span>업데이트 중...</span>}
      <BigList items={filtered} />
    </>
  );
}
```

### 4.2 startTransition

```tsx
function navigateToTab(tabId) {
  startTransition(() => {
    setActiveTab(tabId);
  });
}
```

**적용 포인트:**

- 검색/필터링, 탭 전환, 대용량 리스트 갱신
- 화면이 한번에 크게 바뀌는 업데이트

---

## 5. Deferred Value: 입력 반응성 유지

`useDeferredValue`는 입력값을 즉시 사용하지 않고 느리게 반영합니다.

```tsx
function SearchPage({ items }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <BigList items={filtered} />
    </>
  );
}
```

**주의사항:**

- 디바운스와 달리 지연 시간은 React가 판단
- 입력을 즉시 반영해야 하는 UI에는 사용하지 않음

---

## 6. Automatic Batching

React 18부터는 **비동기 컨텍스트에서도 상태 업데이트가 자동으로 배치**됩니다.

```tsx
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 18에서는 하나의 리렌더링으로 처리됨
}, 0);
```

**효과:**

- 리렌더링 횟수 감소
- 불필요한 중복 렌더링 최소화

---

## 7. 주의사항

- Transition은 **성능 최적화가 아니라 우선순위 분리**가 목적
- 모든 업데이트를 Transition으로 감싸면 오히려 UX가 나빠질 수 있음
- `useDeferredValue`는 고정 지연이 아닌 React 스케줄러 판단에 의존
- 오래 걸리는 연산 자체는 Web Worker나 메모이제이션으로 줄여야 함

---

## 8. 실전 적용 체크리스트

- 입력이 끊기는가? → `useTransition` 또는 `useDeferredValue` 고려
- 큰 리스트/테이블 갱신이 있는가? → Transition으로 분리
- 로딩 상태가 거칠게 전환되는가? → `isPending` 표시
- 상태 업데이트가 연속적으로 발생하는가? → 배칭 효과 확인
- 진짜로 느린 계산인가? → 먼저 연산 최적화/가상화 고려

---

## 실행 방법

현재 예제 코드는 준비 중입니다. 코드가 추가되면 실행 방법을 업데이트하겠습니다.

---

## 측정 방법

### 1. 입력 반응성

- 입력 타이핑 시 지연/끊김 여부 확인
- Transition 적용 전/후 비교

### 2. React DevTools Profiler

- 렌더링 우선순위와 커밋 시간을 비교
- 동일 입력에 대한 렌더링 횟수 확인

### 3. 사용자 체감

- 탭 전환/필터 변경 시 화면 안정성
- `isPending` 표시로 상태 변화의 예측 가능성 확인

---

## 핵심 요약

- Concurrent Features는 **업데이트 우선순위를 분리**해 UX를 개선
- `useTransition`/`startTransition`으로 비긴급 업데이트를 분리
- `useDeferredValue`로 입력 반응성을 유지
- Automatic Batching으로 렌더링 횟수 감소

---

## 📚 참고 자료 (References)

**React 18 Concurrent Features**

- [React 공식 문서: Transitions](https://react.dev/reference/react/useTransition)
- [React 공식 문서: useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서: Automatic Batching](https://react.dev/blog/2022/03/29/react-v18)

**관련 아티클**

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [Rendering and Commit](https://react.dev/learn/render-and-commit)
