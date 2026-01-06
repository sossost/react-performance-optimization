import { useRef, useState, type MutableRefObject } from "react";
import type { Mode } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";

interface ConditionalRenderDemoProps {
  mode: Mode;
}

interface RowItem {
  id: number;
  label: string;
  score: number;
}

function buildRows(countRef: MutableRefObject<number>, size: number) {
  countRef.current += 1;
  const rows: RowItem[] = [];
  for (let i = 0; i < size; i += 1) {
    const score = Math.round(((Math.sin(i) + 1) / 2) * 100);
    rows.push({
      id: i,
      label: `Row ${i + 1}`,
      score,
    });
  }
  return rows;
}

export function ConditionalRenderDemo({ mode }: ConditionalRenderDemoProps) {
  return mode === "before" ? <ConditionalBefore /> : <ConditionalAfter />;
}

function ConditionalBefore() {
  const renderCount = useRenderCount();
  const computeCount = useRef(0);
  const [showDetails, setShowDetails] = useState(true);
  const [density, setDensity] = useState<"compact" | "relaxed">("compact");

  const rows = buildRows(computeCount, density === "compact" ? 60 : 120);

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
        2. 조건부 렌더링
      </h3>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        상세 영역을 숨겨도 계산이 매번 실행됩니다.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          {showDetails ? "상세 숨기기" : "상세 보기"}
        </button>
        <button
          onClick={() =>
            setDensity((prev) => (prev === "compact" ? "relaxed" : "compact"))
          }
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          밀도: {density === "compact" ? "촘촘" : "여유"}
        </button>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "#6b7280",
          display: "flex",
          gap: "1rem",
        }}
      >
        <span>렌더링: {renderCount}</span>
        <span>계산 횟수: {computeCount.current}</span>
      </div>

      {showDetails ? (
        <ul
          style={{
            marginTop: "0.75rem",
            maxHeight: "180px",
            overflow: "auto",
            paddingLeft: "1rem",
          }}
        >
          {rows.map((row) => (
            <li key={row.id} style={{ marginBottom: "0.25rem" }}>
              {row.label} · 점수 {row.score}
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            color: "#6b7280",
          }}
        >
          상세 영역이 숨겨져 있습니다.
        </div>
      )}
    </section>
  );
}

function ConditionalAfter() {
  const renderCount = useRenderCount();
  const computeCount = useRef(0);
  const [showDetails, setShowDetails] = useState(true);
  const [density, setDensity] = useState<"compact" | "relaxed">("compact");

  if (!showDetails) {
    return (
      <section
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
          2. 조건부 렌더링
        </h3>
        <p style={{ marginTop: 0, color: "#4b5563" }}>
          숨긴 상태에서는 계산을 건너뜹니다.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowDetails(true)}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            상세 보기
          </button>
          <button
            onClick={() =>
              setDensity((prev) => (prev === "compact" ? "relaxed" : "compact"))
            }
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#111827",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            밀도: {density === "compact" ? "촘촘" : "여유"}
          </button>
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.85rem",
            color: "#6b7280",
            display: "flex",
            gap: "1rem",
          }}
        >
          <span>렌더링: {renderCount}</span>
          <span>계산 횟수: {computeCount.current}</span>
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            color: "#6b7280",
          }}
        >
          상세 영역이 숨겨져 있습니다.
        </div>
      </section>
    );
  }

  const rows = buildRows(computeCount, density === "compact" ? 60 : 120);

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
        2. 조건부 렌더링
      </h3>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        필요한 순간에만 계산을 수행합니다.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setShowDetails(false)}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          상세 숨기기
        </button>
        <button
          onClick={() =>
            setDensity((prev) => (prev === "compact" ? "relaxed" : "compact"))
          }
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          밀도: {density === "compact" ? "촘촘" : "여유"}
        </button>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "#6b7280",
          display: "flex",
          gap: "1rem",
        }}
      >
        <span>렌더링: {renderCount}</span>
        <span>계산 횟수: {computeCount.current}</span>
      </div>

      <ul
        style={{
          marginTop: "0.75rem",
          maxHeight: "180px",
          overflow: "auto",
          paddingLeft: "1rem",
        }}
      >
        {rows.map((row) => (
          <li key={row.id} style={{ marginBottom: "0.25rem" }}>
            {row.label} · 점수 {row.score}
          </li>
        ))}
      </ul>
    </section>
  );
}
