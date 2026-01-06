# 예제 11: 컴포넌트 렌더링 최적화

## 목적

React **컴포넌트 렌더링 최적화 기법**을 독립적으로 학습하기 위한 예제입니다.
하나의 프로젝트에서 **Before / After 모드**를 전환하며 구조·성능 차이를 직접 비교할 수 있습니다.

---

## 구조

- **Before 모드**

  - 큰 컴포넌트, 불안정한 key 사용
  - 조건부 렌더링 비최적화
  - 리스트 렌더링 비효율
  - Error Boundary 없음

- **After 모드**

  - 컴포넌트 분리 전략 적용
  - 안정적인 key 사용
  - 조건부 렌더링 최적화
  - 리스트 렌더링 최적화
  - Error Boundary 적용

---

## 📚 이론: 컴포넌트 렌더링 최적화 원리와 전략

## 1. 개요 (Overview)

**컴포넌트 렌더링 최적화**는 React가 컴포넌트를 효율적으로 렌더링하도록 구조와 패턴을 개선하는 기법입니다.

주요 최적화 포인트:

- **컴포넌트 분리**: 큰 컴포넌트를 작은 단위로 분리하여 리렌더링 범위 축소
- **조건부 렌더링 최적화**: 불필요한 렌더링을 방지하고 필요한 부분만 렌더링
- **리스트 렌더링 최적화**: 안정적인 key 사용, 불필요한 리렌더링 방지
- **Error Boundary**: 에러 발생 시 전체 앱이 크래시되지 않도록 보호

---

## 2. 컴포넌트 렌더링 최적화와 성능의 관계

컴포넌트 렌더링 최적화는 성능 최적화에 직접적인 영향을 줍니다.

### 2.1 컴포넌트 분리로 리렌더링 범위 축소

- 큰 컴포넌트는 작은 변경에도 전체가 리렌더링됨
- 작은 컴포넌트로 분리하면 변경된 부분만 리렌더링
- React.memo와 함께 사용 시 효과 극대화

### 2.2 조건부 렌더링 최적화

- 불필요한 조건 체크와 렌더링 방지
- Early return 패턴으로 불필요한 계산 방지
- 렌더링 비용 절감

### 2.3 리스트 렌더링 최적화

- 안정적인 key 사용으로 불필요한 DOM 조작 방지
- 리스트 아이템을 작은 컴포넌트로 분리하여 개별 최적화 가능
- 가상화(Virtualization)와 결합 시 대용량 리스트 처리 가능

### 2.4 Error Boundary로 안정성 향상

- 에러 발생 시 전체 앱 크래시 방지
- 사용자 경험 개선
- 디버깅 용이성 향상

---

## 3. 문제 상황: 비최적화된 컴포넌트 렌더링

### ❌ Bad Case 1: 큰 컴포넌트

```tsx
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});

  return (
    <div>
      {/* 사용자 정보 */}
      <div>
        <h1>{user?.name}</h1>
        <p>{user?.email}</p>
        {/* 많은 JSX */}
      </div>

      {/* 알림 목록 */}
      <div>
        {notifications.map((notif) => (
          <div key={notif.id}>{notif.message}</div>
        ))}
      </div>

      {/* 설정 */}
      <div>{/* 많은 JSX */}</div>
    </div>
  );
}
```

**문제점:**

- `notifications` 변경 시 사용자 정보와 설정도 함께 리렌더링됨
- 컴포넌트가 커서 유지보수 어려움
- 특정 부분만 최적화하기 어려움

### ❌ Bad Case 2: 불안정한 key 사용

```tsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} />
      ))}
    </ul>
  );
}
```

**문제점:**

- `index`를 key로 사용하면 리스트 순서 변경 시 불필요한 리렌더링 발생
- React가 올바르게 DOM을 업데이트하지 못함
- 성능 저하 및 버그 발생 가능

### ❌ Bad Case 3: 비효율적인 조건부 렌더링

```tsx
function Component({ data }) {
  return (
    <div>
      {data && (
        <div>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          {/* 많은 JSX */}
        </div>
      )}
      {!data && <div>로딩 중...</div>}
    </div>
  );
}
```

**문제점:**

- 조건이 변경될 때마다 전체 구조가 재평가됨
- Early return을 사용하지 않아 불필요한 렌더링 발생

---

