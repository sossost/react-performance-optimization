// Suspense를 위한 캐시 구현
// Promise를 throw하는 방식으로 Suspense와 통합

type CacheEntry<T> = {
  promise: Promise<T>;
  data?: T;
  error?: Error;
  status: "pending" | "resolved" | "rejected";
};

const cache = new Map<string, CacheEntry<any>>();

export function useSuspenseQuery<T>(
  key: string,
  queryFn: () => Promise<T>
): T {
  // 캐시에 데이터가 있으면 반환
  const entry = cache.get(key);
  if (entry?.status === "resolved" && entry.data !== undefined) {
    return entry.data;
  }

  // 에러가 있으면 throw
  if (entry?.status === "rejected" && entry.error) {
    throw entry.error;
  }

  // Promise가 있으면 throw (Suspense가 처리)
  if (entry?.status === "pending" && entry.promise) {
    throw entry.promise;
  }

  // 새로운 Promise 생성
  const promise = queryFn()
    .then((data) => {
      const entry = cache.get(key);
      if (entry) {
        entry.data = data;
        entry.status = "resolved";
      }
      return data;
    })
    .catch((error) => {
      const entry = cache.get(key);
      if (entry) {
        entry.error = error;
        entry.status = "rejected";
      }
      throw error;
    });

  // 캐시에 저장
  cache.set(key, { promise, status: "pending" });

  // Promise를 throw하여 Suspense가 처리하도록 함
  throw promise;
}

// 캐시 초기화 (테스트용)
export function clearCache() {
  cache.clear();
}

