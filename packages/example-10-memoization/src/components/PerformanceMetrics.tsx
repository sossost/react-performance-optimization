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
            Before 모드: 상위 컴포넌트 리렌더링 시 모든 하위 컴포넌트도 리렌더링됨
            <br />
            After 모드: props가 변경되지 않으면 리렌더링 건너뜀
          </span>
        </li>
        <li>
          <strong>계산 실행 횟수:</strong> FilteredList 컴포넌트의 "계산 실행 횟수" 확인
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Before 모드: 매번 필터링 계산 실행
            <br />
            After 모드: items나 filter 변경 시에만 재계산
          </span>
        </li>
        <li>
          <strong>React DevTools Profiler:</strong> 개발자 도구 &gt; Profiler &gt; Record
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            각 버튼을 클릭하여 리렌더링 영향 범위를 시각적으로 확인하세요
          </span>
        </li>
      </ol>
    </div>
  );
}

