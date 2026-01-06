import { useState, useRef } from "react";

interface UserProfileProps {
  mode: "before" | "after";
  user?: { name: string; email: string };
  setUser?: (user: { name: string; email: string }) => void;
}

// Before: user를 props로 받음
function UserProfileBefore({ user, setUser }: { user: { name: string; email: string }; setUser: (user: { name: string; email: string }) => void }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
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
        <strong>이름:</strong> {user.name}
      </p>
      <p>
        <strong>이메일:</strong> {user.email}
      </p>
      <button
        onClick={() => setUser({ name: "새 사용자", email: "new@example.com" })}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        사용자 변경
      </button>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (다른 상태 변경 시에도 리렌더링)
      </div>
    </div>
  );
}

// After: user를 내부에서 관리
function UserProfileAfter() {
  const [user, setUser] = useState({ name: "홍길동", email: "hong@example.com" });
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
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
        <strong>이름:</strong> {user.name}
      </p>
      <p>
        <strong>이메일:</strong> {user.email}
      </p>
      <button
        onClick={() => setUser({ name: "새 사용자", email: "new@example.com" })}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#059669",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        사용자 변경
      </button>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (user 변경 시에만)
      </div>
    </div>
  );
}

export function UserProfile({ mode, user, setUser }: UserProfileProps) {
  if (mode === "before" && user && setUser) {
    return <UserProfileBefore user={user} setUser={setUser} />;
  }
  return <UserProfileAfter />;
}

