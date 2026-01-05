// ❌ Before: Preload/Prefetch 없음
// - 폰트는 CSS 파일에서 발견되어 순차적으로 로드
// - 외부 리소스는 연결 지연 후 로드

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
        <h3 style={{ marginBottom: "1rem" }}>폰트 로딩 (FOIT 발생 가능)</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          폰트가 CSS 파일 내부에서 발견되어 순차적으로 로드됩니다.
          <br />
          ❌ HTML → CSS 다운로드 → CSS 파싱 → 폰트 발견 → 폰트 다운로드
          <br />
          ❌ 폰트 로드 전까지 텍스트가 보이지 않음 (FOIT)
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
          외부 도메인 연결 시 지연이 발생합니다.
          <br />
          ❌ DNS 조회 → TCP 연결 → TLS 핸드셰이크 (100-500ms)
          <br />
          ❌ 연결 완료 후에야 리소스 다운로드 시작
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
          이미지가 HTML에서 발견되어 로드됩니다.
          <br />
          ❌ Preload 없이 일반 우선순위로 로드
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

