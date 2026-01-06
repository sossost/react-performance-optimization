import { useDeferredValue, useMemo, useState, useTransition } from "react";
import type { SearchItem } from "../types";
import { useRenderCount } from "../hooks/useRenderCount";
import { filterItems } from "../utils";
import { Panel } from "./Panel";
import { ResultsList } from "./ResultsList";

interface AfterPanelProps {
  items: SearchItem[];
  listHeight: number;
  workFactor: number;
}

export function AfterPanel({ items, listHeight, workFactor }: AfterPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filterValue);
  const renderCount = useRenderCount();

  const { results, computeMs } = useMemo(
    () => filterItems(items, deferredFilter, workFactor),
    [items, deferredFilter, workFactor]
  );

  const inputLabel = inputValue.trim() ? `"${inputValue}"` : "-";
  const deferredLabel = deferredFilter.trim() ? `"${deferredFilter}"` : "-";
  const pendingState = isPending || deferredFilter !== filterValue;

  return (
    <Panel
      title="After: Transition + Deferred"
      description="입력은 즉시 반영하고, 리스트는 비긴급 업데이트로 처리합니다."
      badge="After"
      accentColor="#059669"
      badgeBackground="#d1fae5"
      badgeBorder="#a7f3d0"
      metrics={[
        {
          label: "검색 결과",
          value: `${results.length.toLocaleString()}개`,
        },
        {
          label: "필터 계산",
          value: `${computeMs}ms`,
          hint: `적용 ${deferredLabel}`,
        },
        {
          label: "리렌더링",
          value: `${renderCount}회`,
        },
        {
          label: "입력값",
          value: inputLabel,
        },
        {
          label: "Pending",
          value: pendingState ? "ON" : "OFF",
          hint: pendingState ? "Transition 진행 중" : "대기",
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
          value={inputValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setInputValue(nextValue);
            startTransition(() => {
              setFilterValue(nextValue);
            });
          }}
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
        <span
          style={{
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            border: `1px solid ${pendingState ? "#93c5fd" : "#bbf7d0"}`,
            backgroundColor: pendingState ? "#dbeafe" : "#dcfce7",
            color: pendingState ? "#1d4ed8" : "#166534",
          }}
        >
          {pendingState ? "업데이트 중" : "대기"}
        </span>
        <button
          type="button"
          onClick={() => {
            setInputValue("");
            startTransition(() => {
              setFilterValue("");
            });
          }}
          style={{
            padding: "0.45rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #a7f3d0",
            backgroundColor: "#d1fae5",
            color: "#047857",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          초기화
        </button>
      </div>
      <div aria-busy={pendingState}>
        <ResultsList items={results} height={listHeight} />
      </div>
    </Panel>
  );
}
