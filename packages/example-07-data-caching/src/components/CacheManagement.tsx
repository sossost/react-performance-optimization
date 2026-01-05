import { useState, useEffect } from "react";
import { getCacheStats, invalidateCache, clearCache } from "../utils/cache";

interface CacheManagementProps {
  mode: "before" | "after";
}

export function CacheManagement({ mode }: CacheManagementProps) {
  const [stats, setStats] = useState(getCacheStats());

  useEffect(() => {
    if (mode === "after") {
      // 캐시 상태를 주기적으로 업데이트
      const interval = setInterval(() => {
        setStats(getCacheStats());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  if (mode === "before") {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>캐시 관리</h3>
        <p style={{ color: "#666" }}>
          ❌ Before 모드에서는 캐싱이 없으므로 캐시 관리 기능이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>캐시 관리</h3>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>캐시 크기:</strong> {stats.size}개
        </div>
        {stats.entries.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <strong>캐시 항목:</strong>
            <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              {stats.entries.map((entry) => {
                const remaining = entry.ttl - entry.age;
                const isExpired = remaining <= 0;
                return (
                  <li key={entry.key} style={{ fontSize: "0.9rem", color: "#666" }}>
                    {entry.key}: {Math.floor(entry.age / 1000)}초 경과
                    {!isExpired && (
                      <span style={{ color: "#059669" }}>
                        {" "}
                        (남은 시간: {Math.floor(remaining / 1000)}초)
                      </span>
                    )}
                    {isExpired && (
                      <span style={{ color: "#dc2626" }}> (만료됨)</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            invalidateCache("user-1");
            setStats(getCacheStats());
          }}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          User 1 캐시 삭제
        </button>
        <button
          onClick={() => {
            invalidateCache("user-2");
            setStats(getCacheStats());
          }}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          User 2 캐시 삭제
        </button>
        <button
          onClick={() => {
            clearCache();
            setStats(getCacheStats());
          }}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          모든 캐시 삭제
        </button>
      </div>
    </div>
  );
}

