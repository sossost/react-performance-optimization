import { useState } from "react";
import { Layout } from "./components/Layout";
import { UserProfile } from "./components/UserProfile";
import { Notifications } from "./components/Notifications";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

type Mode = "before" | "after";

export default function App() {
  const [mode, setMode] = useState<Mode>("before");

  // Before 모드: 모든 상태를 App에서 관리
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({ name: "홍길동", email: "hong@example.com" });
  const [notifications, setNotifications] = useState<string[]>(["알림 1", "알림 2"]);
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
          border: `1px solid ${mode === "before" ? "#fca5a5" : "#86efac"}`,
          borderRadius: "0.5rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 0.5rem 0",
              color: mode === "before" ? "#991b1b" : "#065f46",
            }}
          >
            {mode === "before" ? "❌ Before" : "✅ After"}
          </h2>
          <p
            style={{
              margin: 0,
              color: mode === "before" ? "#7f1d1d" : "#047857",
              fontSize: "0.9rem",
            }}
          >
            {mode === "before"
              ? "전역 상태 관리 (모든 상태를 App에서 관리)"
              : "State Colocation (상태를 필요한 곳에 배치)"}
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

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          State Colocation 최적화 예제
        </h1>
        <p
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          위 버튼을 클릭하여 Before/After를 전환하고 비교해보세요.
          <br />
          각 버튼을 클릭하여 리렌더링 동작을 확인하세요.
        </p>
      </div>

      {mode === "before" ? (
        <>
          <Layout mode={mode} theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} />
          <UserProfile mode={mode} user={user} setUser={setUser} />
          <Notifications mode={mode} notifications={notifications} setNotifications={setNotifications} />
        </>
      ) : (
        <>
          <Layout mode={mode} />
          <UserProfile mode={mode} />
          <Notifications mode={mode} />
        </>
      )}
    </div>
  );
}

