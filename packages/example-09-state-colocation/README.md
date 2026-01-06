# 예제 9: State Colocation

## 목적

React **State Colocation 최적화 기법**을 독립적으로 학습하기 위한 예제입니다.
하나의 프로젝트에서 **Before / After 모드**를 전환하며 구조·성능 차이를 직접 비교할 수 있습니다.

---

## 구조

- **Before 모드**

  - 모든 상태를 상위 컴포넌트(App)에서 관리
  - 상태 변경 시 넓은 리렌더링 영향 범위
  - Props drilling 발생

- **After 모드**

  - State Colocation 적용
  - 상태를 필요한 위치에 배치
  - 상태 변경 시 영향 범위 최소화

---

## 📚 이론: State Colocation 원리와 전략

## 1. 개요 (Overview)

**State Colocation**은 상태를 *가능한 한 실제로 사용하는 컴포넌트에 가깝게 배치*하여
상태 변경의 **영향 범위(Render Scope)** 를 최소화하는 React 설계 원칙입니다.

> State colocation은 상태를 “아래로 내리는 기술”이 아니라,
> 상태 변경이 영향을 미치는 **범위를 최소화하는 설계 전략**입니다.

---

## 2. State Colocation과 성능의 관계

State Colocation은 성능 최적화에 직접적인 영향을 줍니다.

### 2.1 불필요한 리렌더링 방지

- 상위 컴포넌트에 상태가 있으면, 상태 변경 시 상위 컴포넌트가 리렌더링
- 그 결과, 실제로 해당 상태를 사용하지 않는 하위 컴포넌트도 렌더 함수가 다시 호출될 수 있음
- 상태를 로컬에 두면, 해당 상태를 사용하는 컴포넌트만 리렌더링

### 2.2 메모이제이션 효과 극대화

- 리렌더 시작점이 상위에 있을수록 `React.memo`, `useMemo`의 비교 연산이 자주 발생
- 로컬 상태는 리렌더 시작점을 좁혀 메모이제이션이 실제 성능 이득으로 이어질 확률을 높임

### 2.3 컴포넌트 독립성 향상

- 상태를 내부에서 관리하는 컴포넌트는 외부 의존성이 줄어듦
- 재사용성과 테스트 용이성 증가

---

## 3. 문제 상황: 모든 상태를 상위에서 관리하는 경우

### ❌ Bad Case

```tsx
function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("light");

  return (
    <div>
      <Header theme={theme} setTheme={setTheme} />
      <UserProfile user={user} />
      <PostsList posts={posts} comments={comments} />
      <Notifications notifications={notifications} />
    </div>
  );
}
```

### 문제점

- `theme` 변경 → `App` 리렌더링 → 모든 자식 컴포넌트 렌더 함수 재호출
- `notifications` 변경 → 관련 없는 컴포넌트까지 렌더 영향
- 상태 스코프가 과도하게 넓음
- Props drilling 발생
- 상태 관리 로직이 한 컴포넌트에 집중

---

## 4. State Colocation 기본 원칙

### 4.1 핵심 원칙

1. **단일 컴포넌트에서만 사용되는 상태**

   - → 해당 컴포넌트 내부에 배치

2. **여러 컴포넌트가 공유하는 상태**

   - → 가장 가까운 공통 조상에 배치

3. **전역 상태**

   - → 정말 여러 영역에서 필요한 경우에만 사용

---

## 5. State Colocation 전략

### 5.1 로컬 상태로 이동

```tsx
// Before
function App() {
  const [theme, setTheme] = useState("light");
  return <Header theme={theme} setTheme={setTheme} />;
}

// After
function Header() {
  const [theme, setTheme] = useState("light");
  return <div>{theme}</div>;
}
```

---

### 5.2 가장 가까운 공통 조상에 배치

```tsx
// Before
function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  return (
    <>
      <UserProfile user={user} />
      <PostsList posts={posts} />
    </>
  );
}

// After
function App() {
  return (
    <>
      <UserSection />
      <PostsSection />
    </>
  );
}
```

---

### 5.3 Context 분리 (상태 단위 분리)

```tsx
// Bad
const AppContext = createContext();

// Good
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationsContext = createContext();
```

