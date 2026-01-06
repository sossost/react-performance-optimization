import React, { useState } from "react";
import { ExpensiveComponent } from "./components/ExpensiveComponent";
import { FilteredList } from "./components/FilteredList";
import { ButtonWithCallback } from "./components/ButtonWithCallback";
import { UserProfile } from "./components/UserProfile";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

type Mode = "before" | "after";

export default function App() {
  const [mode, setMode] = useState<Mode>("before");

  // 독립적인 상태들
  const [count, setCount] = useState(0);
  const [name, setName] = useState("홍길동");
  const [filter, setFilter] = useState("");
  const [userName, setUserName] = useState("홍길동");
  const [userAge, setUserAge] = useState(30);

  // Before 모드: 매번 새로운 함수 생성
  const handleClickBefore = () => {
    console.log("클릭됨");
  };

  // Before 모드: 매번 새로운 객체 생성
  const userBefore = { name: userName, age: userAge };

  // After 모드: useCallback으로 함수 메모이제이션
  const handleClickAfter = React.useCallback(() => {
    console.log("클릭됨");
  }, []);

  // After 모드: useMemo로 객체 메모이제이션
  const userAfter = React.useMemo(
    () => ({ name: userName, age: userAge }),
    [userName, userAge]
  );

  // 아이템 목록 - After 모드에서는 메모이제이션
  const items = React.useMemo(
    () => [
      { id: 1, name: "사과" },
      { id: 2, name: "바나나" },
      { id: 3, name: "오렌지" },
      { id: 4, name: "포도" },
      { id: 5, name: "딸기" },
    ],
    []
  );

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
          border: `1px solid ${mode === "before" ? "#fca5a5" : "#86efac"}`,
          borderRadius: "0.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.8rem" }}>
            {mode === "before" ? "❌ Before" : "✅ After"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: mode === "before" ? "#7f1d1d" : "#047857",
            }}
          >
            {mode === "before"
              ? "Memoization 없음 - 모든 컴포넌트 리렌더링"
              : "Memoization 적용 - 필요한 컴포넌트만 리렌더링"}
          </p>
        </div>
        <button
          onClick={() => setMode(mode === "before" ? "after" : "before")}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: mode === "before" ? "#dc2626" : "#059669",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          {mode === "before" ? "→ After 보기" : "← Before 보기"}
        </button>
      </div>

      <PerformanceMetrics mode={mode} />

      {/* 상태 변경 버튼들 */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>
          상태 변경 테스트
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            onClick={() => setCount(count + 1)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Count: {count}
          </button>
          <button
            onClick={() => setName(name === "홍길동" ? "김철수" : "홍길동")}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Name: {name}
          </button>
          <button
            onClick={() =>
              setUserName(userName === "홍길동" ? "김철수" : "홍길동")
            }
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            사용자명: {userName}
          </button>
          <button
            onClick={() => setUserAge(userAge + 1)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            나이: {userAge}
          </button>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#666" }}>
          💡 <strong>After 모드</strong>에서 위 버튼을 클릭하면, 관련 없는
          컴포넌트는 리렌더링되지 않습니다.
        </p>
      </div>

      {/* 그리드 레이아웃으로 모든 예제를 한 화면에 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* 1. React.memo 예제 */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
            1. React.memo
          </h3>
          <p
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            {mode === "before"
              ? "❌ count 변경 시에도 리렌더링"
              : "✅ name 변경 시에만 리렌더링"}
          </p>
          <ExpensiveComponent mode={mode} name={name} />
        </div>

        {/* 2. useMemo 예제 */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
            2. useMemo
          </h3>
          <p
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            {mode === "before"
              ? "❌ count/name 변경 시에도 계산 실행"
              : "✅ items/filter 변경 시에만 계산"}
          </p>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="검색..."
            style={{
              width: "100%",
              padding: "0.4rem",
              fontSize: "0.9rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              marginBottom: "0.75rem",
            }}
          />
          <FilteredList mode={mode} items={items} filter={filter} />
        </div>

        {/* 3. useCallback 예제 */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
            3. useCallback
          </h3>
          <p
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            {mode === "before"
              ? "❌ count/name 변경 시마다 리렌더링"
              : "✅ 함수 참조 안정적 → 리렌더링 안 됨"}
          </p>
          <ButtonWithCallback
            mode={mode}
            onClick={mode === "before" ? handleClickBefore : handleClickAfter}
          />
        </div>

        {/* 4. 객체 메모이제이션 예제 */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
            4. 객체 메모이제이션
          </h3>
          <p
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            {mode === "before"
              ? "❌ count/name 변경 시마다 리렌더링"
              : "✅ user 변경 시에만 리렌더링"}
          </p>
          <UserProfile
            mode={mode}
            user={mode === "before" ? userBefore : userAfter}
          />
        </div>
      </div>
    </div>
  );
}
