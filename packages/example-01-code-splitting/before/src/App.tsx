// ❌ Before: 모든 무거운 라이브러리를 static import (초기 번들에 포함)
import { HeavyChartBefore } from './components/HeavyChartBefore'
import { HeavyTableBefore } from './components/HeavyTableBefore'
import { HeavyCalculatorBefore } from './components/HeavyCalculatorBefore'
import { HeavyDataProcessor } from './components/HeavyDataProcessor'
import { PerformanceMetrics } from './components/PerformanceMetrics'

export default function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>
          ❌ Before: Code Splitting 없음
        </h2>
        <p style={{ margin: 0, color: '#7f1d1d' }}>
          차트 라이브러리(victory, d3), 데이터 처리 라이브러리(lodash, ramda, axios), 날짜 라이브러리(moment, date-fns)가 초기 번들에 모두 포함되어 있습니다.
          <br />
          Network 탭에서 초기 로딩 시 모든 JS가 한 번에 로드되는 것을 확인하세요.
        </p>
      </div>

      <PerformanceMetrics variant="before" />

      <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>메인 콘텐츠</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          이 페이지는 무거운 컴포넌트들을 항상 렌더링합니다.
          <br />
          모든 라이브러리(victory, d3, lodash, ramda, moment, date-fns, axios)가 초기 번들에 포함되어 로드됩니다.
          <br />
          <strong style={{ color: '#dc2626' }}>초기 로딩이 느립니다!</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>무거운 차트 컴포넌트 (victory, d3)</h3>
          <HeavyChartBefore />
        </div>
        <HeavyTableBefore />
        <HeavyCalculatorBefore />
        <HeavyDataProcessor />
      </div>
    </div>
  )
}

