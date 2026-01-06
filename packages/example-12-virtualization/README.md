# 예제 12: 대용량 데이터 가상화 (Virtualization)

## 목적

React **Virtualization 최적화 기법**을 독립적으로 학습하기 위한 예제입니다.
Before/After를 나란히 비교할 수 있는 실습 코드를 포함합니다.

---

## 구조

아래 구조로 구현되어 있습니다.

- **Before 모드**

  - 모든 항목을 한 번에 렌더링
  - 대용량 리스트에서 초기 렌더링 시간 증가
  - 스크롤 시 모든 항목이 DOM에 존재하여 메모리 사용량 증가
  - 스크롤 성능 저하 (특히 모바일)

- **After 모드**

  - react-window를 사용한 가상화 적용
  - 보이는 영역(viewport)의 항목만 렌더링
  - 초기 렌더링 시간 단축
  - 메모리 사용량 감소
  - 부드러운 스크롤 성능

- **레이아웃**

  - Before/After 모드를 나란히 비교할 수 있는 레이아웃
  - 항목 수 조절 기능으로 성능 차이 확인
  - 렌더링된 DOM 노드 수 실시간 표시
  - 스크롤 성능 측정 가능

---

## 📚 이론: Virtualization 원리와 전략

## 1. 개요 (Overview)

**Virtualization (가상화)**은 대용량 리스트나 테이블에서 보이는 영역(viewport)의 항목만 렌더링하여 성능을 최적화하는 기법입니다.

Virtualization의 핵심 개념:

- **Windowing**: 보이는 영역만 렌더링하고 나머지는 가상화
- **Dynamic Height**: 항목 높이가 동적일 때의 처리
- **Overscan**: 스크롤 시 깜빡임 방지를 위한 추가 렌더링
- **Virtual Scrolling**: 실제 스크롤 위치를 가상 스크롤로 변환

---

## 2. Virtualization과 성능의 관계

Virtualization은 대용량 리스트 렌더링 성능에 직접적인 영향을 줍니다.

### 2.1 초기 렌더링 시간 단축

- **Before**: 10,000개 항목을 모두 렌더링하면 초기 렌더링 시간이 수 초 소요
- **After**: 보이는 20-30개 항목만 렌더링하면 초기 렌더링 시간이 수십 밀리초로 단축
- **효과**: 초기 렌더링 시간 90-95% 감소

### 2.2 메모리 사용량 감소

- **Before**: 모든 항목이 DOM에 존재하여 메모리 사용량이 항목 수에 비례하여 증가
- **After**: 보이는 항목만 DOM에 존재하여 메모리 사용량이 일정하게 유지
- **효과**: 메모리 사용량 90-95% 감소 (10,000개 항목 기준)

### 2.3 스크롤 성능 개선

- **Before**: 모든 항목이 DOM에 있어 스크롤 시 레이아웃 계산 비용 증가
- **After**: 보이는 항목만 DOM에 있어 스크롤 시 레이아웃 계산 비용 최소화
- **효과**: 스크롤 FPS 개선 (특히 모바일에서 30fps → 60fps)

### 2.4 DOM 노드 수 감소

- **Before**: 항목 수만큼 DOM 노드 생성 (10,000개 항목 = 10,000개 노드)
- **After**: 보이는 항목 수만큼만 DOM 노드 생성 (10,000개 항목 = 20-30개 노드)
- **효과**: DOM 노드 수 99% 감소

---

## 3. 문제 상황: 대용량 리스트를 모두 렌더링하는 경우

### ❌ Bad Case

```tsx
function List({ items }) {
  return (
    <div style={{ height: "600px", overflow: "auto" }}>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// 10,000개 항목 렌더링
<List items={Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))} />
```

### 문제점

- **초기 렌더링 시간**: 10,000개 항목을 모두 렌더링하면 수 초 소요
- **메모리 사용량**: 모든 항목이 DOM에 존재하여 메모리 사용량 증가
- **스크롤 성능**: 스크롤 시 모든 항목의 레이아웃을 계산해야 하여 성능 저하
- **인터랙션 지연**: 초기 로딩 후에도 인터랙션이 느려짐

---

## 4. Virtualization 라이브러리

### 4.1 react-window

가장 널리 사용되는 가상화 라이브러리입니다.

**특징:**

- 가볍고 빠름 (번들 크기 작음)
- 고정 높이와 동적 높이 모두 지원
- 다양한 컴포넌트 제공 (FixedSizeList, VariableSizeList, FixedSizeGrid 등)

**기본 사용법:**

```tsx
import { FixedSizeList } from "react-window";

function List({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ListItem item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 4.2 react-virtual

TanStack에서 개발한 최신 가상화 라이브러리입니다.

**특징:**

- TypeScript 지원 우수
- 더 유연한 API
- 동적 높이 처리 강화

**기본 사용법:**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function List({ items }) {
  const parentRef = useRef();

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4.3 react-virtualized (레거시)

오래된 라이브러리로, 현재는 react-window나 react-virtual 사용을 권장합니다.

---

## 5. Virtualization 전략

### 5.1 고정 높이 리스트

모든 항목의 높이가 동일한 경우 가장 간단합니다.

```tsx
import { FixedSizeList } from "react-window";

