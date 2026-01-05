// 캐시 엔트리 인터페이스
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time To Live (밀리초)
}

// Before: 캐싱 없음
export async function fetchUserNoCache(userId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

// After: 메모리 캐싱
const cache = new Map<string, CacheEntry<any>>();

export async function fetchUserCached(userId: number) {
  const cacheKey = `user-${userId}`;
  const cached = cache.get(cacheKey);

  // 캐시 히트 확인
  if (cached) {
    const age = Date.now() - cached.timestamp;
    if (age < cached.ttl) {
      console.log("✅ 캐시 히트:", cacheKey, `(나이: ${age}ms)`);
      return cached.data;
    } else {
      // TTL 만료
      console.log("⏰ 캐시 만료:", cacheKey);
      cache.delete(cacheKey);
    }
  }

  // 캐시 미스 - 네트워크 요청
  console.log("❌ 캐시 미스:", cacheKey);
  const data = await fetchUserNoCache(userId);
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl: 60000, // 60초
  });

  return data;
}

// 캐시 무효화
export function invalidateCache(key: string) {
  const deleted = cache.delete(key);
  if (deleted) {
    console.log("🗑️ 캐시 무효화:", key);
  }
  return deleted;
}

// 패턴으로 캐시 무효화
export function invalidateCachePattern(pattern: string) {
  const regex = new RegExp(pattern);
  let count = 0;
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      count++;
    }
  }
  if (count > 0) {
    console.log(`🗑️ 캐시 무효화 (패턴: ${pattern}): ${count}개`);
  }
  return count;
}

// 모든 캐시 삭제
export function clearCache() {
  const size = cache.size;
  cache.clear();
  console.log(`🗑️ 모든 캐시 삭제: ${size}개`);
  return size;
}

// 캐시 상태 조회
export function getCacheStats() {
  const entries: Array<{ key: string; age: number; ttl: number }> = [];
  for (const [key, entry] of cache.entries()) {
    entries.push({
      key,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
    });
  }
  return {
    size: cache.size,
    entries,
  };
}

