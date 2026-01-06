import React, { useRef } from "react";

interface Item {
  id: number;
  name: string;
}

interface FilteredListProps {
  mode: "before" | "after";
  items: Item[];
  filter: string;
}

// Before: 매번 필터링 계산 실행 - App이 리렌더링되면 무조건 계산 실행
function FilteredListBefore({ items, filter }: { items: Item[]; filter: string }) {
  const renderCount = useRef(0);
  const calculationCount = useRef(0);
  renderCount.current += 1;

  // 매번 필터링 계산 실행
  calculationCount.current += 1;
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
        결과: {filteredItems.length}개
      </p>
      <div style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
      <div style={{ fontSize: "0.85rem", color: "#dc2626" }}>
        계산: {calculationCount.current}회
      </div>
    </div>
  );
}

// After: React.memo + useMemo로 필터링 결과 캐싱
const FilteredListAfter = React.memo(function FilteredListAfter({
  items,
  filter,
}: {
  items: Item[];
  filter: string;
}) {
  const renderCount = useRef(0);
  const calculationCount = useRef(0);
  renderCount.current += 1;

  // useMemo로 필터링 결과 캐싱 - items나 filter가 변경될 때만 재계산
  const filteredItems = React.useMemo(() => {
    calculationCount.current += 1;
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
        결과: {filteredItems.length}개
      </p>
      <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "bold" }}>
        리렌더링: {renderCount.current}회
      </div>
      <div style={{ fontSize: "0.85rem", color: "#059669" }}>
        계산: {calculationCount.current}회
      </div>
    </div>
  );
});

export function FilteredList({ mode, items, filter }: FilteredListProps) {
  if (mode === "before") {
    return <FilteredListBefore items={items} filter={filter} />;
  }
  return <FilteredListAfter items={items} filter={filter} />;
}
