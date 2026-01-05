import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { ResourceDemo } from "./components/ResourceDemo";

export default function App() {
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
          ❌ Before: Preload/Prefetch 없음
        </h2>
        <p style={{ margin: 0, color: "#7f1d1d" }}>
          리소스를 필요할 때만 로드합니다.
          <br />
          폰트는 CSS 파일에서 발견되어 순차적으로 로드됩니다.
          <br />
          외부 리소스 로딩 시 연결 지연이 발생합니다.
        </p>
      </div>

      <PerformanceMetrics variant="before" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          리소스 Preload/Prefetch 예제
        </h1>
        <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.1rem" }}>
          이 페이지는 Preload/Prefetch를 적용하지 않았습니다.
          <br />
          <strong style={{ color: "#dc2626" }}>
            폰트 로딩 지연으로 FOIT 발생 가능, 외부 리소스 연결 지연 발생!
          </strong>
        </p>
      </div>

      <ResourceDemo />
    </div>
  );
}
