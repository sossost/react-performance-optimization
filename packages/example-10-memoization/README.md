# 예제 10: Memoization

## 목적

React **Memoization 최적화 기법**을 독립적으로 학습하기 위한 예제입니다.
하나의 프로젝트에서 **Before / After 모드**를 전환하며 구조·성능 차이를 직접 비교할 수 있습니다.

---

## 구조

- **Before 모드**

  - Memoization 없음
  - 모든 상태 변경 시 모든 컴포넌트가 리렌더링됨
  - 불필요한 계산이 매번 실행됨
  - 매번 새로운 함수/객체 생성으로 하위 컴포넌트도 리렌더링

- **After 모드**

  - React.memo, useMemo, useCallback 적용
  - 관련 없는 상태 변경 시 해당 컴포넌트는 리렌더링되지 않음
  - 계산 결과를 캐싱하여 의존성 변경 시에만 재계산
  - 함수/객체 참조를 안정적으로 유지하여 불필요한 리렌더링 방지

- **레이아웃**

  - 2x2 그리드 레이아웃으로 모든 예제를 한 화면에서 비교
  - 상단에 상태 변경 버튼 배치로 테스트 용이
  - 각 컴포넌트의 리렌더링 횟수를 실시간으로 확인 가능

---

## 📚 이론: Memoization 원리와 전략

## 1. 개요 (Overview)

**Memoization**은 이전에 계산한 결과를 메모리에 저장하여, 동일한 입력에 대해 다시 계산하지 않고 저장된 결과를 재사용하는 최적화 기법입니다.

React에서 Memoization은 다음과 같은 목적으로 사용됩니다:

- **불필요한 리렌더링 방지**: props나 state가 변경되지 않았을 때 컴포넌트 리렌더링 방지
- **비용이 큰 계산 최적화**: 복잡한 계산 결과를 캐싱하여 재사용
- **참조 동일성 유지**: 함수나 객체의 참조를 안정적으로 유지하여 하위 컴포넌트 리렌더링 방지

---

## 2. Memoization과 성능의 관계

Memoization은 성능 최적화에 직접적인 영향을 줍니다.

### 2.1 불필요한 리렌더링 방지

- 상위 컴포넌트가 리렌더링될 때, props가 변경되지 않은 하위 컴포넌트도 렌더 함수가 호출될 수 있음
- `React.memo`를 사용하면 props가 변경되지 않았을 때 리렌더링을 건너뜀
- 렌더링 비용이 큰 컴포넌트에서 특히 효과적

### 2.2 비용이 큰 계산 최적화

- 복잡한 계산(필터링, 정렬, 변환 등)을 매번 실행하면 성능 저하
- `useMemo`로 계산 결과를 캐싱하여 의존성이 변경될 때만 재계산
- 메모리와 계산 시간의 트레이드오프를 고려해야 함

### 2.3 참조 동일성 유지

- 함수나 객체를 매번 새로 생성하면 하위 컴포넌트가 불필요하게 리렌더링됨
- `useCallback`, `useMemo`로 참조를 안정적으로 유지
- Context Provider의 value 객체에도 적용 가능

---

## 3. 문제 상황: Memoization 없이 모든 컴포넌트가 리렌더링되는 경우

### ❌ Bad Case

```tsx
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("홍길동");

  // 매번 새로운 함수 생성
  const handleClick = () => {
    console.log("클릭됨");
  };

  // 매번 새로운 객체 생성
  const user = { name, age: 30 };

  // 매번 복잡한 계산 실행
  const expensiveValue = heavyCalculation(count);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent user={user} onClick={handleClick} />
      <DisplayValue value={expensiveValue} />
    </div>
  );
}

function ExpensiveComponent({ user, onClick }) {
  // props가 변경되지 않아도 App이 리렌더링되면 이 컴포넌트도 리렌더링됨
  console.log("ExpensiveComponent 렌더링");
  return <div>{user.name}</div>;
}
```

