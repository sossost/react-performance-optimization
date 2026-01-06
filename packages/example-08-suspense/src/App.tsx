import { useState } from "react";
import { ProgressiveLoading } from "./components/ProgressiveLoading";
import { ParallelFetching } from "./components/ParallelFetching";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { clearCache } from "./utils/suspenseCache";

type Mode = "before" | "after";

export default function App() {
  const [mode, setMode] = useState<Mode>("before");

  const handleModeChange = () => {
    const newMode = mode === "before" ? "after" : "before";
    setMode(newMode);
    // After 모드로 전환 시 캐시 초기화 (새로운 요청을 보여주기 위해)
    if (newMode === "after") {
      clearCache();
    }
  };

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
              ? "수동 로딩 상태 관리 (useState, useEffect)"
              : "Suspense를 통한 선언적 로딩 상태 관리"}
          </p>
        </div>
        <button
          onClick={handleModeChange}
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
          Suspense 최적화 예제
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

      <ProgressiveLoading mode={mode} />
      <ParallelFetching mode={mode} />
    </div>
  );
}
