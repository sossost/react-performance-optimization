import type { CSSProperties } from "react";
import type { SearchItem } from "../types";

interface ItemRowProps {
  item: SearchItem;
  index: number;
  style?: CSSProperties;
}

export function ItemRow({ item, index, style }: ItemRowProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 0.75rem",
        backgroundColor: isEven ? "#ffffff" : "#f8fafc",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ minWidth: "70px", fontWeight: 700, color: "#0f172a" }}>
        #{item.id}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
          {item.title}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {item.description}
        </div>
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#334155",
          backgroundColor: "#e2e8f0",
          padding: "0.2rem 0.6rem",
          borderRadius: "999px",
          whiteSpace: "nowrap",
        }}
      >
        {item.category}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#334155" }}>
        점수 {item.score}
      </div>
    </div>
  );
}
