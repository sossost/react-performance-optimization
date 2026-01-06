# 🚀 React Application Performance Optimization Guide

본 프로젝트는 **데이터 흐름(Data Flow)**을 기준으로 프론트엔드 렌더링 사이클에서 성능 병목 지점을 분석하고, 최적화 기법을 **이론(Docs)**과 **실습 예제(Code)**로 정리한 학습 가이드입니다.

---

## 📊 데이터 흐름 기반 성능 최적화 가이드

웹 애플리케이션의 성능은 데이터가 생성되어 화면에 그려지는 전체 과정에서 결정됩니다. 각 단계별 최적화 포인트를 **데이터 흐름 순서대로** 학습할 수 있도록 구성했습니다.

### 데이터 흐름 순서

```
1. 네트워크 전송
   └─ HTML, CSS, JS 리소스 다운로드
   └─ Code Splitting, Tree Shaking, 리소스 최적화

2. 데이터 패칭
   └─ API 호출, 데이터 캐싱, Suspense

3. 상태 관리
   └─ 상태 구조 최적화, Memoization

4. 렌더링
   └─ React 컴포넌트 렌더링, Virtualization, Concurrent Features

5. 브라우저 렌더링
   └─ DOM 그리기, 레이아웃, 페인팅, Web Workers

6. SSR/SSG (선택적)
   └─ 서버 사이드 렌더링, 정적 생성
```

**각 섹션은 실제 데이터 흐름 순서대로 배치되어 있으며, 섹션 내부 항목도 실행 순서에 맞게 정렬되어 있습니다.**

---

## 📚 최적화 기법 목록

### 1️⃣ 네트워크 전송 최적화

> **학습 목표:** 데이터와 리소스를 네트워크를 통해 얼마나 빠르게 전송하는가?

#### 1-1. 번들 사이즈 최적화 (Code Splitting)

거대한 JS 번들을 쪼개어 초기 로딩 속도(FCP)를 개선합니다.

- **📄 이론 문서:** [예제 README](./packages/example-01-code-splitting/README.md)의 "이론: 번들링 원리와 Code Splitting 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-01-code-splitting/`](./packages/example-01-code-splitting/README.md)
  - **Before:** 모든 라이브러리를 static import (초기 번들: 669KB, gzip: 213KB)
  - **After:** 무거운 라이브러리를 dynamic import로 분리 (초기 번들: 200KB, gzip: 63KB)
  - **효과:** 초기 번들 크기 약 70% 감소 (추가 청크는 필요 시 로드: 164KB, gzip: 55KB)
- **핵심 개념:** Route-based, Component-based, Library-based Code Splitting, Dynamic Import 패턴

#### 1-2. Tree Shaking

사용하지 않는 코드를 번들에서 제거하여 번들 크기를 최소화합니다.

- **📄 이론 문서:** [예제 README](./packages/example-02-tree-shaking/README.md)의 "이론: Tree Shaking 원리와 최적화 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-02-tree-shaking/`](./packages/example-02-tree-shaking/README.md)
  - **Before:** lodash, moment 전체 import (초기 번들: 330.63 KB, gzip: 108.84 KB)
  - **After:** lodash-es, date-fns에서 필요한 함수만 import (초기 번들: 217.42 KB, gzip: 68.28 KB)
  - **효과:** 번들 크기 약 34% 감소 (gzip 기준 약 37% 감소)
- **핵심 개념:** ES Module 사용, Side-effect 없는 모듈 작성, package.json sideEffects 설정, Named Export vs Default Export

#### 1-3. 리소스 최적화

이미지, 폰트 등 리소스를 최적화하여 전송 크기와 시간을 단축합니다.

- **💻 실습 예제:** `packages/example-03-resource-optimization/`
- **핵심 개념:** 이미지 최적화 (WebP, AVIF, Lazy Loading), 폰트 최적화 (font-display, subset), HTTP/2, HTTP/3 활용, Gzip/Brotli 압축, CDN 활용

#### 1-4. 리소스 Preload/Prefetch

필요한 리소스를 미리 로드하여 성능을 개선합니다.

- **📄 이론 문서:** [예제 README](./packages/example-04-preload-prefetch/README.md)의 "이론: 리소스 Preload/Prefetch 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-04-preload-prefetch/`](./packages/example-04-preload-prefetch/README.md)
  - **Before:** 리소스를 필요할 때만 로드 (폰트는 CSS 파싱 후 로드, 외부 리소스 연결 지연)
  - **After:** Preload로 중요한 리소스 미리 로드, Preconnect로 외부 도메인 연결 설정
  - **효과:** 폰트 로딩 시간 단축 (FOIT 방지), 외부 리소스 연결 지연 제거
