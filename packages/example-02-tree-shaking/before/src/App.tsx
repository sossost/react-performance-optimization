import { useState } from "react";
import { debounce, formatDate } from "./utils/helpers";

export default function App() {
  const [input, setInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  // debounce 함수 사용 (lodash 전체가 번들에 포함됨)
  const debouncedHandler = debounce((value: string) => {
    setDebouncedValue(value);
  }, 300);

  const handleInputChange = (value: string) => {
    setInput(value);
    debouncedHandler(value);
  };

  const handleDateFormat = () => {
    const formatted = formatDate(new Date());
    setFormattedDate(formatted);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", color: "#991b1b" }}>
          ❌ Before: Tree Shaking 없음
        </h2>
        <p style={{ margin: 0, color: "#7f1d1d" }}>
          lodash 전체(약 70KB)와 moment 전체(약 290KB)가 번들에 포함되어
          있습니다.
          <br />
          실제로는 debounce와 format만 사용하지만, 사용하지 않는 모든 함수들도
          번들에 포함됩니다.
          <br />
          Network 탭에서 번들 크기를 확인하세요.
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>데모</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              입력 (debounce 적용):
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                handleInputChange(e.target.value);
              }}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "400px",
              }}
            />
            <p style={{ marginTop: "0.5rem", color: "#666" }}>
              Debounced 값: {debouncedValue || "(입력 대기 중...)"}
            </p>
          </div>

          <div>
            <button
              onClick={handleDateFormat}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              날짜 포맷하기
            </button>
            {formattedDate && (
              <p style={{ marginTop: "0.5rem", color: "#666" }}>
                포맷된 날짜: {formattedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fcd34d",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>📊 번들 크기 확인</h3>
        <p style={{ margin: 0, color: "#92400e" }}>
          개발자 도구 Network 탭을 열고 페이지를 새로고침하세요.
          <br />
          vendor 번들에 lodash 전체(약 70KB)와 moment 전체(약 290KB)가 포함되어
          있는 것을 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
