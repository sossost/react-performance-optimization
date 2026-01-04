import { ImageGallery } from './components/ImageGallery'
import { PerformanceMetrics } from './components/PerformanceMetrics'

export default function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #86efac',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>
          ✅ After: 리소스 최적화 적용
        </h2>
        <p style={{ margin: 0, color: '#047857' }}>
          WebP/AVIF 변환 이미지 사용, 서브셋 WOFF2 폰트 로드
          <br />
          Lazy Loading 및 width/height 지정으로 CLS 방지
          <br />
          Network 탭에서 이미지 용량이 크게 감소한 것을 확인하세요.
        </p>
      </div>

      <PerformanceMetrics variant="after" />

      <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
          리소스 최적화 예제
        </h1>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
          이 페이지는 최적화된 이미지와 폰트를 사용합니다.
          <br />
          <strong style={{ color: '#059669' }}>
            초기 로딩이 빠르고, 레이아웃이 안정적입니다!
          </strong>
        </p>
      </div>

      <ImageGallery />
    </div>
  )
}
