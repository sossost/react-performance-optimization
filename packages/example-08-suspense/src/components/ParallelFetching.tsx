import { useState, Suspense, useRef } from "react";
import { fetchUser, fetchPosts } from "../utils/api";
import { clearCache } from "../utils/suspenseCache";
import { UserProfile } from "./UserProfile";
import { UserPosts } from "./UserPosts";

interface ParallelFetchingProps {
  mode: "before" | "after";
}

// Before: 순차적 로딩 (Waterfall)
function ParallelFetchingBefore({ mode }: { mode: "before" | "after" }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const loadData = async () => {
    setShouldLoad(true);
    setLoading(true);
    setTime(null);
    const startTime = performance.now();

    try {
      // 순차적 로딩
      const user = await fetchUser(1);
      const posts = await fetchPosts(1);
      console.log("User:", user);
      console.log("Posts:", posts);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      const endTime = performance.now();
      setTime(endTime - startTime);
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
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        ❌ Before: 순차적 로딩 (Waterfall)
        <br />
        첫 번째 요청 완료 후 두 번째 요청 시작
        <br />총 시간 = 요청1 + 요청2
      </p>
      {!shouldLoad ? (
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
          }}
        >
          {loading ? "로딩 중..." : "데이터 로드 (순차적)"}
        </button>
      ) : (
        <>
          {loading ? (
            <div style={{ padding: "1rem" }}>로딩 중...</div>
          ) : (
            <>
              <UserProfile userId={1} mode={mode} />
              <UserPosts userId={1} mode={mode} />
              {time !== null && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "#fee2e2",
                    borderRadius: "0.5rem",
                    color: "#991b1b",
                  }}
                >
                  소요 시간: {time.toFixed(2)}ms
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// After: Suspense로 병렬 처리
function ParallelFetchingAfter({ mode }: { mode: "before" | "after" }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleLoad = () => {
    clearCache(); // 캐시 초기화하여 새로운 요청 보장
    setTime(null);
    startTimeRef.current = performance.now();
    setShouldLoad(true);

    // 병렬로 두 요청 시작하고 시간 측정
    Promise.all([fetchUser(1), fetchPosts(1)])
      .then(() => {
        if (startTimeRef.current) {
          const endTime = performance.now();
          setTime(endTime - startTimeRef.current);
        }
      })
      .catch((error) => {
        console.error("데이터 로드 실패:", error);
      });
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
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        ✅ After: 병렬 로딩
        <br />
        모든 요청을 동시에 시작
        <br />총 시간 = max(요청1, 요청2)
      </p>
      {!shouldLoad ? (
        <button
          onClick={handleLoad}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          데이터 로드 (병렬)
        </button>
      ) : (
        <>
          <Suspense
            fallback={<div style={{ padding: "1rem" }}>로딩 중...</div>}
          >
            <UserProfile userId={1} mode={mode} />
            <UserPosts userId={1} mode={mode} />
          </Suspense>
          {time !== null && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.5rem",
                backgroundColor: "#d1fae5",
                borderRadius: "0.5rem",
                color: "#065f46",
              }}
            >
              소요 시간: {time.toFixed(2)}ms
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ParallelFetching({ mode }: ParallelFetchingProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>2. 병렬 데이터 페칭</h2>
      {mode === "before" ? (
        <ParallelFetchingBefore mode={mode} />
      ) : (
        <ParallelFetchingAfter mode={mode} />
      )}
    </div>
  );
}
