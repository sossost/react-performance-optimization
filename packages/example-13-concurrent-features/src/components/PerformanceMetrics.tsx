export function PerformanceMetrics() {
  return (
    <div
      style={{
        backgroundColor: "#eff6ff",
        border: "1px solid #bfdbfe",
        padding: "1rem",
        borderRadius: "0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>확인 포인트</h3>
      <ol style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
        <li>
          <strong>Before</strong>에서 입력을 빠르게 바꾸면 타이핑이 끊기는지
          확인하세요.
        </li>
        <li>
          <strong>After</strong>는 입력값이 즉시 바뀌고, 리스트는 지연 업데이트되며
          <strong>Pending</strong> 상태가 표시됩니다.
        </li>
        <li>
          <strong>연산 강도</strong>를 높이면 차이가 더 크게 체감됩니다.
        </li>
        <li>
          DevTools Profiler로 Transition 커밋 시간을 비교하면 더 명확합니다.
        </li>
      </ol>
    </div>
  );
}
