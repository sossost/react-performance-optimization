// ✅ After: Service Worker 적용
// - 캐싱 전략으로 성능 개선
// - 오프라인 지원

export function ResourceDemo() {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>정적 리소스 (이미지, CSS, JS)</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Service Worker가 리소스를 캐싱합니다.
          <br />
          ✅ 첫 방문: 네트워크에서 다운로드 후 캐시 저장
          <br />
          ✅ 재방문: 캐시에서 빠르게 로드
          <br />
          ✅ 오프라인: 캐시된 리소스로 작동
        </p>
        <img
          src="/images/hero.jpg"
          alt="Hero 이미지"
          style={{ width: "100%", maxWidth: "600px", borderRadius: "0.5rem" }}
        />
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>캐싱 상태</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Service Worker가 등록되어 있습니다.
          <br />
          개발자 도구 &gt; Application &gt; Service Workers에서 확인하세요.
          <br />
          Cache Storage에서 캐시된 리소스를 확인할 수 있습니다.
        </p>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#d1fae5",
            borderRadius: "0.5rem",
            color: "#065f46",
          }}
        >
          Service Worker: 등록됨
        </div>
      </div>
    </div>
  );
}

