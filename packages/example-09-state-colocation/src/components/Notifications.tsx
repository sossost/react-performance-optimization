import { useState, useRef } from "react";

interface NotificationsProps {
  mode: "before" | "after";
  notifications?: string[];
  setNotifications?: (notifications: string[]) => void;
}

// Before: notifications를 props로 받음
function NotificationsBefore({ notifications, setNotifications }: { notifications: string[]; setNotifications: (notifications: string[]) => void }) {
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
      <h3>알림 ({notifications.length}개)</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((notif, index) => (
          <li
            key={index}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.25rem",
            }}
          >
            {notif}
          </li>
        ))}
      </ul>
      <button
        onClick={() => setNotifications([...notifications, `새 알림 ${Date.now()}`])}
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
        알림 추가
      </button>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (다른 상태 변경 시에도 리렌더링)
      </div>
    </div>
  );
}

// After: notifications를 내부에서 관리
function NotificationsAfter() {
  const [notifications, setNotifications] = useState<string[]>(["알림 1", "알림 2"]);
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
      <h3>알림 ({notifications.length}개)</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((notif, index) => (
          <li
            key={index}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.25rem",
            }}
          >
            {notif}
          </li>
        ))}
      </ul>
      <button
        onClick={() => setNotifications([...notifications, `새 알림 ${Date.now()}`])}
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
        알림 추가
      </button>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (notifications 변경 시에만)
      </div>
    </div>
  );
}

export function Notifications({ mode, notifications, setNotifications }: NotificationsProps) {
  if (mode === "before" && notifications && setNotifications) {
    return <NotificationsBefore notifications={notifications} setNotifications={setNotifications} />;
  }
  return <NotificationsAfter />;
}

