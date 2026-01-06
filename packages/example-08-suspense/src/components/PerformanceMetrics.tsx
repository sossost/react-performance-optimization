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
          <strong>Network 탭:</strong> 개발자 도구 &gt; Network &gt; 새로고침
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            요청 시작 시점과 총 소요 시간을 확인하세요. After 모드에서는 병렬 요청을 확인할 수 있습니다.
          </span>
        </li>
        <li>
          <strong>Performance 탭:</strong> 개발자 도구 &gt; Performance &gt; Record
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Progressive Loading과 병렬 페칭의 차이를 확인하세요.
          </span>
        </li>
        <li>
          <strong>화면 렌더링:</strong> 실제 화면에서 콘텐츠가 점진적으로 나타나는지 확인
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            After 모드에서는 빠른 데이터부터 먼저 표시됩니다.
          </span>
        </li>
      </ol>
    </div>
  );
}

