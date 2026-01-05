import { useEffect } from "react";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { ResourceDemo } from "./components/ResourceDemo";

export default function App() {
  useEffect(() => {
    // Service Worker 등록
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker 등록 성공:",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker 등록 실패:", error);
          });
      });
    }
  }, []);

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
          ✅ After: Service Worker 적용
        </h2>
        <p style={{ margin: 0, color: "#047857" }}>
          Service Worker를 통한 캐싱 전략을 적용했습니다.
          <br />
          정적 리소스가 캐시되어 재방문 시 빠르게 로드됩니다.
          <br />
          오프라인 상태에서도 기본 기능이 작동합니다.
        </p>
      </div>

      <PerformanceMetrics variant="after" />

      <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          Service Worker 캐싱 예제
        </h1>
        <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.1rem" }}>
          이 페이지는 Service Worker를 사용합니다.
          <br />
          <strong style={{ color: "#059669" }}>
            캐싱으로 빠른 로딩, 오프라인에서도 작동!
          </strong>
        </p>
      </div>

      <ResourceDemo />
    </div>
  );
}
