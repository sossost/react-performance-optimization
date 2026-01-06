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
      <h3 style={{ marginBottom: "0.5rem" }}>성능 확인 가이드</h3>
      <ol style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
        <li>
          <strong>항목 수를 10,000개로 설정</strong>하고 Before 리스트의
          스크롤 지연과 After 리스트의 부드러움을 비교하세요.
        </li>
        <li>
          <strong>렌더링된 DOM 노드 수</strong>가 Before는 전체 항목 수와 동일하고,
          After는 화면에 보이는 항목 수만큼만 유지되는지 확인하세요.
        </li>
        <li>
          <strong>Overscan</strong> 값을 늘리면 스크롤은 부드러워지지만
          렌더링된 DOM 노드 수가 증가하는 것을 확인하세요.
        </li>
        <li>
          <strong>React DevTools Profiler</strong>로 Before/After의 커밋 시간을
          비교하면 차이를 더 명확히 볼 수 있습니다.
        </li>
      </ol>
    </div>
  );
}
