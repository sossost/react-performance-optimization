// Before 페이지용: static import로 사용
// 무거운 계산을 수행하는 컴포넌트
import _ from 'lodash'

export function HeavyCalculatorBefore() {
  // 무거운 계산 시뮬레이션
  const performHeavyCalculation = () => {
    const data = Array.from({ length: 10000 }, (_, i) => i)
    
    // lodash의 다양한 함수 사용
    const shuffled = _.shuffle(data)
    const chunked = _.chunk(shuffled, 100)
    const flattened = _.flatten(chunked)
    const unique = _.uniq(flattened)
    const sorted = _.sortBy(unique)
    const grouped = _.groupBy(sorted, (n) => Math.floor(n / 1000))
    const mapped = _.mapValues(grouped, (arr) => _.sum(arr))
    
    return {
      total: _.sum(Object.values(mapped)),
      avg: _.mean(Object.values(mapped)),
      max: _.max(Object.values(mapped)),
      min: _.min(Object.values(mapped)),
    }
  }

  const result = performHeavyCalculation()

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>무거운 계산 컴포넌트 (lodash 사용)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>합계</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{result.total.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>평균</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{result.avg.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>최대값</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{result.max?.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>최소값</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{result.min?.toLocaleString()}</div>
        </div>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        10,000개 데이터를 lodash로 처리하여 통계를 계산합니다.
      </p>
    </div>
  )
}

