import { useEffect, useState } from "react";
import { fetchUser } from "../utils/api";

interface RequestCancellationProps {
  mode: "before" | "after";
}

export function RequestCancellation({ mode }: RequestCancellationProps) {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "before") {
      // ❌ Before: 요청 취소 없음
      setLoading(true);
      fetchUser(userId)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      // ✅ After: Request Cancellation 적용
      const controller = new AbortController();

      setLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("요청 취소됨");
          } else {
            console.error("요청 실패:", error);
            setLoading(false);
          }
        });

      // 컴포넌트 언마운트 또는 userId 변경 시 요청 취소
      return () => {
        controller.abort();
      };
    }
  }, [userId, mode]);

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
              ❌ 요청 취소 없음: userId 변경 시 이전 요청이 계속 진행됨
              <br />
              빠르게 변경하면 여러 요청이 동시에 진행
            </>
          ) : (
            <>
              ✅ 요청 취소 적용: userId 변경 시 이전 요청 취소
              <br />
              불필요한 네트워크 요청 방지
            </>
          )}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setUserId(1)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: userId === 1 ? "#3b82f6" : "#e5e7eb",
              color: userId === 1 ? "white" : "#374151",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            User 1
          </button>
          <button
            onClick={() => setUserId(2)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: userId === 2 ? "#3b82f6" : "#e5e7eb",
              color: userId === 2 ? "white" : "#374151",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            User 2
          </button>
          <button
            onClick={() => setUserId(3)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: userId === 3 ? "#3b82f6" : "#e5e7eb",
              color: userId === 3 ? "white" : "#374151",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            User 3
          </button>
        </div>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          빠르게 버튼을 클릭하여 요청 취소를 확인하세요
        </p>
      </div>

      {loading && <div>로딩 중...</div>}
      {user && !loading && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>로드된 데이터:</h3>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            <div>사용자: {user.name}</div>
            <div>이메일: {user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}

