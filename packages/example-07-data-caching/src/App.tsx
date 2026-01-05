import { useState } from "react";
import { UserProfile } from "./components/UserProfile";
import { CacheManagement } from "./components/CacheManagement";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

type Mode = "before" | "after";

export default function App() {
  const [mode, setMode] = useState<Mode>("before");

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
              ? "캐싱 없음 (매번 API 호출)"
              : "캐싱 적용 (메모리 캐싱, TTL, 캐시 무효화)"}
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
          데이터 캐싱 전략 예제
        </h1>
        <p
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          위 버튼을 클릭하여 Before/After를 전환하고 비교해보세요.
        </p>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>1. 사용자 프로필 (캐싱 비교)</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <UserProfile mode={mode} userId={1} />
          <UserProfile mode={mode} userId={2} />
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          💡 <strong>테스트 방법:</strong> 각 사용자를 여러 번 로드해보세요. After 모드에서는
          두 번째 요청부터 캐시에서 반환되어 Network 탭에 요청이 나타나지 않습니다.
        </p>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>2. 캐시 관리</h2>
        <CacheManagement mode={mode} />
      </div>
    </div>
  );
}
