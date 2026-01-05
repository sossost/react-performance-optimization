import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { ResourceDemo } from "./components/ResourceDemo";

export default function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#d1fae5",
          border: "1px solid #86efac",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", color: "#065f46" }}>
          ✅ After: Preload/Prefetch 적용
        </h2>
        <p style={{ margin: 0, color: "#047857" }}>
          중요한 리소스를 preload로 미리 로드합니다.
          <br />
          외부 도메인은 preconnect로 연결을 미리 설정합니다.
          <br />
          다음 페이지 리소스는 prefetch로 미리 로드합니다.
        </p>
      </div>

      <PerformanceMetrics variant="after" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          리소스 Preload/Prefetch 예제
        </h1>
        <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.1rem" }}>
          이 페이지는 Preload/Prefetch를 적용했습니다.
          <br />
          <strong style={{ color: "#059669" }}>
            폰트가 빠르게 로드되어 FOIT 방지, 외부 리소스 연결이 빠름!
          </strong>
        </p>
      </div>

      <ResourceDemo />
    </div>
  );
}