- **핵심 개념:** `<link rel="preload">`, `<link rel="prefetch">`, `<link rel="preconnect">`, `<link rel="dns-prefetch">`, 리소스 우선순위 관리

#### 1-5. Service Worker 캐싱

Service Worker를 통한 캐싱 전략으로 성능 개선 및 오프라인 지원을 구현합니다.

- **📄 이론 문서:** [예제 README](./packages/example-05-service-worker-pwa/README.md)의 "이론: Service Worker 캐싱 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-05-service-worker-pwa/`](./packages/example-05-service-worker-pwa/README.md)
  - **Before:** Service Worker 없음 (네트워크 요청만 사용, 캐싱 없음)
  - **After:** Service Worker 적용 (Cache First 전략, 정적 리소스 캐싱, 오프라인 지원)
  - **효과:** 재방문 시 빠른 로딩, 오프라인에서도 기본 기능 작동
- **핵심 개념:** Service Worker 등록, 캐싱 전략 (Cache First, Network First, Stale While Revalidate), 캐시 무효화, 오프라인 지원

### 2️⃣ 데이터 패칭 최적화

> **학습 목표:** 프론트엔드에서 데이터를 얼마나 효율적으로 가져오고 관리하는가?

#### 2-1. API 호출 최적화

- **📄 이론 문서:** [예제 README](./packages/example-06-api-optimization/README.md)의 "이론: API 호출 최적화 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-06-api-optimization/`](./packages/example-06-api-optimization/README.md)
  - **Before:** 순차적 요청 (Waterfall), 중복 요청, Debouncing 없음
  - **After:** 병렬 요청 (Promise.all), Request Deduplication, Debouncing 적용, Request Cancellation
  - **효과:** 요청 시간 단축 (약 50-70%), 네트워크 트래픽 감소, 서버 부하 감소
- **핵심 개념:** Waterfall 방지 (병렬 요청), Request Deduplication, Request Cancellation, Debouncing/Throttling, Batch Requests

#### 2-2. 데이터 캐싱 전략

API 응답을 캐싱하여 중복 요청을 방지하고 성능을 개선합니다.

- **📄 이론 문서:** [예제 README](./packages/example-07-data-caching/README.md)의 "이론: 데이터 캐싱 전략 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-07-data-caching/`](./packages/example-07-data-caching/README.md)
  - **Before:** 캐싱 없음 (매번 API 호출)
  - **After:** 메모리 캐싱, TTL 적용, 캐시 무효화 기능
  - **효과:** 네트워크 요청 감소, 응답 시간 단축, 서버 부하 감소
- **핵심 개념:** 메모리 캐싱, TTL (Time To Live), 캐시 무효화 전략, LRU 캐시, 캐시 전략 비교 (Cache First, Network First, Stale While Revalidate)

#### 2-3. 비동기 로딩과 Suspense

데이터 로딩 상태를 선언적으로 관리하여 사용자 경험을 개선합니다.

- **📄 이론 문서:** [예제 README](./packages/example-08-suspense/README.md)의 "이론: React Suspense 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-08-suspense/`](./packages/example-08-suspense/README.md)
  - **Before:** 수동 로딩 상태 관리 (useState, useEffect), 모든 데이터가 로드될 때까지 기다림, 순차적 로딩
  - **After:** Suspense를 통한 선언적 로딩 상태 관리, Progressive Loading (빠른 데이터부터 먼저 표시), 병렬 데이터 페칭
  - **효과:** FCP 개선 (30-50%), 로딩 시간 단축 (40-50%), 리렌더링 감소 (66%), 인지적 성능 향상
- **핵심 개념:** Suspense 기본 원리, Progressive Loading, 병렬 데이터 페칭, 코드 스플리팅과 결합, 불필요한 리렌더링 방지, React Query / SWR와 통합

### 3️⃣ 상태 관리 최적화

> **학습 목표:** 상태 변경이 렌더링에 미치는 영향을 얼마나 최소화하는가?

#### 3-1. 상태 구조 최적화 (State Colocation)

