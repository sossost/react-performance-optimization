import React, { useRef } from "react";

interface ButtonWithCallbackProps {
  mode: "before" | "after";
  onClick: () => void;
}

// Before: 매번 새로운 함수 참조로 인한 리렌더링
function ButtonWithCallbackBefore({ onClick }: { onClick: () => void }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div>
      <button
        onClick={onClick}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.9rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        클릭
      </button>
      <div style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
}

// After: React.memo + useCallback으로 함수 메모이제이션하여 리렌더링 방지
const ButtonWithCallbackAfter = React.memo(function ButtonWithCallbackAfter({
  onClick,
}: {
  onClick: () => void;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div>
      <button
        onClick={onClick}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.9rem",
          backgroundColor: "#059669",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        클릭
      </button>
      <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
});

export function ButtonWithCallback({ mode, onClick }: ButtonWithCallbackProps) {
  if (mode === "before") {
    return <ButtonWithCallbackBefore onClick={onClick} />;
  }
  return <ButtonWithCallbackAfter onClick={onClick} />;
}
