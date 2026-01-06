import { useState, Suspense } from "react";
import { fetchUser, fetchPosts } from "../utils/api";
import { UserProfile } from "./UserProfile";
import { UserPosts } from "./UserPosts";
import { clearCache } from "../utils/suspenseCache";

interface ProgressiveLoadingProps {
  mode: "before" | "after";
}

// Before: 모든 데이터가 로드될 때까지 기다림
function ProgressiveLoadingBefore() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setShouldLoad(true);
    setLoading(true);
    setUser(null);
    setPosts([]);

    try {
      // 모든 데이터를 병렬로 로드하지만, 모두 완료될 때까지 기다림
      const [userData, postsData] = await Promise.all([
        fetchUser(1),
        fetchPosts(1),
      ]);

      // 모든 데이터가 준비된 후에만 한 번에 상태 업데이트
      setUser(userData);
      setPosts(postsData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        1. Progressive Loading (점진적 로딩)
      </h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        ❌ Before: 모든 데이터가 로드될 때까지 기다림
        <br />
        사용자와 게시글이 모두 준비되어야 한 번에 표시됨
        <br />
        <strong>FCP 지연:</strong> 느린 데이터까지 기다려야 함
      </p>
      {!shouldLoad ? (
        <button
          onClick={handleLoad}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          데이터 로드
        </button>
      ) : loading || !user || posts.length === 0 ? (
        <div style={{ padding: "1rem" }}>로딩 중... (모든 데이터 대기 중)</div>
      ) : (
        <>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <h3>사용자 프로필</h3>
            <p>
              <strong>이름:</strong> {user?.name}
            </p>
            <p>
              <strong>이메일:</strong> {user?.email}
            </p>
            <p>
              <strong>전화:</strong> {user?.phone}
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <h3>게시글 목록 ({posts.length}개)</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {posts.slice(0, 5).map((post: any) => (
                <li
                  key={post.id}
                  style={{
                    padding: "0.5rem",
                    marginBottom: "0.5rem",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "0.25rem",
                  }}
                >
                  <strong>{post.title}</strong>
                  <p
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    {post.body.substring(0, 100)}...
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// After: Suspense로 각각 독립적으로 로딩
function ProgressiveLoadingAfter({ mode }: ProgressiveLoadingProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  const handleLoad = () => {
    clearCache(); // 캐시 초기화하여 새로운 요청 보장
    setShouldLoad(true);
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        1. Progressive Loading (점진적 로딩)
      </h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        ✅ After: 빠른 데이터부터 먼저 표시 (Suspense)
        <br />
        사용자가 먼저 로드되면 먼저 표시, 게시글은 나중에 표시
        <br />
        <strong>FCP 개선:</strong> 빠른 데이터부터 표시하여 인지적 성능 향상
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
          데이터 로드
        </button>
      ) : (
        <>
          <Suspense
            fallback={<div style={{ padding: "1rem" }}>사용자 로딩 중...</div>}
          >
            <UserProfile userId={1} mode={mode} />
          </Suspense>
          <Suspense
            fallback={<div style={{ padding: "1rem" }}>게시글 로딩 중...</div>}
          >
            <UserPosts userId={1} mode={mode} />
          </Suspense>
        </>
      )}
    </div>
  );
}

export function ProgressiveLoading({ mode }: ProgressiveLoadingProps) {
  return mode === "before" ? (
    <ProgressiveLoadingBefore />
  ) : (
    <ProgressiveLoadingAfter mode={mode} />
  );
}
