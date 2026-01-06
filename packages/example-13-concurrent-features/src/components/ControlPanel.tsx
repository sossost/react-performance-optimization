interface RangeConfig {
  min: number;
  max: number;
  step?: number;
}

interface ControlPanelProps {
  itemCount: number;
  workFactor: number;
  itemRange: RangeConfig;
  workRange: RangeConfig;
  onItemCountChange: (value: number) => void;
  onWorkFactorChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ControlPanel({
  itemCount,
  workFactor,
  itemRange,
  workRange,
  onItemCountChange,
  onWorkFactorChange,
}: ControlPanelProps) {
  return (
    <div
      style={{
        backgroundColor: "#f1f5f9",
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
          항목 수
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
        <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "#64748b" }}>
          {itemRange.min.toLocaleString()} ~ {itemRange.max.toLocaleString()}개
        </div>
      </div>
      <div>
        <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
          연산 강도
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="range"
            min={workRange.min}
            max={workRange.max}
            step={workRange.step}
            value={workFactor}
            onChange={(event) => onWorkFactorChange(Number(event.target.value))}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={workRange.min}
            max={workRange.max}
            step={workRange.step}
            value={workFactor}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) {
                return;
              }
              onWorkFactorChange(clamp(next, workRange.min, workRange.max));
            }}
            style={{ width: "110px", padding: "0.2rem 0.4rem" }}
          />
        </div>
        <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "#64748b" }}>
          높을수록 필터 계산이 느려집니다.
        </div>
      </div>
    </div>
  );
}
