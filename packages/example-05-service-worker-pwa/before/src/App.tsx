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
          ❌ Before: Service Worker 없음
        </h2>
        <p style={{ margin: 0, color: "#7f1d1d" }}>
          Service Worker 없이 네트워크 요청만 사용합니다.
          <br />
          매번 서버에서 리소스를 다운로드합니다.
          <br />
          오프라인 상태에서 작동하지 않습니다.
        </p>
      </div>

      <PerformanceMetrics variant="before" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          Service Worker 캐싱 예제
        </h1>
        <p
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          이 페이지는 Service Worker를 사용하지 않습니다.
          <br />
          <strong style={{ color: "#dc2626" }}>
            매번 네트워크에서 리소스를 다운로드, 오프라인에서 작동하지 않음!
          </strong>
        </p>
      </div>

      <ResourceDemo />
    </div>
  );
}
