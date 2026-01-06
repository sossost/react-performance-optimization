import { useMemo, useState } from "react";
import { BeforeList } from "./components/BeforeList";
import { ControlPanel } from "./components/ControlPanel";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { VirtualizedList } from "./components/VirtualizedList";
import type { ListItem } from "./types";

const ITEM_HEIGHT = 56;
const LIST_HEIGHT = 520;
const ITEM_RANGE = { min: 500, max: 10000, step: 500 };
const OVERSCAN_RANGE = { min: 0, max: 12, step: 1 };

const TAGS = ["Render", "State", "Cache", "Network", "Layout", "Worker"];
const STATUS = ["대기", "처리중", "완료"];

function createItems(count: number): ListItem[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const tag = TAGS[id % TAGS.length];
    const status = STATUS[id % STATUS.length];
    const latency = 20 + ((id * 17) % 180);

    return {
      id,
      title: `아이템 ${id}`,
      tag,
      detail: `${status} · 요청 ${(id % 5) + 1}회`,
      latency,
    };
  });
}

export default function App() {
  const [itemCount, setItemCount] = useState(3000);
  const [overscanCount, setOverscanCount] = useState(6);

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
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.4rem", fontSize: "1.8rem" }}>
            예제 12: 대용량 리스트 Virtualization
          </h1>
          <p style={{ color: "#6b7280" }}>
            동일한 데이터에서 전체 렌더링과 가상화 렌더링의 차이를 비교합니다.
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
            Before: 전체 렌더링
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
            After: 가상화
          </span>
        </div>
      </header>

      <ControlPanel
        itemCount={itemCount}
        overscanCount={overscanCount}
        itemRange={ITEM_RANGE}
        overscanRange={OVERSCAN_RANGE}
        onItemCountChange={setItemCount}
        onOverscanChange={setOverscanCount}
      />

      <div style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#6b7280" }}>
        리스트 높이 {LIST_HEIGHT}px · 아이템 높이 {ITEM_HEIGHT}px
      </div>

      <PerformanceMetrics />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        <BeforeList
          items={items}
          listHeight={LIST_HEIGHT}
          itemHeight={ITEM_HEIGHT}
        />
        <VirtualizedList
          items={items}
          listHeight={LIST_HEIGHT}
          itemHeight={ITEM_HEIGHT}
          overscanCount={overscanCount}
        />
      </div>
    </div>
  );
}
