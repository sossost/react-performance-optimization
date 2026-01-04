import { ImageGallery } from "./components/ImageGallery";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

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
          ❌ Before: 리소스 최적화 없음
        </h2>
        <p style={{ margin: 0, color: "#7f1d1d" }}>
          고해상도 PNG 원본 이미지를 직접 로드합니다.
          <br />
          시스템 폰트를 사용하며, 모든 이미지가 한 번에 로드됩니다.
          <br />
          Network 탭에서 이미지 용량이 매우 큰 것을 확인하세요.
        </p>
      </div>

      <PerformanceMetrics variant="before" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          리소스 최적화 예제
        </h1>
        <p
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          이 페이지는 최적화되지 않은 고용량 이미지들을 사용합니다.
          <br />
          <strong style={{ color: "#dc2626" }}>
            초기 로딩이 느리고, 이미지 로드 시 레이아웃이 흔들립니다!
          </strong>
        </p>
      </div>

      <ImageGallery />
    </div>
  );
}
