import { useState, useEffect } from "react";
import { fetchPosts } from "../utils/api";
import { useSuspenseQuery } from "../utils/suspenseCache";

interface UserPostsProps {
  userId: number;
  mode: "before" | "after";
}

// Before: 수동 로딩 상태 관리
function UserPostsBefore({ userId }: { userId: number }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPosts(userId)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div style={{ padding: "1rem" }}>게시글 로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: "1rem", color: "red" }}>에러: {error.message}</div>;
  }

  return (
    <div style={{ padding: "1rem", backgroundColor: "#fff", borderRadius: "0.5rem", marginBottom: "1rem" }}>
      <h3>게시글 목록 ({posts.length}개)</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.slice(0, 5).map((post) => (
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
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#666" }}>
              {post.body.substring(0, 100)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// After: Suspense 사용
function UserPostsAfter({ userId }: { userId: number }) {
  const posts = useSuspenseQuery(`posts-${userId}`, () => fetchPosts(userId));

  return (
    <div style={{ padding: "1rem", backgroundColor: "#fff", borderRadius: "0.5rem", marginBottom: "1rem" }}>
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
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#666" }}>
              {post.body.substring(0, 100)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserPosts({ userId, mode }: UserPostsProps) {
  return mode === "before" ? (
    <UserPostsBefore userId={userId} />
  ) : (
    <UserPostsAfter userId={userId} />
  );
}