- **📄 이론 문서:** [예제 README](./packages/example-09-state-colocation/README.md)의 "이론: State Colocation 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-09-state-colocation/`](./packages/example-09-state-colocation/README.md)
  - **Before:** 모든 상태를 상위 컴포넌트(App)에서 관리, 상태 변경 시 넓은 리렌더링 영향 범위, Props Drilling 발생
  - **After:** State Colocation 적용, 상태를 필요한 위치에 배치, 상태 변경 시 영향 범위 최소화
  - **효과:** 불필요한 리렌더링 방지, 컴포넌트 독립성 향상, Props Drilling 해결, 코드 복잡도 감소
- **핵심 개념:** 상태 위치 조정 (전역 vs 로컬), 가장 가까운 공통 조상에 배치, Context 분리 (상태 단위 분리), Props Drilling 해결, 상태 변경 영향 범위 최소화

#### 3-2. 불필요한 리렌더링 방지 (Memoization)

- **📄 이론 문서:** [예제 README](./packages/example-10-memoization/README.md)의 "이론: Memoization 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-10-memoization/`](./packages/example-10-memoization/README.md)
  - **Before:** Memoization 없음, 모든 상태 변경 시 모든 컴포넌트 리렌더링, 매번 계산 실행
  - **After:** React.memo, useMemo, useCallback 적용, 관련 없는 상태 변경 시 해당 컴포넌트는 리렌더링 안 됨, 계산 결과 캐싱
  - **효과:** 불필요한 리렌더링 방지, 계산 비용 절감, 함수/객체 참조 안정성 유지
- **핵심 개념:** React.memo (컴포넌트 메모이제이션), useMemo (계산 결과 캐싱), useCallback (함수 참조 동일성 유지), 객체/배열 메모이제이션, Context 최적화 (Provider 분리), 참조 동일성 유지

### 4️⃣ 렌더링 최적화

> **학습 목표:** React가 컴포넌트를 얼마나 효율적으로 렌더링하는가?

#### 4-1. 컴포넌트 렌더링 최적화

- **📄 이론 문서:** [예제 README](./packages/example-11-component-rendering/README.md)의 "이론: 컴포넌트 렌더링 최적화 원리와 전략" 섹션 참고
- **💻 실습 예제:** [`packages/example-11-component-rendering/`](./packages/example-11-component-rendering/README.md)
- **핵심 개념:** 안정적인 key, Early return 기반 조건부 렌더링, Error Boundary 범위 설계

#### 4-2. 대용량 데이터 가상화 (Virtualization)

- **📄 이론 문서:** [예제 README](./packages/example-12-virtualization/README.md) 참고
- **💻 실습 예제:** `packages/example-12-virtualization/` (현재 문서만 제공)
- **핵심 개념:** react-window / react-virtual, 무한 스크롤 최적화, 가상 스크롤링, Windowing 기법

#### 4-3. React 18 Concurrent Features

- **📄 이론 문서:** [예제 README](./packages/example-13-concurrent-features/README.md) 참고
- **💻 실습 예제:** `packages/example-13-concurrent-features/` (현재 문서만 제공)
- **핵심 개념:** useTransition (우선순위 조정), useDeferredValue (지연된 값), startTransition API, Automatic Batching, Concurrent Rendering

### 5️⃣ 브라우저 렌더링 최적화

> **학습 목표:** 브라우저가 DOM을 얼마나 효율적으로 그리는가?

#### 5-1. 레이아웃 최적화

- **📄 이론 문서:** [예제 README](./packages/example-14-layout-optimization/README.md) 참고
- **💻 실습 예제:** `packages/example-14-layout-optimization/` (현재 문서만 제공)
- **핵심 개념:** Layout Thrashing 방지, CSS 최적화 (will-change, contain, content-visibility), CLS (Cumulative Layout Shift) 최소화, Flexbox/Grid 최적화

#### 5-2. 페인팅 최적화

- **📄 이론 문서:** [예제 README](./packages/example-15-painting-optimization/README.md) 참고
- **💻 실습 예제:** `packages/example-15-painting-optimization/` (현재 문서만 제공)
- **핵심 개념:** GPU 가속 활용, Repaint 최소화, 애니메이션 최적화 (transform, opacity 활용), Composite Layer 최적화

#### 5-3. Web Workers 활용

- **📄 이론 문서:** [예제 README](./packages/example-16-web-workers/README.md) 참고
- **💻 실습 예제:** `packages/example-16-web-workers/` (현재 문서만 제공)
- **핵심 개념:** 메인 스레드 부하 분산, 무거운 계산 작업 오프로딩, Worker Pool 패턴