function FixedHeightList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50} // 고정 높이
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ListItem item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 5.2 동적 높이 리스트

항목의 높이가 다른 경우 `VariableSizeList`를 사용합니다.

```tsx
import { VariableSizeList } from "react-window";

function VariableHeightList({ items }) {
  const getItemSize = (index) => {
    // 항목별 높이 반환
    return items[index].height || 50;
  };

  return (
    <VariableSizeList
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ListItem item={items[index]} />
        </div>
      )}
    </VariableSizeList>
  );
}
```

**주의사항:**

- 동적 높이는 초기 렌더링 시 정확한 높이를 알 수 없어 추정값을 사용
- 스크롤 후 실제 높이를 측정하여 업데이트하는 과정이 필요
- `resetAfterIndex`를 사용하여 높이 변경 시 캐시 무효화

### 5.3 그리드 가상화

2차원 그리드(테이블)를 가상화할 때는 `FixedSizeGrid`를 사용합니다.

```tsx
import { FixedSizeGrid } from "react-window";

function Grid({ data }) {
  return (
    <FixedSizeGrid
      columnCount={10}
      columnWidth={100}
      height={600}
      rowCount={data.length}
      rowHeight={50}
      width={1000}
    >
      {({ columnIndex, rowIndex, style }) => (
        <div style={style}>
          {data[rowIndex][columnIndex]}
        </div>
      )}
    </FixedSizeGrid>
  );
}
```

### 5.4 Overscan 설정

스크롤 시 깜빡임을 방지하기 위해 보이는 영역 외부의 항목도 미리 렌더링합니다.

```tsx
<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  overscanCount={5} // 위아래 5개씩 추가 렌더링
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  )}
</FixedSizeList>
```

**트레이드오프:**

- `overscanCount`가 크면: 깜빡임 없음, 하지만 더 많은 항목 렌더링
- `overscanCount`가 작으면: 렌더링 항목 수 최소화, 하지만 스크롤 시 깜빡임 가능

---

## 6. Virtualization 적용 기준

### 언제 사용해야 할까?

**Virtualization 적용 권장:**

- 리스트 항목이 **1,000개 이상**인 경우
- 각 항목의 렌더링 비용이 큰 경우
- 모바일 환경에서 스크롤 성능이 중요한 경우
- 무한 스크롤을 구현하는 경우

**Virtualization 불필요:**

- 리스트 항목이 **100개 미만**인 경우 (오버헤드가 더 클 수 있음)
- 항목이 매우 간단한 경우 (텍스트만 있는 경우 등)
- 항목 높이가 매우 동적이고 예측 불가능한 경우

### 성능 임계점

일반적으로 다음 기준을 사용합니다:

- **100-500개**: Virtualization 고려 (항목 복잡도에 따라)
- **500-1,000개**: Virtualization 권장
- **1,000개 이상**: Virtualization 필수

---

## 7. 주의사항

### 7.1 동적 높이 처리

동적 높이 리스트는 복잡도가 높습니다.

**문제점:**

- 초기 렌더링 시 정확한 높이를 알 수 없음
- 스크롤 후 실제 높이를 측정하여 업데이트 필요
- 높이 변경 시 캐시 무효화 필요

**해결 방법:**

- 가능하면 고정 높이 사용
- 동적 높이가 필요하면 `VariableSizeList` 사용
- `resetAfterIndex`로 높이 변경 시 캐시 무효화

### 7.2 검색/필터링

검색이나 필터링 시 가상화된 리스트의 높이를 재계산해야 합니다.

```tsx
const listRef = useRef();

function handleFilter(filteredItems) {
  setItems(filteredItems);
  // 리스트 높이 재계산
  listRef.current?.resetAfterIndex(0);
}
```

### 7.3 무한 스크롤과 결합

무한 스크롤과 Virtualization을 결합할 때는 스크롤 위치를 유지해야 합니다.

```tsx
const [items, setItems] = useState(initialItems);

function loadMore() {
  // 새 항목 추가
  setItems([...items, ...newItems]);
  // 뒤에 추가 시에는 대체로 유지되지만, 앞에 추가되면 scrollOffset 보정 필요
}
```

### 7.4 접근성 (Accessibility)

가상화된 리스트는 접근성 고려가 필요합니다.

- 키보드 네비게이션 지원
- 스크린 리더를 위한 ARIA 속성
- 포커스 관리

---

## 8. 코드 스멜: Virtualization을 잘못 사용하는 경우

