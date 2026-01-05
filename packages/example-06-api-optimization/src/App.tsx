import { useState } from "react";
import { DataLoader } from "./components/DataLoader";
import { SearchInput } from "./components/SearchInput";
import { RequestDeduplication } from "./components/RequestDeduplication";
import { RequestCancellation } from "./components/RequestCancellation";
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
              ? "비최적화된 API 호출 (Waterfall, 중복 요청, Debouncing 없음)"
              : "최적화된 API 호출 (병렬 요청, 중복 제거, Debouncing 적용)"}
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
          API 호출 최적화 예제
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
        <h2 style={{ marginBottom: "1rem" }}>1. 병렬 요청 vs 순차적 요청</h2>
        <DataLoader mode={mode} />
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>2. 검색 입력 (Debouncing)</h2>
        <SearchInput mode={mode} />
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          3. 중복 요청 제거 (Request Deduplication)
        </h2>
        <RequestDeduplication mode={mode} />
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          4. 요청 취소 (Request Cancellation)
        </h2>
        <RequestCancellation mode={mode} />
      </div>
    </div>
  );
}
