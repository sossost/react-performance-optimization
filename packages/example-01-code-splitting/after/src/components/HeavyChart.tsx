// 무거운 유틸리티 라이브러리들
import _ from 'lodash'
import moment from 'moment'
import { format } from 'date-fns'
import * as R from 'ramda'

const generateData = () => {
  const data = []
  for (let i = 0; i < 500; i++) {
    data.push({
      x: i,
      y: Math.sin(i / 10) * 100 + Math.random() * 50,
      barY: Math.random() * 100,
    })
  }
  return data
}

const pieData = [
  { x: 'A', y: 400 },
  { x: 'B', y: 300 },
  { x: 'C', y: 300 },
  { x: 'D', y: 200 },
]

export function HeavyChart() {
  const data = generateData()
  
  // lodash로 복잡한 데이터 처리
  const processedData = _.chain(data)
    .map((item) => ({
      ...item,
      date: moment().subtract(item.x, 'days').format('YYYY-MM-DD'),
      formattedDate: format(new Date(), 'yyyy-MM-dd'),
    }))
    .groupBy((item) => Math.floor(item.x / 50))
    .mapValues((items) => ({
      avg: _.meanBy(items, 'y'),
      max: _.maxBy(items, 'y')?.y || 0,
      min: _.minBy(items, 'y')?.y || 0,
      count: items.length,
    }))
    .value()

  // ramda로 추가 데이터 처리
  const ramdaProcessed = R.pipe(
    R.map((item: any) => item.y),
    R.filter((y: number) => y > 50),
    R.groupBy((y: number) => Math.floor(y / 20)),
    R.map((values: number[]) => ({
      count: values.length,
      sum: R.sum(values),
      avg: R.mean(values),
    }))
  )(data)

  // date-fns로 날짜 처리
  const dateProcessed = data.map((item) => ({
    ...item,
    formatted: format(moment().subtract(item.x, 'days').toDate(), 'yyyy-MM-dd HH:mm:ss'),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ width: '100%', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ marginBottom: '1rem' }}>무거운 데이터 처리 컴포넌트 (lodash, ramda, moment, date-fns)</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Lodash 처리</h5>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>그룹 수: {Object.keys(processedData).length}</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>샘플 평균: {Object.values(processedData)[0]?.avg.toFixed(2) || 0}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Ramda 처리</h5>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>그룹 수: {Object.keys(ramdaProcessed).length}</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>샘플 합계: {Object.values(ramdaProcessed)[0]?.sum.toFixed(2) || 0}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Date-fns 처리</h5>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>처리된 날짜: {dateProcessed.length}</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>샘플: {dateProcessed[0]?.formatted}</p>
          </div>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
          <h5 style={{ marginBottom: '0.5rem' }}>데이터 통계</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {Object.entries(processedData).slice(0, 4).map(([key, value]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>그룹 {key}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{value.avg.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