- **작은 리스트에 Virtualization 적용**: 100개 미만 리스트에 적용하면 오버헤드가 더 큼
- **동적 높이를 고정 높이로 처리**: 항목 높이가 다른데 `FixedSizeList` 사용 → 레이아웃 깨짐
- **Overscan을 너무 크게 설정**: 성능 저하, 메모리 사용량 증가
- **검색/필터링 후 리스트 높이 재계산 안 함**: 스크롤 위치가 어긋남
- **항목 컴포넌트에 인라인 스타일 누락**: `style` prop을 전달하지 않으면 레이아웃 깨짐

---

## 9. 실전 적용 체크리스트

- 리스트 항목이 1,000개 이상인가? → Virtualization 적용 고려
- 항목 높이가 고정인가? → `FixedSizeList` 사용
- 항목 높이가 동적인가? → `VariableSizeList` 사용, `resetAfterIndex` 활용
- 2차원 그리드인가? → `FixedSizeGrid` 사용
- 스크롤 시 깜빡임이 있는가? → `overscanCount` 조정
- 검색/필터링 기능이 있는가? → 필터링 후 `resetAfterIndex` 호출
- 무한 스크롤이 필요한가? → `onItemsRendered` 콜백 활용
- 접근성이 중요한가? → 키보드 네비게이션 및 ARIA 속성 추가

---

## 실행 방법

```bash
yarn install
yarn dev:e12
```

- 접속: [http://localhost:5185](http://localhost:5185)
- 상단에서 항목 수와 overscan을 조절한 뒤 Before/After를 비교하세요.

---

## 측정 방법

### 1. 초기 렌더링 시간 확인

**Before 모드:**

- 항목 수를 10,000개로 설정
- 페이지 로드 후 초기 렌더링 시간 측정 (React DevTools Profiler)
- 일반적으로 2-5초 소요

**After 모드:**

- 항목 수를 10,000개로 설정
- 페이지 로드 후 초기 렌더링 시간 측정
- 일반적으로 50-100ms 소요

### 2. DOM 노드 수 확인

**Before 모드:**

- 개발자 도구 > Elements > 검색: `div` 또는 리스트 항목 클래스명
- DOM 노드 수 = 항목 수 (10,000개 항목 = 10,000개 노드)

**After 모드:**

- DOM 노드 수 = 보이는 항목 수 + overscan (일반적으로 20-40개)

### 3. 메모리 사용량 확인

**Before 모드:**

- 개발자 도구 > Performance > Memory
- 항목 수 증가에 따라 메모리 사용량 선형 증가

**After 모드:**

- 메모리 사용량이 항목 수와 무관하게 일정하게 유지

### 4. 스크롤 성능 확인

**Before 모드:**

- 개발자 도구 > Performance > Record
- 스크롤 시 FPS 저하 (특히 모바일에서 30fps 이하)
- 레이아웃 재계산 시간 증가

**After 모드:**

- 스크롤 시 FPS 유지 (60fps)
- 레이아웃 재계산 시간 최소화

### 5. 실전 테스트 방법

1. **Before 모드에서 테스트**:

   - 항목 수를 10,000개로 설정
   - 페이지 로드 시간 확인 (느림)
   - 스크롤 시 성능 확인 (버벅임)
   - 개발자 도구에서 DOM 노드 수 확인

2. **After 모드로 전환 후 테스트**:

   - 항목 수를 10,000개로 설정
   - 페이지 로드 시간 확인 (빠름)
   - 스크롤 시 성능 확인 (부드러움)
   - 개발자 도구에서 DOM 노드 수 확인 (일정)

3. **React DevTools Profiler 사용**:
   - 개발자 도구 > Profiler > Record
   - 항목 수 변경 및 스크롤
   - Before/After 모드의 렌더링 차이를 시각적으로 확인

---

## 핵심 요약

- Virtualization은 **대용량 리스트의 성능을 최적화**하는 기법
- **보이는 영역만 렌더링**하여 초기 렌더링 시간, 메모리 사용량, 스크롤 성능 개선
- **react-window** 또는 **react-virtual** 사용
- **1,000개 이상** 리스트에서 효과적
- **고정 높이**가 가장 간단하고 효율적
- **동적 높이**는 복잡도가 높으므로 가능하면 고정 높이 사용

---

## 📚 참고 자료 (References)

**Virtualization 가이드**

- [react-window 공식 문서](https://github.com/bvaughn/react-window) - react-window 라이브러리
- [react-virtual 공식 문서](https://github.com/TanStack/virtual) - react-virtual 라이브러리
- [Web.dev: Virtualize long lists](https://web.dev/virtualize-long-lists-react-window/) - Virtualization 가이드

**성능 최적화**

- [React 공식 문서: Optimizing Performance](https://react.dev/learn/render-and-commit) - 성능 최적화 가이드
- [Web.dev: React Performance](https://web.dev/react/) - React 성능 최적화

**관련 라이브러리:**

- **react-window**: 가볍고 빠른 가상화 라이브러리
- **react-virtual**: TanStack의 최신 가상화 라이브러리
- **react-virtualized**: 레거시 라이브러리 (사용 비권장)
