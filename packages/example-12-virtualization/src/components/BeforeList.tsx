import type { ListItem } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";
import { useScrollStats } from "../hooks/useScrollStats";
import { ItemRow } from "./ItemRow";
import { ListPanel } from "./ListPanel";

interface BeforeListProps {
  items: ListItem[];
  listHeight: number;
  itemHeight: number;
}

export function BeforeList({ items, listHeight, itemHeight }: BeforeListProps) {
  const renderCount = useRenderCount();
  const { eventsPerSecond, lastOffset, registerScroll } = useScrollStats();

  const totalHeight = items.length * itemHeight;

  return (
    <ListPanel
      title="Before: 전체 렌더링"
      description="모든 항목을 한 번에 렌더링하고 DOM에 유지합니다."
      badge="Before"
      accentColor="#dc2626"
      badgeBackground="#fee2e2"
      badgeBorder="#fecaca"
      metrics={[
        {
          label: "DOM 노드 수",
          value: `${items.length.toLocaleString()}개`,
          hint: `총 높이 ${totalHeight.toLocaleString()}px`,
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
        onScroll={(event) => registerScroll(event.currentTarget.scrollTop)}
        style={{
          height: listHeight,
          overflow: "auto",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        }}
      >
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            style={{ height: itemHeight }}
          />
        ))}
      </div>
    </ListPanel>
  );
}
