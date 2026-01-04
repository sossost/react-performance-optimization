// ✅ After: 최적화된 이미지 로딩
// - WebP/AVIF 포맷 사용
// - width/height 지정 (CLS 방지)
// - Lazy Loading 적용 (화면 밖 이미지)

const images = [
  {
    id: 1,
    src: "/images/hero.jpg",
    srcSet: {
      avif: "/images/hero.avif",
      webp: "/images/hero.webp",
    },
    alt: "Hero 이미지",
    title: "Hero 이미지 (최적화됨)",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: "/images/photo1.jpg",
    srcSet: {
      avif: "/images/photo1.avif",
      webp: "/images/photo1.webp",
    },
    alt: "사진 1",
    title: "사진 1 (최적화됨)",
    width: 800,
    height: 600,
  },
  {
    id: 3,
    src: "/images/photo2.jpg",
    srcSet: {
      avif: "/images/photo2.avif",
      webp: "/images/photo2.webp",
    },
    alt: "사진 2",
    title: "사진 2 (최적화됨)",
    width: 800,
    height: 600,
  },
  {
    id: 4,
    src: "/images/photo3.jpg",
    srcSet: {
      avif: "/images/photo3.avif",
      webp: "/images/photo3.webp",
    },
    alt: "사진 3",
    title: "사진 3 (최적화됨)",
    width: 800,
    height: 600,
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
          ✅ width/height 지정으로 CLS 방지
          <br />
          ✅ WebP/AVIF 포맷으로 용량 최적화
          <br />
          ✅ eager 로딩 (LCP 이미지는 즉시 로드)
        </p>
        <picture>
          <source srcSet={images[0].srcSet.avif} type="image/avif" />
          <source srcSet={images[0].srcSet.webp} type="image/webp" />
          <img
            src={images[0].src}
            alt={images[0].alt}
            width={images[0].width}
            height={images[0].height}
            style={{ aspectRatio: `${images[0].width}/${images[0].height}` }}
            loading="eager"
          />
        </picture>
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
              ✅ Lazy Loading 적용
              <br />
              ✅ width/height 지정 (CLS 방지)
              <br />
              ✅ WebP/AVIF 포맷 사용
            </p>
            <picture>
              <source srcSet={image.srcSet.avif} type="image/avif" />
              <source srcSet={image.srcSet.webp} type="image/webp" />
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                style={{
                  width: "100%",
                  aspectRatio: `${image.width}/${image.height}`,
                }}
                loading="lazy"
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  );
}
