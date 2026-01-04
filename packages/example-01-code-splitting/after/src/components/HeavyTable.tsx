// 무거운 유틸리티 라이브러리를 사용하는 테이블 컴포넌트
import _ from 'lodash'
import moment from 'moment'

interface TableData {
  id: number
  name: string
  value: number
  date: string
  category: string
}

const generateTableData = (): TableData[] => {
  const categories = ['A', 'B', 'C', 'D', 'E']
  const data: TableData[] = []
  
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      date: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      category: categories[i % categories.length],
    })
  }
  
  return _.sortBy(data, 'value')
}

export function HeavyTable() {
  const data = generateTableData()
  const grouped = _.groupBy(data, 'category')
  const stats = _.mapValues(grouped, (items) => ({
    count: items.length,
    avg: _.meanBy(items, 'value'),
    sum: _.sumBy(items, 'value'),
  }))

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ marginBottom: '1rem' }}>무거운 테이블 컴포넌트 (lodash, moment 사용)</h3>
      
      {/* 통계 */}
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>카테고리별 통계</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {Object.entries(stats).map(([category, stat]) => (
            <div key={category} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600' }}>{category}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                평균: {stat.avg.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>이름</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>값</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>날짜</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>카테고리</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem' }}>{row.id}</td>
                <td style={{ padding: '0.75rem' }}>{row.name}</td>
                <td style={{ padding: '0.75rem' }}>{row.value.toFixed(2)}</td>
                <td style={{ padding: '0.75rem' }}>{row.date}</td>
                <td style={{ padding: '0.75rem' }}>{row.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

