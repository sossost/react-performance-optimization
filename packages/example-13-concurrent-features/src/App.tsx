import { useMemo, useState } from "react";
import { AfterPanel } from "./components/AfterPanel";
import { BeforePanel } from "./components/BeforePanel";
import { ControlPanel } from "./components/ControlPanel";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { createItems } from "./utils";

const LIST_HEIGHT = 520;
const ITEM_RANGE = { min: 1000, max: 12000, step: 1000 };
const WORK_RANGE = { min: 0, max: 600, step: 50 };

export default function App() {
  const [itemCount, setItemCount] = useState(3000);
  const [workFactor, setWorkFactor] = useState(120);

  const items = useMemo(() => createItems(itemCount), [itemCount]);

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1400px", margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "0.75rem",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.4rem", fontSize: "1.8rem" }}>
            예제 13: Concurrent Features
          </h1>
          <p style={{ color: "#64748b" }}>
            입력과 리스트 업데이트의 우선순위를 분리해 UI 응답성을 확인합니다.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Before: 동기 업데이트
          </span>
          <span
            style={{
              backgroundColor: "#d1fae5",
              color: "#047857",
              border: "1px solid #a7f3d0",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            After: Transition + Deferred
          </span>
        </div>
      </header>

      <ControlPanel
        itemCount={itemCount}
        workFactor={workFactor}
        itemRange={ITEM_RANGE}
        workRange={WORK_RANGE}
        onItemCountChange={setItemCount}
        onWorkFactorChange={setWorkFactor}
      />

      <div style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#64748b" }}>
        동일한 데이터셋을 사용하며 리스트 높이 {LIST_HEIGHT}px로 고정됩니다.
      </div>

      <PerformanceMetrics />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        <BeforePanel
          items={items}
          listHeight={LIST_HEIGHT}
          workFactor={workFactor}
        />
        <AfterPanel
          items={items}
          listHeight={LIST_HEIGHT}
          workFactor={workFactor}
        />
      </div>
    </div>
  );
}