- 하나의 Context에 여러 상태를 넣으면, 하나의 변경이 전체 소비자에 영향을 줌
- 상태 단위로 Context 분리 시 리렌더 범위 축소 가능

---

## 6. Props Drilling과 State Colocation

### ❌ Props Drilling 발생 예시

```tsx
function App() {
  const [theme, setTheme] = useState("light");
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Header theme={theme} setTheme={setTheme} />;
}
```

### ✅ State Colocation 적용

```tsx
function App() {
  return <Layout />;
}

function Header() {
  return <ThemeToggle />;
}

function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
  );
}
```

> State colocation은 props drilling을 “해결하는 기술”이 아니라,
> **불필요한 상태 끌어올리기를 방지하여 drilling 자체를 줄이는 전략**이다.

---

## 7. 대표적인 State Colocation 적용 사례

### 7.1 폼 상태

```tsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
}
```

### 7.2 UI 상태 (모달, 드롭다운)

```tsx
function Dropdown() {
  const [open, setOpen] = useState(false);
}
```

### 7.3 섹션 단위 상태

```tsx
function UserSection() {
  const [user, setUser] = useState(null);
}
```

---

## 8. 전역 상태가 적합한 경우

전역 상태는 **악이 아니며**, 아래와 같은 경우에는 자연스럽습니다.

- 인증 정보
- 테마 / 다크모드
- 언어 설정
- 전역 알림

반대로, 다음은 전역 상태로 관리할 필요가 없습니다.

- 폼 입력 값
- 모달 열림 여부
- 드롭다운 토글 상태

---

## 9. State Colocation 판단 체크리스트

- 이 상태를 **몇 개 컴포넌트가 사용하는가?**

  - 1개 → 로컬
  - 동일 섹션 2~3개 → 공통 조상
  - 앱 전반 → 전역 고려

- UI 상태인가?

  - → 로컬

- 서버 캐시 데이터인가?

  - → React state 대신 데이터 캐시 계층 고려

---

## 10. 주의사항

### 10.1 무분별한 로컬화의 위험

- 동일한 상태가 여러 컴포넌트에 중복 생성될 수 있음
- 컴포넌트 unmount 시 상태 초기화
- 공유가 필요한 상태를 억지로 분리하면 동기화 문제가 발생

> 목적은 “아래로 내리기”가 아니라 **올바른 스코프 설정**이다.

---

## 실행 방법

```bash
yarn install
yarn dev:e9
```

- 접속: [http://localhost:5182](http://localhost:5182)
- 상단 버튼으로 Before / After 전환

---

## 측정 방법

### 1. 리렌더링 횟수

- React DevTools Profiler 사용
- 상태 변경 시 렌더 영향 범위 확인

### 2. Props 전달 구조

- Before: 상태가 사용되지 않는 컴포넌트를 통과
- After: 상태 전달 체인 제거

### 3. 코드 복잡도

- 상태 관리 로직 분산 여부 확인

---

## 핵심 요약

- State Colocation은 **성능 최적화 기법이자 설계 원칙**
- 상태 변경의 **영향 범위를 최소화**하는 것이 목표
- 전역 상태는 “편해서”가 아니라 “필요해서” 사용

---

## 📚 참고 자료 (References)

**State Colocation 가이드**

- [React 공식 문서: Lifting State Up](https://react.dev/learn/sharing-state-between-components) - 상태 끌어올리기
- [React 공식 문서: State Colocation](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster) - State Colocation 가이드
- [Web.dev: React Performance](https://web.dev/react/) - React 성능 최적화

**상태 관리 라이브러리**

- [Zustand](https://github.com/pmndrs/zustand) - 경량 상태 관리 라이브러리
- [Jotai](https://jotai.org/) - 원자적 상태 관리
- [Recoil](https://recoiljs.org/) - Facebook의 상태 관리 라이브러리

**추상화 라이브러리:**

- **Zustand**: 경량 상태 관리, State Colocation 원칙을 잘 따름
- **Jotai**: 원자적 상태 관리, 컴포넌트별로 상태 분리 용이
- **Recoil**: 선택적 구독, 필요한 컴포넌트만 리렌더링