## 4. 컴포넌트 분리 전략

### 4.1 관심사 분리 (Separation of Concerns)

컴포넌트를 기능별로 분리하여 각각 독립적으로 관리합니다.

```tsx
// Before: 큰 컴포넌트
function UserDashboard() {
  // 모든 로직이 한 곳에
}

// After: 작은 컴포넌트로 분리
function UserDashboard() {
  return (
    <>
      <UserProfile />
      <Notifications />
      <Settings />
    </>
  );
}
```

**장점:**

- 각 컴포넌트가 독립적으로 리렌더링
- 재사용성 향상
- 테스트 용이성 향상
- 유지보수성 향상

### 4.2 컨테이너/프레젠테이션 분리

데이터 로직과 UI를 분리합니다.

```tsx
// Container Component (데이터 로직)
function UserProfileContainer() {
  const [user, setUser] = useState(null);
  // 데이터 페칭 로직
  return <UserProfile user={user} />;
}

// Presentational Component (UI)
function UserProfile({ user }) {
  return <div>{user?.name}</div>;
}
```

---

## 5. 조건부 렌더링 최적화

### 5.1 Early Return 패턴

조건을 먼저 체크하여 불필요한 렌더링을 방지합니다.

```tsx
// Before
function Component({ data }) {
  return <div>{data && <div>{/* 많은 JSX */}</div>}</div>;
}

// After: Early Return
function Component({ data }) {
  if (!data) {
    return <div>로딩 중...</div>;
  }

  return <div>{/* 많은 JSX */}</div>;
}
```

**장점:**

- 조건 체크가 명확함
- 불필요한 JSX 평가 방지
- 가독성 향상

### 5.2 조건부 렌더링 최적화

```tsx
// Before: 매번 객체 생성
function Component({ isVisible }) {
  return (
    <div>{isVisible && <ExpensiveComponent style={{ color: "red" }} />}</div>
  );
}

// After: 조건 외부에서 처리
function Component({ isVisible }) {
  if (!isVisible) {
    return null;
  }

  return <ExpensiveComponent style={{ color: "red" }} />;
}
```

### 5.3 상태 보존/초기화 제어

서로 다른 컴포넌트를 토글할 때는 `key`를 활용해 상태가 섞이지 않도록 제어합니다.

```tsx
// 상태가 공유되어 섞이는 예시 (좋지 않음)
{
  mode === "list" ? <Panel /> : <Panel />;
}

// 상태를 분리하거나 명시적으로 초기화
{
  mode === "list" ? <Panel key="list" /> : <Panel key="detail" />;
}
```

- 같은 컴포넌트를 토글할 때 상태를 유지하려면 같은 key를, 초기화하려면 다른 key를 사용
- 서로 다른 컴포넌트를 번갈아 보여줄 때는 명시적으로 key를 지정해 예기치 않은 상태 공유를 방지

---

## 6. 리스트 렌더링 최적화

### 6.1 안정적인 key 사용

리스트 아이템에 고유하고 안정적인 key를 사용합니다.

```tsx
// Before: index를 key로 사용
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} />
      ))}
    </ul>
  );
}

// After: 고유한 id를 key로 사용
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

**안정적인 key의 조건:**

- 고유성: 각 아이템마다 고유한 값
- 안정성: 리스트 순서가 변경되어도 동일한 아이템은 동일한 key
- 예측 가능성: 아이템이 추가/삭제되어도 key가 예측 가능
- 피해야 하는 key 예시: `index`, `Math.random()`, `Date.now()`처럼 렌더마다 달라지는 값

### 6.2 리스트 아이템 컴포넌트 분리

리스트 아이템을 별도 컴포넌트로 분리하여 최적화합니다.

```tsx
// Before: 인라인 렌더링
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          {/* 많은 JSX */}
        </li>
      ))}
    </ul>
  );
}

// After: 컴포넌트 분리
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