### 문제점

- `count` 변경 시 `ExpensiveComponent`도 불필요하게 리렌더링됨
- `handleClick` 함수가 매번 새로 생성되어 참조가 변경됨
- `user` 객체가 매번 새로 생성되어 참조가 변경됨
- `expensiveValue` 계산이 매번 실행됨

---

## 4. React Memoization API

### 4.1 React.memo

컴포넌트를 메모이제이션하여 props가 변경되지 않았을 때 리렌더링을 건너뜁니다.

```tsx
const MemoizedComponent = React.memo(Component, arePropsEqual?);
```

**기본 동작:**

- props를 얕은 비교(shallow comparison)하여 변경 여부 확인
- 변경되지 않았으면 이전 렌더 결과 재사용

**커스텀 비교 함수:**

```tsx
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  // true를 반환하면 리렌더링 건너뜀 (props가 같다고 판단)
  // false를 반환하면 리렌더링 (props가 다르다고 판단)
  return prevProps.id === nextProps.id;
});
```

**주의사항:**

- 얕은 비교만 수행하므로, 중첩된 객체나 배열의 변경은 감지하지 못할 수 있음
- props가 자주 변경되는 컴포넌트에는 오히려 성능 저하 (비교 비용)
- 모든 컴포넌트에 적용하는 것은 권장하지 않음

### 4.2 useMemo

비용이 큰 계산 결과를 메모이제이션합니다.

```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

**사용 시기:**

- 비용이 큰 계산 (필터링, 정렬, 변환 등)
- 객체나 배열 생성 (참조 동일성 유지)
- 의존성이 자주 변경되지 않는 경우

**주의사항:**

- 메모이제이션 자체에도 비용이 있으므로, 모든 계산에 적용하지 말 것
- 의존성 배열을 정확히 지정해야 함
- 메모리 사용량 증가 가능

### 4.3 useCallback

함수를 메모이제이션하여 참조 동일성을 유지합니다.

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**사용 시기:**

- 자식 컴포넌트에 함수를 props로 전달할 때
- useEffect, useMemo 등의 의존성 배열에 함수를 포함할 때
- Context Provider의 value에 함수를 포함할 때

**주의사항:**

- `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 동일
- 의존성을 정확히 지정해야 함
- 모든 함수에 적용할 필요는 없음

---

## 5. Memoization 전략

### 5.1 컴포넌트 메모이제이션

```tsx
// Before
function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

// After
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});
```

### 5.2 계산 결과 메모이제이션

```tsx
// Before
function App() {
  const [items, setItems] = useState([...]);
  const [filter, setFilter] = useState("");

  // 매번 필터링 계산 실행
  const filteredItems = items.filter((item) =>
    item.name.includes(filter)
  );

  return <ItemList items={filteredItems} />;
}

// After
function App() {
  const [items, setItems] = useState([...]);
  const [filter, setFilter] = useState("");

  // filter나 items가 변경될 때만 재계산
  const filteredItems = useMemo(
    () => items.filter((item) => item.name.includes(filter)),
    [items, filter]
  );

  return <ItemList items={filteredItems} />;
}
```

### 5.3 함수 메모이제이션

```tsx
// Before
function App() {
  const [count, setCount] = useState(0);

  // 매번 새로운 함수 생성
  const handleClick = () => {
    console.log("클릭됨", count);
  };

  return <Button onClick={handleClick} />;
}

// After
function App() {
  const [count, setCount] = useState(0);

  // count가 변경될 때만 새로운 함수 생성
  const handleClick = useCallback(() => {
    console.log("클릭됨", count);
  }, [count]);

  return <Button onClick={handleClick} />;
}
```

0버

### 5.4 객체/배열 메모이제이션

