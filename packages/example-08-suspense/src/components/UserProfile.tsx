import { useState, useEffect } from "react";
import { fetchUser } from "../utils/api";
import { useSuspenseQuery } from "../utils/suspenseCache";

interface UserProfileProps {
  userId: number;
  mode: "before" | "after";
}

// Before: 수동 로딩 상태 관리
function UserProfileBefore({ userId }: { userId: number }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchUser(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div style={{ padding: "1rem" }}>사용자 로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: "1rem", color: "red" }}>에러: {error.message}</div>;
  }

  return (
    <div style={{ padding: "1rem", backgroundColor: "#fff", borderRadius: "0.5rem", marginBottom: "1rem" }}>
      <h3>사용자 프로필</h3>
      <p><strong>이름:</strong> {user?.name}</p>
      <p><strong>이메일:</strong> {user?.email}</p>
      <p><strong>전화:</strong> {user?.phone}</p>
    </div>
  );
}

// After: Suspense 사용
function UserProfileAfter({ userId }: { userId: number }) {
  const user = useSuspenseQuery(`user-${userId}`, () => fetchUser(userId));

  return (
    <div style={{ padding: "1rem", backgroundColor: "#fff", borderRadius: "0.5rem", marginBottom: "1rem" }}>
      <h3>사용자 프로필</h3>
      <p><strong>이름:</strong> {user?.name}</p>
      <p><strong>이메일:</strong> {user?.email}</p>
      <p><strong>전화:</strong> {user?.phone}</p>
    </div>
  );
}

export function UserProfile({ userId, mode }: UserProfileProps) {
  return mode === "before" ? (
    <UserProfileBefore userId={userId} />
  ) : (
    <UserProfileAfter userId={userId} />
  );
}

