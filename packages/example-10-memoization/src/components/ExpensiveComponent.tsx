import React, { useRef } from "react";

interface ExpensiveComponentProps {
  mode: "before" | "after";
  name: string;
}

// Before: React.memo 없이 구현 - App이 리렌더링되면 무조건 리렌더링
function ExpensiveComponentBefore({ name }: { name: string }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  // 비용이 큰 계산 시뮬레이션
  const expensiveValue = Array.from({ length: 10000 }, (_, i) => i).reduce(
    (sum, i) => sum + i,
    0
  );

  return (
    <div>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
        계산: {expensiveValue.toLocaleString()}
      </p>
      <div style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
}

// After: React.memo로 감싸서 name이 변경될 때만 리렌더링
const ExpensiveComponentAfter = React.memo(function ExpensiveComponentAfter({
  name,
}: {
  name: string;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  // 비용이 큰 계산 시뮬레이션
  const expensiveValue = Array.from({ length: 10000 }, (_, i) => i).reduce(
    (sum, i) => sum + i,
    0
  );

  return (
    <div>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
        계산: {expensiveValue.toLocaleString()}
      </p>
      <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
});

export function ExpensiveComponent({ mode, name }: ExpensiveComponentProps) {
  if (mode === "before") {
    return <ExpensiveComponentBefore name={name} />;
  }
  return <ExpensiveComponentAfter name={name} />;
}