### 6️⃣ SSR/SSG 최적화

> **학습 목표:** 서버 사이드 렌더링과 정적 생성의 성능을 최적화하는가?

#### 6-1. SSR 최적화

- **핵심 개념:** Streaming SSR, Selective Hydration, Partial Prerendering, 서버 컴포넌트 활용

#### 6-2. SSG 최적화

- **핵심 개념:** Static Generation, ISR (Incremental Static Regeneration), On-Demand Revalidation, 빌드 시간 최적화

---

## 🚀 시작하기

### 전체 설치

```bash
# 루트에서 모든 패키지 의존성 설치
yarn install
```

### 예제 실행

각 예제는 루트에서 바로 실행할 수 있습니다:

```bash
# 예제 1: Code Splitting
yarn dev:e1:before  # Before 프로젝트
yarn dev:e1:after   # After 프로젝트

# 예제 2: Tree Shaking
yarn dev:e2:before  # Before 프로젝트
yarn dev:e2:after   # After 프로젝트

# 예제 3: Resource Optimization
yarn dev:e3:before  # Before 프로젝트
yarn dev:e3:after   # After 프로젝트

# 예제 4: Preload/Prefetch
yarn dev:e4:before  # Before 프로젝트
yarn dev:e4:after   # After 프로젝트

# 예제 5: Service Worker 캐싱
yarn dev:e5:before  # Before 프로젝트
yarn dev:e5:after   # After 프로젝트

# 예제 6: API 호출 최적화
yarn dev:e6  # Before/After 토글로 전환

# 예제 7: 데이터 캐싱 전략
yarn dev:e7  # Before/After 토글로 전환

# 예제 8: Suspense
yarn dev:e8  # Before/After 토글로 전환

# 예제 9: State Colocation
yarn dev:e9  # Before/After 토글로 전환

# 예제 10: Memoization
yarn dev:e10  # Before/After 토글로 전환

# 예제 11: 컴포넌트 렌더링 최적화
yarn dev:e11  # Before/After 토글로 전환

# 다른 예제들도 동일하게:
# ...
```

> 예제 12~16은 현재 문서만 제공하며, 실행 스크립트는 추후 추가됩니다.

**또는 각 예제 디렉토리에서 직접 실행:**

```bash
# Before 프로젝트 실행
cd packages/example-01-code-splitting/before
yarn dev

# After 프로젝트 실행
cd packages/example-01-code-splitting/after
yarn dev
```

### 프로덕션 빌드

```bash
# Before 프로젝트 빌드
cd packages/example-01-code-splitting/before
yarn build

# After 프로젝트 빌드
cd packages/example-01-code-splitting/after
yarn build

# 빌드 후:
# before/dist/와 after/dist/ 폴더의 번들 크기를 비교하여 최적화 효과 측정
```

---

## 📁 프로젝트 구조

이 프로젝트는 **모노레포(Monorepo)** 구조로 구성되어 있으며, 각 최적화 기법을 **독립적으로 학습**할 수 있도록 예제를 분리했습니다.

```
optimization/
└── packages/                  # 독립적인 예제 프로젝트들
    ├── example-01-code-splitting/     # Code Splitting만 다루는 예제
    │   ├── before/                    # 최적화 전
    │   └── after/                     # 최적화 후
    ├── example-02-tree-shaking/      # Tree Shaking만 다루는 예제
    ├── example-03-resource-optimization/    # 리소스 최적화만 다루는 예제
    └── ... (각 최적화 기법별 예제)
```

**각 예제는 하나의 최적화 기법만 다루며, before/after를 별도 프로젝트로 분리하여 개별 효과를 명확히 측정할 수 있습니다.**

---

## 📊 예제 프로젝트 목록

