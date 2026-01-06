import { useState, useRef } from "react";

interface HeaderProps {
  mode: "before" | "after";
  theme?: string;
  setTheme?: (theme: string) => void;
}

// Before: theme를 props로 받음
function HeaderBefore({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <header
      style={{
        padding: "1rem",
        backgroundColor: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>헤더</h2>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: theme === "light" ? "#3b82f6" : "#60a5fa",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          테마 변경 ({theme})
        </button>
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (다른 상태 변경 시에도 리렌더링)
      </div>
    </header>
  );
}

// After: theme를 내부에서 관리
function HeaderAfter() {
  const [theme, setTheme] = useState("light");
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <header
      style={{
        padding: "1rem",
        backgroundColor: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>헤더</h2>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: theme === "light" ? "#3b82f6" : "#60a5fa",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          테마 변경 ({theme})
        </button>
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
        리렌더링 횟수: {renderCount.current} (theme 변경 시에만)
      </div>
    </header>
  );
}

export function Header({ mode, theme, setTheme }: HeaderProps) {
  if (mode === "before" && theme && setTheme) {
    return <HeaderBefore theme={theme} setTheme={setTheme} />;
  }
  return <HeaderAfter />;
}

