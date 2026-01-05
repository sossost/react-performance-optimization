import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { searchAPI } from "../utils/api";

interface SearchInputProps {
  mode: "before" | "after";
}

export function SearchInput({ mode }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  // Debouncing 적용 (After 모드에서만)
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (mode === "before") {
      // ❌ Before: 매번 API 호출
      if (query) {
        setRequestCount((prev) => prev + 1);
        searchAPI(query)
          .then(setResults)
          .catch((error) => {
            console.error("검색 실패:", error);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    } else {
      // ✅ After: Debouncing 적용
      if (debouncedQuery) {
        setRequestCount((prev) => prev + 1);
        searchAPI(debouncedQuery)
          .then(setResults)
          .catch((error) => {
            console.error("검색 실패:", error);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    }
  }, [mode === "before" ? query : debouncedQuery, mode]);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          {mode === "before" ? (
            <>
              ❌ Debouncing 없음: 타이핑할 때마다 API 호출
              <br />
              "react" 입력 시 5번 호출 (r, re, rea, reac, react)
            </>
          ) : (
            <>
              ✅ Debouncing 적용: 타이핑을 멈춘 후 300ms 후에만 호출
              <br />
              "react" 입력 시 1번만 호출
            </>
          )}
        </p>
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
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          API 호출 횟수: {requestCount}
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>검색 결과:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {results.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.25rem",
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

