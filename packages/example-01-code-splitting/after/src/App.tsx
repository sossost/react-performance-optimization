import { useState, Suspense, lazy } from "react";
// ✅ After: 무거운 라이브러리들을 dynamic import (필요할 때만 로드)
const HeavyChart = lazy(() =>
  import("./components/HeavyChart").then((module) => ({
    default: module.HeavyChart,
  }))
);
const HeavyTable = lazy(() =>
  import("./components/HeavyTable").then((module) => ({
    default: module.HeavyTable,
  }))
);
const HeavyCalculator = lazy(() =>
  import("./components/HeavyCalculator").then((module) => ({
    default: module.HeavyCalculator,
  }))
);
const HeavyDataProcessor = lazy(() =>
  import("./components/HeavyDataProcessor").then((module) => ({
    default: module.HeavyDataProcessor,
  }))
);
import { PerformanceMetrics } from './components/PerformanceMetrics'

export default function App() {
  const [showComponents, setShowComponents] = useState(false);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#d1fae5",
          border: "1px solid #6ee7b7",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", color: "#065f46" }}>
          ✅ After: Code Splitting 적용
        </h2>
        <p style={{ margin: 0, color: "#047857" }}>
          데이터 처리 라이브러리(lodash, ramda, axios), 날짜 라이브러리(moment, date-fns)가 별도 청크로 분리되어 있습니다.
          <br />
          Network 탭에서 버튼 클릭 시에만 해당 청크가 로드되는 것을 확인하세요.
        </p>
      </div>

      <PerformanceMetrics variant="after" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>메인 콘텐츠</h2>
        <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
          이 페이지는 간단한 텍스트 콘텐츠만 표시합니다.
          <br />
          아래 컴포넌트들은 버튼을 클릭해야만 로드되고 표시됩니다.
          <br />
          <strong style={{ color: "#059669" }}>초기 로딩이 빠릅니다!</strong>
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowComponents(!showComponents)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            {showComponents ? "컴포넌트 숨기기" : "컴포넌트 보기"}
          </button>
        </div>
      </div>

      {showComponents && (
        <Suspense
          fallback={
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <p>컴포넌트 로딩 중... (lodash, moment, date-fns, ramda, axios 다운로드 중)</p>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "1rem" }}>무거운 데이터 처리 컴포넌트 (lodash, ramda, moment, date-fns)</h3>
              <HeavyChart />
            </div>
            <HeavyTable />
            <HeavyCalculator />
            <HeavyDataProcessor />
          </div>
        </Suspense>
      )}
    </div>
  );
}

