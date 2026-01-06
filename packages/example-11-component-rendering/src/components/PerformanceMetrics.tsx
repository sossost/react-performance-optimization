import type { Mode } from "../types";

interface PerformanceMetricsProps {
  mode: Mode;
}

export function PerformanceMetrics({ mode }: PerformanceMetricsProps) {
  return (
    <div
      style={{
        backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
        border: `1px solid ${mode === "before" ? "#fca5a5" : "#86efac"}`,
        padding: "1rem",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>성능/동작 확인 포인트</h3>
      <ol style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
        <li>
          <strong>Key 안정성:</strong> 각 항목의 메모를 입력한 뒤 리스트를 섞어
          상태가 이동하는지 확인하세요.
        </li>
        <li>
          <strong>조건부 렌더링:</strong> 상세 영역을 숨긴 상태에서 테마를
          전환하고, "계산 횟수"가 증가하는지 확인하세요.
        </li>
        <li>
          <strong>Error Boundary 범위:</strong> 에러를 발생시키고, 영향을 받는
          범위가 전체인지/부분인지 비교하세요.
        </li>
      </ol>
    </div>
  );
}
