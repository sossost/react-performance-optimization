// ❌ Before: Service Worker 없음
// - 네트워크 요청만 사용
// - 캐싱 없음

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
          Service Worker 없이 네트워크 요청만 사용합니다.
          <br />
          ❌ 매번 서버에서 리소스를 다운로드
          <br />
          ❌ 재방문 시에도 네트워크 요청 발생
          <br />
          ❌ 오프라인 상태에서 작동하지 않음
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
          Service Worker가 등록되어 있지 않습니다.
          <br />
          개발자 도구 &gt; Application &gt; Service Workers에서 확인하세요.
        </p>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            borderRadius: "0.5rem",
            color: "#991b1b",
          }}
        >
          Service Worker: 미등록
        </div>
      </div>
    </div>
  );
}

