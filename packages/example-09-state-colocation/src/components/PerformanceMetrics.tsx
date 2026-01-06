interface PerformanceMetricsProps {
  mode: "before" | "after";
}

export function PerformanceMetrics({ mode }: PerformanceMetricsProps) {
  return (
    <div
      style={{
        backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
        border: `1px solid ${mode === "before" ? "#fca5a5" : "#86efac"}`,
        padding: "1rem",
        borderRadius: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>성능 측정 방법</h3>
      <ol style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
        <li>
          <strong>리렌더링 횟수:</strong> 각 컴포넌트 하단의 "리렌더링 횟수" 확인
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Before 모드: 하나의 상태 변경 시 모든 컴포넌트가 리렌더링됨
            <br />
            After 모드: 해당 상태를 가진 컴포넌트만 리렌더링됨
          </span>
        </li>
        <li>
          <strong>React DevTools Profiler:</strong> 개발자 도구 &gt; Profiler &gt; Record
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            상태 변경 시 렌더 영향 범위를 시각적으로 확인하세요
          </span>
        </li>
        <li>
          <strong>Props 전달 구조:</strong> Layout 컴포넌트 코드 확인
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Before: 상태가 사용되지 않는 컴포넌트를 통과 (Props Drilling)
            <br />
            After: 상태 전달 체인 제거
          </span>
        </li>
      </ol>
    </div>
  );
}