```tsx
// Before
function App() {
  const [name, setName] = useState("홍길동");
  const [age, setAge] = useState(30);

  // 매번 새로운 객체 생성
  const user = { name, age };

  return <UserProfile user={user} />;
}

// After
function App() {
  const [name, setName] = useState("홍길동");
  const [age, setAge] = useState(30);

  // name이나 age가 변경될 때만 새로운 객체 생성
  const user = useMemo(() => ({ name, age }), [name, age]);

  return <UserProfile user={user} />;
}
```

---

## 6. Context 최적화

Context Provider의 value 객체도 메모이제이션해야 합니다.

```tsx
// Before
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  // 매번 새로운 객체 생성 → 모든 Consumer가 리렌더링됨
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Child />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// After
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  // 메모이제이션하여 참조 동일성 유지
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        <Child />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

**더 나은 방법: Context 분리**

```tsx
// 상태와 setter를 분리하여 더 세밀한 제어
const UserContext = createContext();
const UserDispatchContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        <Child />
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
```

---

## 7. Memoization 판단 기준

### 언제 사용해야 할까?

**React.memo 사용:**

- 렌더링 비용이 큰 컴포넌트
- props가 자주 변경되지 않는 컴포넌트
- 리스트의 항목 컴포넌트

**useMemo 사용:**

- 비용이 큰 계산 (필터링, 정렬, 변환 등)
- 객체나 배열 생성 (참조 동일성 유지)
- 의존성이 자주 변경되지 않는 경우

**useCallback 사용:**

- 자식 컴포넌트에 함수를 props로 전달
- useEffect, useMemo 등의 의존성 배열에 함수 포함
- Context Provider의 value에 함수 포함

### 언제 사용하지 말아야 할까?

- props가 자주 변경되는 컴포넌트 (비교 비용이 더 큼)
- 간단한 계산 (메모이제이션 비용이 더 큼)
- 모든 곳에 적용 (과도한 최적화는 오히려 성능 저하)

---

## 8. 주의사항

### 8.1 과도한 Memoization

- 모든 컴포넌트와 계산에 Memoization을 적용하면 오히려 성능 저하
- 메모이제이션 자체에도 비용이 있음
- 필요한 곳에만 선택적으로 적용

### 8.2 의존성 배열 관리

- 의존성을 정확히 지정하지 않으면 버그 발생 가능
- ESLint의 `exhaustive-deps` 규칙 활용
- 의존성이 자주 변경되면 Memoization 효과 감소

### 8.3 얕은 비교의 한계

- `React.memo`는 얕은 비교만 수행
- 중첩된 객체나 배열의 변경은 감지하지 못할 수 있음
- 필요시 커스텀 비교 함수 사용

---

## 9. 코드 스멜: Memoization을 남용하는 경우

- `useMemo` / `useCallback`을 `exhaustive-deps` 경고를 지우기 위해 사용 → 의존성 누락과 버그로 이어짐
- 매 렌더마다 값이 바뀌는 props를 가진 컴포넌트를 무조건 `React.memo`로 감쌈 → 비교 비용만 늘고 효과 없음
- 네트워크 요청이나 사이드이펙트를 `useMemo` 내부에서 실행 → effect 훅으로 분리해야 함
- 아주 짧은 리스트나 간단한 연산까지 `useMemo`로 감쌈 → 메모이제이션 오버헤드가 더 큼
- Context value를 메모이제이션하지 않은 채 children만 `React.memo`로 감쌈 → 상위 value 참조가 매번 바뀌어 리렌더링 발생

## 10. 실전 적용 체크리스트

- 렌더링 비용이 큰 자식이고 props 변동이 드문가? → `React.memo` 고려
- O(n) 이상 계산(정렬, 필터, 변환)이 있고 의존성이 자주 바뀌지 않는가? → `useMemo`로 결과 캐싱
- 자식에 내려보내는 핸들러/콜백이 있는가? → `useCallback`으로 참조 안정화, 또는 핸들러가 필요한 위치로 상태를 옮길지 검토
- Context Provider의 `value`에 객체나 함수가 있는가? → `useMemo`로 안정화하거나 Context를 분리
- 메모이제이션 전후 렌더 횟수·계산 횟수를 DevTools나 로그로 확인했는가? → 실제 이득이 있을 때만 유지

---

## 실행 방법

```bash
yarn install
yarn dev:e10
```

- 접속: [http://localhost:5183](http://localhost:5183)
- 상단 버튼으로 Before / After 전환
- 상태 변경 버튼들을 클릭하여 리렌더링 동작 확인
- 2x2 그리드 레이아웃으로 모든 예제를 한 화면에서 비교 가능

---

## 측정 방법

### 1. 리렌더링 횟수 확인

- 각 컴포넌트 하단에 표시된 "리렌더링: N회" 확인
- **Before 모드**:
  - `count` 변경 시 → 모든 컴포넌트 리렌더링
  - `name` 변경 시 → 모든 컴포넌트 리렌더링
- **After 모드**:
  - `count` 변경 시 → React.memo 예제만 리렌더링 안 됨 (name만 받음)
  - `name` 변경 시 → React.memo 예제만 리렌더링됨
  - `count`/`name` 변경 시 → useMemo, useCallback, 객체 메모이제이션 예제는 리렌더링 안 됨

### 2. 계산 실행 횟수 확인

- FilteredList 컴포넌트의 "계산: N회" 확인
- **Before 모드**: `count`나 `name` 변경 시에도 계산 실행 횟수 증가
- **After 모드**: `items`나 `filter` 변경 시에만 계산 실행 횟수 증가

### 3. 실전 테스트 방법

1. **Before 모드에서 테스트**:

   - "Count 증가" 버튼 클릭 → 모든 컴포넌트의 리렌더링 횟수 증가 확인
   - "Name 변경" 버튼 클릭 → 모든 컴포넌트의 리렌더링 횟수 증가 확인

2. **After 모드로 전환 후 테스트**:

   - "Count 증가" 버튼 클릭 → React.memo 예제는 리렌더링 안 됨 (name만 받음)
   - "Name 변경" 버튼 클릭 → React.memo 예제만 리렌더링됨
   - 다른 예제들(useMemo, useCallback, 객체 메모이제이션)은 리렌더링 안 됨

3. **React DevTools Profiler 사용**:
   - 개발자 도구 > Profiler > Record
   - 상태 변경 버튼 클릭
   - Before/After 모드의 렌더링 차이를 시각적으로 확인

---

## 핵심 요약

- Memoization은 **불필요한 리렌더링과 계산을 방지**하는 최적화 기법
- `React.memo`: 컴포넌트 리렌더링 방지
- `useMemo`: 계산 결과 캐싱
- `useCallback`: 함수 참조 동일성 유지
- **필요한 곳에만 선택적으로 적용**해야 함

---

## 📚 참고 자료 (References)

**Memoization 가이드**

- [React 공식 문서: React.memo](https://react.dev/reference/react/memo) - React.memo API
- [React 공식 문서: useMemo](https://react.dev/reference/react/useMemo) - useMemo API
- [React 공식 문서: useCallback](https://react.dev/reference/react/useCallback) - useCallback API
- [Kent C. Dodds: When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback) - Memoization 사용 시기

**성능 최적화**

- [Web.dev: React Performance](https://web.dev/react/) - React 성능 최적화
- [React 공식 문서: Optimizing Performance](https://react.dev/learn/render-and-commit) - 성능 최적화 가이드

**추상화 라이브러리:**

- **React Query / TanStack Query**: 자동 캐싱 및 메모이제이션
- **SWR**: 자동 재검증 및 메모이제이션
- **Zustand**: 선택적 구독으로 불필요한 리렌더링 방지
- **Jotai**: 원자적 상태 관리로 세밀한 메모이제이션 제어
