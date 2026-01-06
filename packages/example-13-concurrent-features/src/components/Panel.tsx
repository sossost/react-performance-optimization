import type { ReactNode } from "react";

interface Metric {
  label: string;
  value: string;
  hint?: string;
}

interface PanelProps {
  title: string;
  description: string;
  badge: string;
  accentColor: string;
  badgeBackground: string;
  badgeBorder: string;
  metrics: Metric[];
  children: ReactNode;
}

export function Panel({
  title,
  description,
  badge,
  accentColor,
  badgeBackground,
  badgeBorder,
  metrics,
  children,
}: PanelProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>{title}</h2>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>{description}</p>
        </div>
        <span
          style={{
            alignSelf: "flex-start",
            backgroundColor: badgeBackground,
            color: accentColor,
            border: `1px solid ${badgeBorder}`,
            padding: "0.25rem 0.7rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {badge}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
              {metric.label}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: accentColor }}>
              {metric.value}
            </div>
            {metric.hint ? (
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                {metric.hint}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
