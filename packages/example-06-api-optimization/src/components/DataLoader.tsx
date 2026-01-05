import { useState } from "react";
import { fetchUser, fetchPosts, fetchComments } from "../utils/api";

interface DataLoaderProps {
  mode: "before" | "after";
}

export function DataLoader({ mode }: DataLoaderProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    user: any;
    posts: any[];
    comments: any[];
  } | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    setData(null);
    setTime(null);
    const startTime = performance.now();

    try {
      if (mode === "before") {
        // ❌ Before: 순차적 요청 (Waterfall)
        const user = await fetchUser(1);
        const posts = await fetchPosts(1);
        // 첫 번째 게시글의 댓글 가져오기
        const firstPostId = posts[0]?.id || 1;
        const comments = await fetchComments(firstPostId);
        setData({ user, posts, comments });
      } else {
        // ✅ After: 병렬 요청
        const [user, posts] = await Promise.all([fetchUser(1), fetchPosts(1)]);
        // 첫 번째 게시글의 댓글 가져오기
        const firstPostId = posts[0]?.id || 1;
        const comments = await fetchComments(firstPostId);
        setData({ user, posts, comments });
      }

      const endTime = performance.now();
      setTime(endTime - startTime);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
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
              ❌ 순차적 요청: 첫 번째 요청 완료 후 두 번째 요청 시작
              <br />총 시간 = 요청1 + 요청2 + 요청3
            </>
          ) : (
            <>
              ✅ 병렬 요청: 모든 요청을 동시에 시작
              <br />총 시간 = max(요청1, 요청2, 요청3)
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
          }}
        >
          {loading ? "로딩 중..." : "데이터 로드"}
        </button>
        {time !== null && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.5rem",
              backgroundColor: mode === "before" ? "#fee2e2" : "#d1fae5",
              borderRadius: "0.5rem",
              color: mode === "before" ? "#991b1b" : "#065f46",
            }}
          >
            소요 시간: {time.toFixed(2)}ms
          </div>
        )}
      </div>

      {data && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>로드된 데이터:</h3>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            <div>사용자: {data.user?.name || "N/A"}</div>
            <div>게시글 수: {data.posts?.length || 0}</div>
            <div>댓글 수: {data.comments?.length || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}
