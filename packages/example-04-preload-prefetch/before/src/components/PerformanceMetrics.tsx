interface PerformanceMetricsProps {
  variant: "before" | "after";
}

export function PerformanceMetrics({ variant }: PerformanceMetricsProps) {
  return (
    <div
      style={{
        backgroundColor: variant === "before" ? "#fee2e2" : "#d1fae5",
        border: `1px solid ${variant === "before" ? "#fca5a5" : "#86efac"}`,
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
            리소스 로딩 순서와 시작 시점을 확인하세요
          </span>
        </li>
        <li>
          <strong>Performance 탭:</strong> 개발자 도구 &gt; Performance &gt; Record
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Network 트랙에서 리소스 로딩 시작 시점을 비교하세요
          </span>
        </li>
      </ol>
    </div>
  );
}