| 예제                                   | 최적화 기법                  | Before                                | After                                       |
| -------------------------------------- | ---------------------------- | ------------------------------------- | ------------------------------------------- |
| `example-01-code-splitting/before`     | Code Splitting (Before)      | Static import                         | -                                           |
| `example-01-code-splitting/after`      | Code Splitting (After)       | -                                     | Dynamic import                              |
| `example-02-tree-shaking`              | Tree Shaking                 | 사용하지 않는 코드 포함               | Tree Shaking으로 제거                       |
| `example-03-resource-optimization`     | 리소스 최적화                | 최적화 없음                           | 폰트, 압축, CDN 활용                        |
| `example-04-preload-prefetch/before`   | Preload/Prefetch (Before)    | 필요할 때만 로드                      | -                                           |
| `example-04-preload-prefetch/after`    | Preload/Prefetch (After)     | -                                     | Preload/Prefetch/Preconnect                 |
| `example-05-service-worker-pwa/before` | Service Worker 캐싱 (Before) | Service Worker 없음                   | -                                           |
| `example-05-service-worker-pwa/after`  | Service Worker 캐싱 (After)  | -                                     | 캐싱 전략 및 오프라인 지원                  |
| `example-06-api-optimization`          | API 호출 최적화              | 순차 호출, 중복 요청, Debouncing 없음 | 병렬 호출, 중복 제거, Debouncing, 요청 취소 |
| `example-07-data-caching`              | 데이터 캐싱 전략             | 캐싱 없음 (매번 API 호출)             | 메모리 캐싱, TTL, 캐시 무효화               |
| `example-08-suspense`                  | Suspense                     | 수동 로딩 상태 관리                   | 선언적 로딩                                 |
| `example-09-state-colocation`          | State Colocation             | 전역 상태 관리                        | 필요한 곳에 배치                            |
| `example-10-memoization`               | Memoization                  | 리렌더링 매번 발생                    | React.memo, useMemo 적용                    |
| `example-11-component-rendering`       | 컴포넌트 렌더링 최적화       | 불안정한 key, 조건부 계산 낭비        | 안정적인 key, 조기 반환, 오류 범위 축소     |
| `example-12-virtualization`            | Virtualization               | 모든 항목 렌더링                      | react-window로 가상화                       |
| `example-13-concurrent-features`       | React 18 Concurrent          | 동기적 업데이트                       | 우선순위 조정                               |
| `example-14-layout-optimization`       | 레이아웃 최적화              | Layout Thrashing 발생                 | CSS 최적화, CLS 최소화                      |
| `example-15-painting-optimization`     | 페인팅 최적화                | position/width 변경                   | transform/opacity 사용                      |
| `example-16-web-workers`               | Web Workers                  | 메인 스레드에서 계산                  | Web Worker로 오프로딩                       |

> 예제 12~16은 현재 문서만 제공되며, 코드/스크립트는 추후 추가됩니다.

### 학습 방법

1. **이론 문서 읽기**: 각 예제의 README에서 이론 섹션 확인
2. **예제 README 읽기**: 각 예제의 README에서 상세한 설명과 측정 방법 확인
3. **Before 실행**: 최적화 전 상태 확인 및 성능 측정 (Baseline)
4. **After 실행**: 최적화 적용 후 상태 확인 및 성능 측정
5. **효과 비교**: Before/After 성능 메트릭 비교

### 성능 측정 방법

각 예제의 before/after에서:

1. **개발자 도구 Network 탭**: 번들 크기, 로딩 시간 비교
2. **React DevTools Profiler**: 리렌더링 횟수 및 시간 측정
3. **Lighthouse**: Core Web Vitals 측정 (FCP, LCP, TTI 등)
4. **번들 분석기**: 빌드 후 번들 크기 비교

---

## 🔧 워크스페이스 명령어

```bash
# 각 예제 실행 (예시)
# 루트에서 의존성 설치 (최초 1회만)
yarn install

# Before 프로젝트 실행
cd packages/example-01-code-splitting/before
yarn dev
# 또는 루트에서: yarn dev:e1:before

# 모든 패키지에서 명령어 실행
yarn workspaces run lint
```

---

## 🚢 배포 가이드

### 로컬 개발

```bash
# 루트에서 의존성 설치 (최초 1회만)
yarn install

# Before 프로젝트 실행
cd packages/example-01-code-splitting/before
yarn dev
# 또는 루트에서: yarn dev:e1:before
```

### 프로덕션 배포

#### 프론트엔드 (Vercel/Netlify)

```bash
# 각 예제별로 빌드
# Before 프로젝트 빌드
cd packages/example-01-code-splitting/before
yarn build

# After 프로젝트 빌드
cd packages/example-01-code-splitting/after
yarn build

# Vercel에 배포
vercel --prod
```

---

## 📚 참고 자료

- [Next.js Dynamic Import](https://nextjs.org/docs/advanced-features/dynamic-import)
- [React.lazy()](https://react.dev/reference/react/lazy)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Web.dev Performance](https://web.dev/performance/)
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
