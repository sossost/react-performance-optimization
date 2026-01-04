// Before 페이지용: static import로 사용
// 무거운 데이터 처리 라이브러리들을 사용하는 컴포넌트
import _ from 'lodash'
import * as R from 'ramda'
import moment from 'moment'
import { format, addDays, subDays, differenceInDays } from 'date-fns'

const generateMassiveData = () => {
  const data = []
  for (let i = 0; i < 10000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      date: moment().subtract(i, 'days').toDate(),
      category: `Category ${Math.floor(Math.random() * 10)}`,
      tags: Array.from({ length: 5 }, (_, j) => `tag-${j}`),
    })
  }
  return data
}

export function HeavyDataProcessor() {
  const data = generateMassiveData()

  // lodash로 복잡한 데이터 처리
  const lodashProcessed = _.chain(data)
    .groupBy('category')
    .mapValues((items) => ({
      count: items.length,
      avg: _.meanBy(items, 'value'),
      sum: _.sumBy(items, 'value'),
      dates: _.map(items, (item) => format(item.date, 'yyyy-MM-dd')),
    }))
    .value()

  // ramda로 복잡한 데이터 처리
  const ramdaProcessed = R.pipe(
    R.groupBy((item: any) => item.category),
    R.map((items: any[]) => ({
      count: items.length,
      avg: R.mean(R.map((item: any) => item.value, items)),
      sum: R.sum(R.map((item: any) => item.value, items)),
      dates: R.map((item: any) => format(item.date, 'yyyy-MM-dd'), items),
    }))
  )(data)

  // date-fns로 날짜 처리
  const dateProcessed = data.map((item) => ({
    ...item,
    formatted: format(item.date, 'yyyy-MM-dd HH:mm:ss'),
    daysAgo: differenceInDays(new Date(), item.date),
    futureDate: format(addDays(item.date, 30), 'yyyy-MM-dd'),
  }))

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>무거운 데이터 처리 컴포넌트 (lodash, ramda, moment, date-fns)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Lodash 처리</h4>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>카테고리 수: {Object.keys(lodashProcessed).length}</p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>총 아이템: {data.length}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Ramda 처리</h4>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>카테고리 수: {Object.keys(ramdaProcessed).length}</p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>총 아이템: {data.length}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Date-fns 처리</h4>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>처리된 날짜: {dateProcessed.length}</p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>샘플: {dateProcessed[0]?.formatted}</p>
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
        10,000개 데이터를 lodash, ramda, moment, date-fns로 처리합니다.
      </p>
    </div>
  )
}

