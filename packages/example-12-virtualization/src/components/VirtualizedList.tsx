import { useCallback, useState } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import type { ListItem } from "../types";
import { useElementWidth } from "../hooks/useElementWidth";
import { useRenderCount } from "../hooks/useRenderCount";
import { useScrollStats } from "../hooks/useScrollStats";
import { ItemRow } from "./ItemRow";
import { ListPanel } from "./ListPanel";

interface VirtualizedListProps {
  items: ListItem[];
  listHeight: number;
  itemHeight: number;
  overscanCount: number;
}

function Row({ index, style, data }: ListChildComponentProps<ListItem[]>) {
  const item = data[index];
  return <ItemRow item={item} index={index} style={style} />;
}

export function VirtualizedList({
  items,
  listHeight,
  itemHeight,
  overscanCount,
}: VirtualizedListProps) {
  const renderCount = useRenderCount();
  const { eventsPerSecond, lastOffset, registerScroll } = useScrollStats();
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const [range, setRange] = useState({
    overscanStartIndex: 0,
    overscanStopIndex: -1,
    visibleStartIndex: 0,
    visibleStopIndex: -1,
  });

  const handleItemsRendered = useCallback(
    ({
      overscanStartIndex,
      overscanStopIndex,
      visibleStartIndex,
      visibleStopIndex,
    }: {
      overscanStartIndex: number;
      overscanStopIndex: number;
      visibleStartIndex: number;
      visibleStopIndex: number;
    }) => {
      setRange({
        overscanStartIndex,
        overscanStopIndex,
        visibleStartIndex,
        visibleStopIndex,
      });
    },
    []
  );

  const renderedCount = Math.max(
    0,
    range.overscanStopIndex - range.overscanStartIndex + 1
  );
  const visibleCount = Math.max(
    0,
    range.visibleStopIndex - range.visibleStartIndex + 1
  );
  const renderedRangeLabel =
    renderedCount > 0
      ? `#${range.overscanStartIndex + 1}~#${range.overscanStopIndex + 1}`
      : "-";
  const visibleRangeLabel =
    visibleCount > 0
      ? `#${range.visibleStartIndex + 1}~#${range.visibleStopIndex + 1}`
      : "-";

  return (
    <ListPanel
      title="After: 가상화 렌더링"
      description={`react-window로 보이는 영역과 overscan(${overscanCount})만 렌더링합니다.`}
      badge="After"
      accentColor="#059669"
      badgeBackground="#d1fae5"
      badgeBorder="#a7f3d0"
      metrics={[
        {
          label: "렌더링된 DOM",
          value: `${renderedCount}개`,
          hint: `범위 ${renderedRangeLabel}`,
        },
        {
          label: "보이는 항목",
          value: `${visibleCount}개`,
          hint: `범위 ${visibleRangeLabel}`,
        },
        {
          label: "리렌더링",
          value: `${renderCount}회`,
        },
        {
          label: "스크롤 이벤트/초",
          value: `${eventsPerSecond}회`,
        },
        {
          label: "스크롤 위치",
          value: `${Math.round(lastOffset).toLocaleString()}px`,
        },
      ]}
    >
      <div
        ref={ref}
        style={{
          height: listHeight,
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {width > 0 ? (
          <FixedSizeList
            height={listHeight}
            width={width}
            itemCount={items.length}
            itemSize={itemHeight}
            itemData={items}
            overscanCount={overscanCount}
            onItemsRendered={handleItemsRendered}
            onScroll={({ scrollOffset }) => registerScroll(scrollOffset)}
          >
            {Row}
          </FixedSizeList>
        ) : (
          <div style={{ padding: "1rem", color: "#6b7280" }}>
            리스트 크기를 계산 중입니다...
          </div>
        )}
      </div>
    </ListPanel>
  );
}
