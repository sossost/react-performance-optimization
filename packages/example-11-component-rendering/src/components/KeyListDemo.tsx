import { useState } from "react";
import type { Mode } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";

interface KeyListDemoProps {
  mode: Mode;
}

interface Item {
  id: string;
  title: string;
}

const seedItems: Item[] = [
  { id: "a1", title: "월간 리포트" },
  { id: "b2", title: "고객 피드백" },
  { id: "c3", title: "캠페인 요약" },
  { id: "d4", title: "인증서 갱신" },
  { id: "e5", title: "세일즈 파이프라인" },
];

function shuffle(items: Item[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function KeyListDemo({ mode }: KeyListDemoProps) {
  const [items, setItems] = useState<Item[]>(seedItems);
  const renderCount = useRenderCount();

  const handleShuffle = () => {
    setItems((prev) => shuffle(prev));
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: `새 항목 ${prev.length + 1}`,
      },
    ]);
  };

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1rem" }}>1. 안정적인 key</h3>
        <span
          style={{
            fontSize: "0.8rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "999px",
            backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
            color: mode === "before" ? "#991b1b" : "#065f46",
            border: `1px solid ${mode === "before" ? "#fca5a5" : "#86efac"}`,
          }}
        >
          {mode === "before" ? "index key" : "id key"}
        </span>
      </div>

      <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "#4b5563" }}>
        항목별 메모를 입력한 뒤 <strong>리스트 섞기</strong>를 눌러 상태가
        이동하는지 확인하세요.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <button
          onClick={handleShuffle}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          리스트 섞기
        </button>
        <button
          onClick={handleAdd}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          항목 추가
        </button>
      </div>

      <div style={{ display: "grid", gap: "0.6rem" }}>
        {items.map((item, index) => (
          <ItemRow
            key={mode === "before" ? index : item.id}
            item={item}
          />
        ))}
      </div>

      <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#6b7280" }}>
        렌더링 횟수: {renderCount}
      </div>
    </section>
  );
}

function ItemRow({ item }: { item: Item }) {
  const [note, setNote] = useState("");
  const renderCount = useRenderCount();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        borderRadius: "0.6rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <div>
        <strong style={{ display: "block", marginBottom: "0.1rem" }}>
          {item.title}
        </strong>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          렌더링 {renderCount}
        </span>
      </div>
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="메모 입력"
        style={{
          flex: 1,
          minWidth: "140px",
          padding: "0.35rem 0.5rem",
          borderRadius: "0.4rem",
          border: "1px solid #d1d5db",
        }}
      />
    </div>
  );
}
