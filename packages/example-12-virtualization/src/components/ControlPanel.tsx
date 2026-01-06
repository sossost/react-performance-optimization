interface RangeConfig {
  min: number;
  max: number;
  step?: number;
}

interface ControlPanelProps {
  itemCount: number;
  overscanCount: number;
  itemRange: RangeConfig;
  overscanRange: RangeConfig;
  onItemCountChange: (value: number) => void;
  onOverscanChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ControlPanel({
  itemCount,
  overscanCount,
  itemRange,
  overscanRange,
  onItemCountChange,
  onOverscanChange,
}: ControlPanelProps) {
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        padding: "1rem",
        borderRadius: "0.75rem",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        marginBottom: "1.5rem",
      }}
    >
      <div>
        <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
          항목 수 조절
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="range"
            min={itemRange.min}
            max={itemRange.max}
            step={itemRange.step}
            value={itemCount}
            onChange={(event) => onItemCountChange(Number(event.target.value))}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={itemRange.min}
            max={itemRange.max}
            step={itemRange.step}
            value={itemCount}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) {
                return;
              }
              onItemCountChange(clamp(next, itemRange.min, itemRange.max));
            }}
            style={{ width: "110px", padding: "0.2rem 0.4rem" }}
          />
        </div>
        <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "#6b7280" }}>
          {itemRange.min.toLocaleString()} ~ {itemRange.max.toLocaleString()}개
        </div>
      </div>
      <div>
        <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
          Overscan 설정
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="range"
            min={overscanRange.min}
            max={overscanRange.max}
            step={overscanRange.step}
            value={overscanCount}
            onChange={(event) => onOverscanChange(Number(event.target.value))}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={overscanRange.min}
            max={overscanRange.max}
            step={overscanRange.step}
            value={overscanCount}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) {
                return;
              }
              onOverscanChange(clamp(next, overscanRange.min, overscanRange.max));
            }}
            style={{ width: "110px", padding: "0.2rem 0.4rem" }}
          />
        </div>
        <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "#6b7280" }}>
          보이는 영역 밖 항목을 추가 렌더링합니다.
        </div>
      </div>
    </div>
  );
}
