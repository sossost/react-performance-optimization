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
            같은 데이터를 여러 번 요청할 때 실제 네트워크 요청이 발생하는지 확인하세요
          </span>
        </li>
        <li>
          <strong>콘솔 로그:</strong> 개발자 도구 &gt; Console
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            캐시 히트/미스 로그를 확인하세요
          </span>
        </li>
        <li>
          <strong>캐시 관리:</strong> After 모드에서 캐시 상태와 무효화 기능을 확인하세요
          <br />
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            캐시 삭제 후 다시 요청하면 네트워크 요청이 발생합니다
          </span>
        </li>
      </ol>
    </div>
  );
}

