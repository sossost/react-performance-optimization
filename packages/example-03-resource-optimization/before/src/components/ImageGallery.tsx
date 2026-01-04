// ❌ Before: 최적화되지 않은 이미지 로딩
// - 고용량 PNG 원본 사용
// - width/height 미지정 (CLS 발생)
// - Lazy Loading 없음 (모든 이미지 즉시 로드)

const images = [
  {
    id: 1,
    src: "/images/hero.jpg",
    alt: "Hero 이미지",
    title: "Hero 이미지 (고해상도)",
  },
  {
    id: 2,
    src: "/images/photo1.jpg",
    alt: "사진 1",
    title: "사진 1 (고해상도)",
  },
  {
    id: 3,
    src: "/images/photo2.jpg",
    alt: "사진 2",
    title: "사진 2 (고해상도)",
  },
  {
    id: 4,
    src: "/images/photo3.jpg",
    alt: "사진 3",
    title: "사진 3 (고해상도)",
  },
];

export function ImageGallery() {
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
        <h3 style={{ marginBottom: "1rem" }}>Hero 이미지 (LCP 대상)</h3>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          이 이미지는 LCP(Largest Contentful Paint) 대상입니다.
          <br />
          ❌ width/height 미지정으로 CLS 발생 가능
          <br />❌ 고용량 이미지로 인해 로딩 시간이 깁니다
        </p>
        <img src={images[0].src} alt={images[0].alt} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {images.slice(1).map((image) => (
          <div
            key={image.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>{image.title}</h4>
            <p
              style={{
                marginBottom: "1rem",
                color: "#666",
                fontSize: "0.9rem",
              }}
            >
              ❌ Lazy Loading 없음 (즉시 로드)
              <br />❌ width/height 미지정 (CLS 발생)
            </p>
            <img src={image.src} alt={image.alt} style={{ width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
