import { useState } from "react";
import type { Mode } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";
import { ErrorBoundary } from "./ErrorBoundary";

interface ErrorBoundaryDemoProps {
  mode: Mode;
}

export function ErrorBoundaryDemo({ mode }: ErrorBoundaryDemoProps) {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setShouldThrow(false);
    setResetKey((prev) => prev + 1);
  };

  const content = (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <SafeWidget />
      <CrashyWidget key={resetKey} shouldThrow={shouldThrow} />
    </div>
  );

  return (
    <section
      style={{
        marginTop: "1rem",
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
        3. Error Boundary 범위
      </h3>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        에러가 발생했을 때 UI가 어떤 범위까지 영향을 받는지 확인하세요.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setShouldThrow(true)}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#b91c1c",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          에러 발생
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          수동 리셋
        </button>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        {mode === "before" ? (
          <ErrorBoundary onReset={handleReset} label="전체 섹션">
            {content}
          </ErrorBoundary>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <SafeWidget />
            <ErrorBoundary onReset={handleReset} label="문제 위젯">
              <CrashyWidget key={resetKey} shouldThrow={shouldThrow} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </section>
  );
}

function SafeWidget() {
  const renderCount = useRenderCount();

  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: "0.6rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <strong style={{ display: "block", marginBottom: "0.35rem" }}>
        안전한 위젯
      </strong>
      <p style={{ marginTop: 0, marginBottom: "0.35rem", color: "#6b7280" }}>
        정상적으로 렌더링됩니다.
      </p>
      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
        렌더링 {renderCount}
      </span>
    </div>
  );
}

function CrashyWidget({ shouldThrow }: { shouldThrow: boolean }) {
  const renderCount = useRenderCount();

  if (shouldThrow) {
    throw new Error("강제로 발생시킨 렌더링 오류");
  }

  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: "0.6rem",
        border: "1px dashed #f97316",
        backgroundColor: "#fff7ed",
      }}
    >
      <strong style={{ display: "block", marginBottom: "0.35rem" }}>
        오류 가능 위젯
      </strong>
      <p style={{ marginTop: 0, marginBottom: "0.35rem", color: "#9a3412" }}>
        에러 버튼을 누르면 이 위젯이 실패합니다.
      </p>
      <span style={{ fontSize: "0.75rem", color: "#c2410c" }}>
        렌더링 {renderCount}
      </span>
    </div>
  );
}
