interface PerformanceMetricsProps {
  variant: 'before' | 'after'
}

export function PerformanceMetrics({ variant }: PerformanceMetricsProps) {
  return (
    <div
      style={{
        backgroundColor: variant === 'before' ? '#fee2e2' : '#d1fae5',
        border: `1px solid ${variant === 'before' ? '#fca5a5' : '#86efac'}`,
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>성능 측정 방법</h3>
      <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>
          <strong>Network 탭:</strong> 개발자 도구 &gt; Network &gt; Img 필터 &gt;
          새로고침
          <br />
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            이미지 용량과 로딩 시간을 확인하세요
          </span>
        </li>
        <li>
          <strong>Lighthouse:</strong> 개발자 도구 &gt; Lighthouse &gt; Navigation
          모드
          <br />
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            LCP, CLS 점수를 확인하세요
          </span>
        </li>
      </ol>
    </div>
  )
}
