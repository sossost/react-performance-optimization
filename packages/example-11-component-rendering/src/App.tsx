import { useState } from "react";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { KeyListDemo } from "./components/KeyListDemo";
import { ConditionalRenderDemo } from "./components/ConditionalRenderDemo";
import { ErrorBoundaryDemo } from "./components/ErrorBoundaryDemo";
import type { Mode } from "./types";

export default function App() {
  const [mode, setMode] = useState<Mode>("before");

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
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
              ? "렌더링 구조 미정리 - key 불안정, 계산 낭비, 넓은 오류 범위"
              : "구조적 최적화 - 안정적인 key, 조기 반환, 오류 범위 축소"}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        <KeyListDemo mode={mode} />
        <ConditionalRenderDemo mode={mode} />
      </div>

      <ErrorBoundaryDemo mode={mode} />
    </div>
  );
}
