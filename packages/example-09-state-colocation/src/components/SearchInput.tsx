import { useState, useRef } from "react";

interface SearchInputProps {
  mode: "before" | "after";
  query?: string;
  setQuery?: (query: string) => void;
}

// Before: query를 props로 받음 (Props Drilling 예제)
function SearchInputBefore({ query, setQuery }: { query: string; setQuery: (query: string) => void }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
      }}
    >
      <h3>검색</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요..."
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
        }}
      />
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        검색어: {query || "(없음)"}
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (다른 상태 변경 시에도 리렌더링)
      </div>
    </div>
  );
}

// After: query를 내부에서 관리
function SearchInputAfter() {
  const [query, setQuery] = useState("");
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
      }}
    >
      <h3>검색</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요..."
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
        }}
      />
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        검색어: {query || "(없음)"}
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (query 변경 시에만)
      </div>
    </div>
  );
}

export function SearchInput({ mode, query, setQuery }: SearchInputProps) {
  if (mode === "before" && query !== undefined && setQuery) {
    return <SearchInputBefore query={query} setQuery={setQuery} />;
  }
  return <SearchInputAfter />;
}

