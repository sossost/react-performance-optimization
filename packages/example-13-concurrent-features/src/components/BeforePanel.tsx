import { useMemo, useState } from "react";
import type { SearchItem } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";
import { filterItems } from "../utils";
import { ItemRow } from "./ItemRow";
import { Panel } from "./Panel";

interface BeforePanelProps {
  items: SearchItem[];
  listHeight: number;
  workFactor: number;
}

export function BeforePanel({ items, listHeight, workFactor }: BeforePanelProps) {
  const [query, setQuery] = useState("");
  const renderCount = useRenderCount();

  const { results, computeMs } = useMemo(
    () => filterItems(items, query, workFactor),
    [items, query, workFactor]
  );

  const queryLabel = query.trim() ? `"${query}"` : "-";

  return (
    <Panel
      title="Before: 동기 업데이트"
      description="입력과 리스트 필터링을 동일 우선순위로 처리합니다."
      badge="Before"
      accentColor="#dc2626"
      badgeBackground="#fee2e2"
      badgeBorder="#fecaca"
      metrics={[
        {
          label: "검색 결과",
          value: `${results.length.toLocaleString()}개`,
        },
        {
          label: "필터 계산",
          value: `${computeMs}ms`,
          hint: `입력 ${queryLabel}`,
        },
        {
          label: "리렌더링",
          value: `${renderCount}회`,
        },
        {
          label: "입력값",
          value: queryLabel,
        },
      ]}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #e2e8f0",
            fontSize: "0.9rem",
          }}
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          style={{
            padding: "0.45rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #fecaca",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          초기화
        </button>
      </div>
      <div
        style={{
          height: listHeight,
          marginTop: "0.75rem",
          overflow: "auto",
          borderRadius: "0.5rem",
          border: "1px solid #e2e8f0",
        }}
      >
        {results.map((item, index) => (
          <ItemRow key={item.id} item={item} index={index} />
        ))}
      </div>
    </Panel>
  );
}
