// ✅ After: Preload/Prefetch 적용
// - 폰트를 preload로 미리 로드
// - 외부 리소스는 preconnect로 연결 미리 설정
// - LCP 이미지를 preload로 미리 로드

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
        <h3 style={{ marginBottom: "1rem" }}>폰트 로딩 (FOIT 방지)</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          폰트를 preload로 미리 로드합니다.
          <br />
          ✅ HTML 파싱 중 즉시 폰트 다운로드 시작
          <br />
          ✅ CSS 파싱 전에 폰트가 이미 로드되어 FOIT 방지
        </p>
        <div
          style={{
            fontSize: "2rem",
            fontFamily: "CustomFont, sans-serif",
            fontWeight: "bold",
          }}
        >
          이 텍스트는 커스텀 폰트를 사용합니다
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>외부 리소스 (Google Fonts)</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Preconnect로 외부 도메인 연결을 미리 설정합니다.
          <br />
          ✅ DNS 조회, TCP 연결, TLS 핸드셰이크를 미리 수행
          <br />
          ✅ 리소스 다운로드 즉시 시작 (연결 지연 없음)
        </p>
        <div
          style={{
            fontSize: "1.5rem",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Google Fonts (Roboto)를 사용합니다
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>LCP 이미지</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          LCP 이미지를 preload로 미리 로드합니다.
          <br />
          ✅ 높은 우선순위로 즉시 다운로드
          <br />
          ✅ LCP 시간 단축
        </p>
        <img
          src="/images/hero.jpg"
          alt="Hero 이미지"
          style={{ width: "100%", maxWidth: "800px" }}
        />
      </div>
    </div>
  );
}

