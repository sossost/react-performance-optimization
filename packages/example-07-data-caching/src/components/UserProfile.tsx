import { useState } from "react";
import { fetchUserNoCache, fetchUserCached } from "../utils/cache";

interface UserProfileProps {
  mode: "before" | "after";
  userId: number;
}

export function UserProfile({ mode, userId }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const loadUser = async () => {
    setLoading(true);
    setRequestCount((prev) => prev + 1);

    try {
      if (mode === "before") {
        // ❌ Before: 캐싱 없음
        const data = await fetchUserNoCache(userId);
        setUser(data);
      } else {
        // ✅ After: 캐싱 적용
        const data = await fetchUserCached(userId);
        setUser(data);
      }
    } catch (error) {
      console.error("사용자 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

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
              ❌ 캐싱 없음: 매번 네트워크 요청
              <br />
              같은 데이터를 여러 번 요청해도 매번 API 호출
            </>
          ) : (
            <>
              ✅ 캐싱 적용: 첫 번째 요청만 네트워크, 이후는 캐시에서 반환
              <br />
              TTL: 60초 (60초 후 자동 만료)
            </>
          )}
        </p>
        <button
          onClick={loadUser}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: loading ? "#ccc" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "로딩 중..." : `사용자 ${userId} 로드`}
        </button>
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          요청 횟수: {requestCount}
          {mode === "after" && (
            <span style={{ fontSize: "0.8rem", color: "#999", marginLeft: "0.5rem" }}>
              (Network 탭에서 실제 요청 개수 확인)
            </span>
          )}
        </div>
      </div>

      {user && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>사용자 정보:</h3>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            <div>이름: {user.name}</div>
            <div>이메일: {user.email}</div>
            <div>전화: {user.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
}

