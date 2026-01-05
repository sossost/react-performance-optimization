import { useState } from "react";
import { fetchUser } from "../utils/api";

interface RequestDeduplicationProps {
  mode: "before" | "after";
}

// Request Deduplication을 위한 캐시
const requestCache = new Map<string, Promise<any>>();

function fetchUserDeduplicated(userId: number) {
  const cacheKey = `user-${userId}`;

  // 이미 진행 중인 요청이 있으면 그 요청의 Promise 반환
  if (requestCache.has(cacheKey)) {
    console.log("중복 요청 감지, 기존 요청 재사용:", cacheKey);
    return requestCache.get(cacheKey)!;
  }

  // 새로운 요청 시작
  const promise = fetchUser(userId);
  requestCache.set(cacheKey, promise);

  // 요청 완료 후 캐시에서 제거
  promise.finally(() => {
    requestCache.delete(cacheKey);
  });

  return promise;
}

export function RequestDeduplication({ mode }: RequestDeduplicationProps) {
  const [user1, setUser1] = useState<any>(null);
  const [user2, setUser2] = useState<any>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    setUser1(null);
    setUser2(null);
    setRequestCount(0);

    if (mode === "before") {
      // ❌ Before: 중복 요청 발생
      setRequestCount((prev) => prev + 1);
      fetchUser(1)
        .then((data) => {
          setUser1(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      setRequestCount((prev) => prev + 1);
      fetchUser(1)
        .then((data) => {
          setUser2(data);
        })
        .catch(() => {});
      // 같은 userId로 중복 요청
    } else {
      // ✅ After: 중복 요청 제거
      setRequestCount((prev) => prev + 1);
      fetchUserDeduplicated(1)
        .then((data) => {
          setUser1(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      setRequestCount((prev) => prev + 1);
      fetchUserDeduplicated(1)
        .then((data) => {
          setUser2(data);
        })
        .catch(() => {});
      // 같은 요청이므로 재사용
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
              ❌ 중복 요청 발생: 같은 userId로 2번 요청
              <br />
              Network 탭에서 2개의 요청 확인 가능
            </>
          ) : (
            <>
              ✅ 중복 요청 제거: 같은 요청이면 기존 Promise 재사용
              <br />
              Network 탭에서 1개의 요청만 확인 가능
            </>
          )}
        </p>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: loading ? "#ccc" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "1rem",
          }}
        >
          {loading ? "로딩 중..." : "중복 요청 테스트"}
        </button>
        {requestCount > 0 && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            API 호출 횟수: {requestCount} (Before는 2개, After는 1개)
            <br />
            <span style={{ fontSize: "0.8rem", color: "#999" }}>
              Network 탭에서 실제 요청 개수를 확인하세요
            </span>
          </div>
        )}
      </div>

      {(user1 || user2) && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>로드된 데이터:</h3>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            <div>사용자 1: {user1?.name || "로딩 중..."}</div>
            <div>사용자 2: {user2?.name || "로딩 중..."}</div>
          </div>
        </div>
      )}
    </div>
  );
}

