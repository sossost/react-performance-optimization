import React, { useMemo } from "react";
import type { SearchItem } from "../types";
import { ItemRow } from "./ItemRow";

interface ResultsListProps {
  items: SearchItem[];
  height: number;
}

export const ResultsList = React.memo(function ResultsList({
  items,
  height,
}: ResultsListProps) {
  const rows = useMemo(
    () => items.map((item, index) => <ItemRow key={item.id} item={item} index={index} />),
    [items]
  );

  return (
    <div
      style={{
        height,
        marginTop: "0.75rem",
        overflow: "auto",
        borderRadius: "0.5rem",
        border: "1px solid #e2e8f0",
      }}
    >
      {rows}
    </div>
  );
});
