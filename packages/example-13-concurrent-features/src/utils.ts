import type { SearchItem } from "./types";

const CATEGORIES = [
  "배포",
  "API",
  "캐시",
  "렌더링",
  "상태",
  "테스트",
  "보안",
  "로깅",
];

const STATUS = ["대기", "처리중", "완료", "실패", "재시도"];

export function createItems(count: number): SearchItem[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const category = CATEGORIES[id % CATEGORIES.length];
    const status = STATUS[id % STATUS.length];
    const score = 50 + ((id * 17) % 50);

    return {
      id,
      title: `작업 ${id}`,
      category,
      description: `${status} · 배치 ${(id % 12) + 1} · 응답 ${score}점`,
      score,
    };
  });
}

function spinWork(seed: number, iterations: number) {
  let value = seed;
  for (let i = 0; i < iterations; i += 1) {
    value = (value * 31 + i) % 1000003;
  }
  return value;
}

export function filterItems(
  items: SearchItem[],
  query: string,
  workFactor: number
) {
  const start = performance.now();
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      results: items,
      computeMs: 0,
    };
  }

  const results: SearchItem[] = [];
  for (const item of items) {
    const haystack = `${item.title} ${item.category} ${item.description}`.toLowerCase();
    if (!haystack.includes(normalized)) {
      continue;
    }
    if (workFactor > 0) {
      spinWork(haystack.length, workFactor);
    }
    results.push(item);
  }

  const end = performance.now();

  return {
    results,
    computeMs: Math.round(end - start),
  };
}