const TodoItem = React.memo(function TodoItem({ todo }) {
  return (
    <li>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      {/* 많은 JSX */}
    </li>
  );
});
```

**장점:**

- 각 아이템이 독립적으로 리렌더링
- React.memo와 함께 사용 시 효과 극대화
- 재사용성 향상

---

## 7. Error Boundary

### 7.1 Error Boundary란?

React 컴포넌트 트리에서 발생한 에러를 catch하고, 에러 UI를 표시하는 컴포넌트입니다.

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### 7.2 Error Boundary 사용

```tsx
function App() {
  return (
    <ErrorBoundary>
      <UserProfile />
      <Notifications />
      <Settings />
    </ErrorBoundary>
  );
}
```

**장점:**

- 에러 발생 시 전체 앱이 크래시되지 않음
- 사용자에게 친화적인 에러 메시지 표시
- 에러 로깅 및 모니터링 가능

**한계와 배치 팁:**

- 렌더 단계, 라이프사이클, 자식 렌더링 중 에러만 포착함
- 이벤트 핸들러, 비동기 콜백(setTimeout, Promise), 서버 요청 에러는 포착하지 못하므로 별도 처리 필요
- 전체를 한 번 감싸는 것 외에, 각 위젯/페이지 단위로 경계(스코프)를 나눠두면 일부만 격리 가능

---

## 8. 컴포넌트 렌더링 최적화 체크리스트

### 컴포넌트 분리

- 컴포넌트가 너무 큰가? → 기능별로 분리
- 재사용 가능한 부분이 있는가? → 별도 컴포넌트로 추출
- 데이터 로직과 UI가 섞여 있는가? → Container/Presentational 분리
- 인라인 함수/객체 때문에 자식이 자주 리렌더링되는가? → `useMemo`/`useCallback` 등으로 참조 안정화 (예제 10 참고)

### 조건부 렌더링

- Early return을 사용할 수 있는가?
- 불필요한 조건 체크가 있는가?
- 조건부 렌더링이 복잡한가? → 별도 컴포넌트로 분리

### 리스트 렌더링

- 안정적인 key를 사용하는가?
- 리스트 아이템이 큰가? → 별도 컴포넌트로 분리
- 리스트가 매우 긴가? → Virtualization 고려

### Error Boundary

- 에러 처리가 필요한 부분이 있는가?
- 사용자에게 친화적인 에러 메시지를 표시하는가?

---

## 실행 방법

```bash
yarn install
yarn dev:e11
```

- 접속: [http://localhost:5184](http://localhost:5184)
- 상단 버튼으로 Before / After 전환
- 각 예제를 테스트하여 차이 확인

---

## 측정 방법

### 1. 리렌더링 횟수

- React DevTools Profiler 사용
- 각 컴포넌트의 리렌더링 횟수 확인
- Before: 큰 컴포넌트 변경 시 전체 리렌더링
- After: 작은 컴포넌트로 분리하여 필요한 부분만 리렌더링

### 2. DOM 조작 횟수

- React DevTools에서 DOM 업데이트 확인
- Before: 불안정한 key로 인한 불필요한 DOM 조작
- After: 안정적인 key로 최소한의 DOM 조작

### 3. 에러 처리

- 에러 발생 시나리오 테스트
- Before: 에러 발생 시 전체 앱 크래시
- After: Error Boundary로 에러 격리 및 처리

---

## 핵심 요약

- 컴포넌트 분리로 리렌더링 범위 축소
- 안정적인 key 사용으로 리스트 렌더링 최적화
- Early return 패턴으로 조건부 렌더링 최적화
- Error Boundary로 안정성 향상
- 작은 컴포넌트는 재사용성과 테스트 용이성 향상

---

## 📚 참고 자료 (References)

**컴포넌트 렌더링 최적화**

- [React 공식 문서: Components and Props](https://react.dev/learn/passing-props-to-a-component) - 컴포넌트 기본 개념
- [React 공식 문서: Lists and Keys](https://react.dev/learn/rendering-lists) - 리스트 렌더링과 key
- [React 공식 문서: Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) - Error Boundary
- [Kent C. Dodds: When to split components](https://kentcdodds.com/blog/when-to-break-up-a-component-into-multiple-components) - 컴포넌트 분리 시기

**성능 최적화**

- [Web.dev: React Performance](https://web.dev/react/) - React 성능 최적화
- [React 공식 문서: Optimizing Performance](https://react.dev/learn/render-and-commit) - 성능 최적화 가이드

**추상화 라이브러리:**

- **react-error-boundary**: Error Boundary를 쉽게 사용할 수 있는 라이브러리
- **react-window / react-virtual**: 대용량 리스트 가상화
- **React.memo**: 컴포넌트 메모이제이션 (예제 10 참고)
