import React, { useRef } from "react";

interface User {
  name: string;
  age: number;
}

interface UserProfileProps {
  mode: "before" | "after";
  user: User;
}

// Before: 매번 새로운 객체 참조로 인한 리렌더링
function UserProfileBefore({ user }: { user: User }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div>
      <p style={{ marginBottom: "0.25rem", fontSize: "0.9rem" }}>
        <strong>{user.name}</strong> ({user.age}세)
      </p>
      <div style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
}

// After: React.memo + useMemo로 객체 메모이제이션하여 리렌더링 방지
const UserProfileAfter = React.memo(function UserProfileAfter({ user }: { user: User }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div>
      <p style={{ marginBottom: "0.25rem", fontSize: "0.9rem" }}>
        <strong>{user.name}</strong> ({user.age}세)
      </p>
      <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
    </div>
  );
});

export function UserProfile({ mode, user }: UserProfileProps) {
  if (mode === "before") {
    return <UserProfileBefore user={user} />;
  }
  return <UserProfileAfter user={user} />;
}
