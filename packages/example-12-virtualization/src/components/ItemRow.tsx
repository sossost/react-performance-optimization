import type { CSSProperties } from "react";
import type { ListItem } from "../types";

interface ItemRowProps {
  item: ListItem;
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
        backgroundColor: isEven ? "#ffffff" : "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ minWidth: "60px", fontWeight: 700, color: "#111827" }}>
        #{item.id}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
          {item.title}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          {item.detail}
        </div>
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#374151",
          backgroundColor: "#e5e7eb",
          padding: "0.2rem 0.6rem",
          borderRadius: "999px",
          whiteSpace: "nowrap",
        }}
      >
        {item.tag}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#374151" }}>
        {item.latency}ms
      </div>
    </div>
  );
}
