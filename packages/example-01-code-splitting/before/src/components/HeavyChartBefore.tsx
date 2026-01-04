// Before 페이지용: static import로 사용
// 무거운 차트 라이브러리 (victory, d3)를 사용하는 컴포넌트
import {
  VictoryLine,
  VictoryChart,
  VictoryBar,
  VictoryPie,
  VictoryAxis,
  VictoryTheme,
  VictoryContainer,
} from 'victory'
import * as d3 from 'd3'
import { group, rollup } from 'd3-array'
// 무거운 유틸리티 라이브러리들
import _ from 'lodash'
import moment from 'moment'
import { format } from 'date-fns'

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

export function HeavyChartBefore() {
  const data = generateData()
  const processedData = _.map(data, (item) => ({
    ...item,
    date: moment().subtract(item.x, 'days').format('YYYY-MM-DD'),
    formattedDate: format(new Date(), 'yyyy-MM-dd'),
  }))

  // d3로 추가 데이터 처리 (더 무겁게 만들기)
  const d3Processed = Array.from(
    rollup(
      processedData,
      (values) => ({
        avg: d3.mean(values, (d: any) => d.y) || 0,
        count: values.length,
      }),
      (d: any) => Math.floor(d.x / 50)
    )
  ).map(([key, value]) => ({ key: String(key), ...value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 라인 차트 */}
      <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>라인 차트 (500개 데이터 포인트)</h4>
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive />}
          height={300}
        >
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryLine
            data={processedData}
            style={{
              data: { stroke: '#3b82f6', strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </div>

      {/* 바 차트 */}
      <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>바 차트</h4>
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive />}
          height={300}
        >
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={processedData.slice(0, 100)}
            style={{
              data: { fill: '#10b981' },
            }}
          />
        </VictoryChart>
      </div>

      {/* 파이 차트 */}
      <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>파이 차트</h4>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <VictoryPie
            data={pieData}
            colorScale={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
            height={300}
            containerComponent={<VictoryContainer responsive />}
            labelRadius={({ innerRadius }) => innerRadius + 30}
            style={{
              labels: { fill: '#374151', fontSize: 12, fontWeight: 'bold' },
            }}
          />
        </div>
      </div>
    </div>
  )
}
