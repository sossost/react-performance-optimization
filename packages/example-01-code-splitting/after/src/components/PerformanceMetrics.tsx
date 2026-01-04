import { useEffect, useState } from "react";

interface PerformanceMetricsProps {
  variant: "before" | "after";
}

export function PerformanceMetrics({ variant }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<{
    bundleSize: number;
    loadTime: number;
    jsFiles: number;
  } | null>(null);

  useEffect(() => {
    // Performance API로 로딩 시간 측정
    const measurePerformance = () => {
      if (typeof window === "undefined" || !window.performance) return;

      // 현재 시점까지 로드된 리소스 가져오기
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      // 현재 페이지와 관련된 JS 파일만 필터링 (현재 URL 기준)
      const currentUrl = window.location.href;
      const jsResources = resources.filter((r) => {
        const resourceUrl = r.name;
        return (
          resourceUrl.includes(".js") &&
          !resourceUrl.includes("?") &&
          resourceUrl.includes(window.location.origin)
        );
      });

      // 번들 크기 합계 계산 (transferSize 우선, 없으면 decodedBodySize)
      const bundleSize = jsResources.reduce((sum, r) => {
        const size =
          r.transferSize > 0 ? r.transferSize : r.decodedBodySize || 0;
        return sum + size;
      }, 0);

      // 페이지 로딩 시간 계산 (Network 탭과 동일하게)
      // Navigation Timing API 사용
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      let loadTime = 0;

      if (navigation) {
        // Load 이벤트 완료 시간 사용 (Network 탭의 "Load" 시간과 동일)
        // loadEventEnd: 모든 리소스가 로드되고 load 이벤트가 완료된 시점
        loadTime = navigation.loadEventEnd - navigation.fetchStart;
      } else {
        // Navigation Timing이 없으면 가장 늦게 완료된 JS 리소스의 시간 사용
        if (jsResources.length > 0) {
          loadTime = Math.max(
            ...jsResources.map((r) => r.responseEnd - r.fetchStart)
          );
        }
      }

      setMetrics({
        bundleSize,
        loadTime: Math.round(loadTime),
        jsFiles: jsResources.length,
      });
    };

    // 리소스 로딩 완료 대기 (여러 번 시도)
    let attemptCount = 0;
    const maxAttempts = 10;

    const tryMeasure = () => {
      attemptCount++;
      measurePerformance();

      // 여러 번 시도하여 모든 리소스가 로드될 때까지 기다림
      if (attemptCount < maxAttempts) {
        setTimeout(tryMeasure, 200);
      }
    };

    // 초기 측정 시작
    const timeoutId = setTimeout(tryMeasure, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [variant]);

  if (!metrics) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        성능 메트릭 측정 중...
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatTime = (ms: number) => {
    return Math.round(ms) + "ms";
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: variant === "before" ? "#fee2e2" : "#d1fae5",
        border: `1px solid ${variant === "before" ? "#fca5a5" : "#6ee7b7"}`,
        borderRadius: "0.5rem",
        marginTop: "2rem",
      }}
    >
      <h3
        style={{
          margin: "0 0 1rem 0",
          color: variant === "before" ? "#991b1b" : "#065f46",
          fontSize: "1.125rem",
        }}
      >
        📊 성능 메트릭 (실시간 측정)
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.375rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            초기 번들 크기
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: variant === "before" ? "#dc2626" : "#059669",
            }}
          >
            {formatBytes(metrics.bundleSize)}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.375rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            페이지 로딩 시간
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: variant === "before" ? "#dc2626" : "#059669",
            }}
          >
            {formatTime(metrics.loadTime)}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.375rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            JS 파일 수
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: variant === "before" ? "#dc2626" : "#059669",
            }}
          >
            {metrics.jsFiles}개
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fff",
          borderRadius: "0.375rem",
          fontSize: "0.75rem",
          color: "#6b7280",
        }}
      >
        💡 <strong>측정 방법:</strong> Performance API를 사용하여 실제 로딩
        시간과 번들 크기를 측정합니다. Network 탭과 비교해보세요.
      </div>
    </div>
  );
}
