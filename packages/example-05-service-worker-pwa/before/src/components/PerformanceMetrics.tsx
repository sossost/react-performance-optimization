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
            첫 로드 후 다시 새로고침하면 캐시에서 로드되는지 확인하세요
          </span>
        </li>
        <li>
          <strong>Application 탭:</strong> 개발자 도구 &gt; Application
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Service Workers와 Cache Storage에서 캐싱 상태를 확인하세요
          </span>
        </li>
        <li>
          <strong>오프라인 테스트:</strong> Network 탭 &gt; Throttling &gt; Offline
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            오프라인 모드에서 페이지가 작동하는지 확인하세요
          </span>
        </li>
      </ol>
    </div>
  );
}

