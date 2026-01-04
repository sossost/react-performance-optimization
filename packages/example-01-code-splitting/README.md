# 예제 1: Code Splitting

## 목적

Code Splitting 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

Before와 After를 별도 프로젝트로 분리하여 명확하게 비교할 수 있습니다.

- **`before/`**: Code Splitting 적용 전 (모든 라이브러리를 static import, 초기 번들에 모두 포함)
- **`after/`**: Code Splitting 적용 후 (무거운 라이브러리를 dynamic import, 필요할 때만 로드)

---

## 📚 이론: 번들링 원리와 Code Splitting 전략

### 1. 개요 (Overview)

모던 웹 개발에서 **번들링(Bundling)**은 필수적인 과정입니다. 수백 개의 자바스크립트 모듈, CSS, 이미지 파일을 브라우저가 효율적으로 로드할 수 있도록 적은 수의 파일로 묶는 작업입니다. (Webpack, Turbopack, Vite 등이 이 역할을 합니다.)

하지만 애플리케이션이 커지면 번들 파일 자체도 거대해집니다(Monolithic Bundle). 사용자가 당장 필요하지 않은 페이지나 컴포넌트의 코드까지 한 번에 내려받아야 하므로 초기 로딩 속도(FCP, TTI)가 끔찍하게 느려집니다.

**Code Splitting**은 이 거대한 번들을 "필요한 순간에 필요한 만큼만" 로드하도록 여러 개의 작은 청크(Chunk)로 쪼개는 전략입니다.

### 2. 문제 상황: 거대한 초기 번들 (The Problem)

애플리케이션의 첫 페이지에 접속했다고 가정해 봅시다.

#### ❌ Bad Case: 모든 것을 한 번에 로딩

사용자는 로그인 페이지만 보고 있는데, 브라우저는 아래 코드를 모두 다운로드하고 실행(Parsing & Execution)해야 합니다.

- 로그인 페이지 코드 (필요함 ✅)
- 대시보드 페이지 코드 (당장 불필요 ❌)
- 설정 페이지 코드 (당장 불필요 ❌)
- 무거운 데이터 시각화 라이브러리 (당장 불필요 ❌)

이로 인해 메인 스레드가 차단되어 화면이 멈추는 시간(TBT - Total Blocking Time)이 길어집니다.

### 3. 컴포넌트 기반 코드 스플리팅 (Component-based Splitting)

특정 페이지 내에서도 당장 보일 필요가 없는 무거운 컴포넌트를 지연 로딩(Lazy Loading)합니다.

**대상:**

- 사용자 인터랙션 후에 나타나는 모달(Modal)
- 화면 아래쪽에 위치한 무거운 차트나 지도 컴포넌트
- 특정 조건에서만 렌더링되는 탭 콘텐츠

#### React (Vite/CRA): `React.lazy` + `Suspense`

```tsx
import { Suspense, lazy, useState } from "react";

// ❌ Bad: Static Import
import HeavyChart from "./HeavyChart";

// ✅ Good: Dynamic Import with React.lazy
const HeavyChart = lazy(() => import("./HeavyChart"));

function App() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>차트 보기</button>
      {showChart && (
        <Suspense fallback={<div>로딩 중...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

**주의사항:**

- `React.lazy`는 **default export**만 지원합니다.
- Named export를 사용하려면 wrapper가 필요합니다.

```tsx
// Named export를 사용하는 경우
const HeavyChart = lazy(() =>
  import("./HeavyChart").then((module) => ({ default: module.HeavyChart }))
);
```

### 4. 라우트 기반 코드 스플리팅 (Route-based Splitting)

각 경로(route)를 별도의 청크로 분리하여 페이지 이동 시에만 해당 코드를 로드합니다.

#### React Router: 수동 라우트 스플리팅

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// 각 페이지를 lazy로 import
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>페이지 로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 5. 번들 최적화 설정 (Build Configuration)

빌드 도구별로 청크 분리 전략을 세밀하게 제어할 수 있습니다.

#### Vite: `manualChunks`

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 함수로 동적 청크 분리 (더 세밀한 제어)
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // React는 초기 번들에 포함
            if (id.includes("react") || id.includes("react-dom")) {
              return undefined;
            }
            // 무거운 라이브러리들은 vendor-heavy로 분리
            if (
              id.includes("lodash") ||
              id.includes("moment") ||
              id.includes("date-fns") ||
              id.includes("ramda") ||
              id.includes("axios")
            ) {
              return "vendor-heavy";
            }
            return undefined;
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // 청크 크기 경고 임계값 (KB)
  },
});
```

### 6. Tree Shaking

사용하지 않는 코드를 번들에서 제거하는 최적화 기법입니다.

#### 라이브러리별 최적화

**Lodash:**

```tsx
// ❌ Bad: 전체 import (일반적으로 약 70KB)
import _ from "lodash";
const result = _.debounce(fn, 300);

// ✅ Good: 개별 함수 import (일반적으로 약 2KB)
import debounce from "lodash/debounce";
const result = debounce(fn, 300);

// ✅ Better: lodash-es 사용 (ES Module, Tree Shaking 완벽 지원)
import { debounce } from "lodash-es";
```

**Date 라이브러리:**

```tsx
// ❌ Bad: moment.js (일반적으로 약 290KB, Tree Shaking 불가)
import moment from "moment";

// ✅ Good: date-fns (일반적으로 약 2KB per function, Tree Shaking 지원)
import { format, parseISO } from "date-fns";
```

**Named Export vs Default Export:**

```tsx
// ✅ Named Export (Tree Shaking에 더 유리)
export const utilA = () => "A";
export const utilB = () => "B";

// 사용하는 쪽에서:
import { utilA } from "./utils"; // utilB는 번들에 포함되지 않음
```

### 7. 번들 분석 도구

번들 크기를 시각적으로 분석하여 최적화 포인트를 찾습니다.

#### Vite: rollup-plugin-visualizer

```bash
npm install -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

빌드 후 `dist/stats.html` 파일을 열어 번들 구성을 시각적으로 확인할 수 있습니다.

### 8. Best Practices

#### 언제 Dynamic Import를 사용할까?

✅ **사용해야 하는 경우:**

- 무거운 라이브러리 (Three.js, D3.js, Chart.js 등)
- 조건부 렌더링 컴포넌트 (모달, 드로어 등)
- 화면 하단의 콘텐츠 (Lazy Loading)
- 사용자 인터랙션 후 나타나는 컴포넌트

❌ **사용하지 않아도 되는 경우:**

- 가벼운 컴포넌트 (1KB 이하)
- 초기 화면에 반드시 필요한 컴포넌트
- SEO가 중요한 컴포넌트 (SSR 필요)

#### 번들 최적화 체크리스트

**빌드 전:**

- [ ] 사용하지 않는 import 제거
- [ ] 무거운 라이브러리 대체 (moment → dayjs, lodash → lodash-es)
- [ ] Named import 사용 (Tree Shaking 활성화)
- [ ] Dynamic import로 조건부 컴포넌트 분리

**빌드 후:**

- [ ] 번들 분석 도구로 크기 확인
- [ ] 500KB 이상 청크 분리 검토
- [ ] 중복 라이브러리 확인
- [ ] Gzip 압축 후 크기 확인

**런타임:**

- [ ] Network 탭에서 초기 로드 JS 크기 확인
- [ ] Lighthouse Performance 점수 확인
- [ ] TTI (Time to Interactive) 측정

---

## 실행 방법

> **참고:** 모든 의존성은 루트에서 공유됩니다. 루트에서 `yarn install` 한 번만 실행하면 됩니다.

### Before (최적화 전)

```bash
# 루트에서 의존성 설치 (최초 1회만)
cd ../../..  # 프로젝트 루트로 이동
yarn install

# Before 프로젝트 실행
cd packages/example-01-code-splitting/before
yarn dev

# 브라우저에서 접속:
# http://localhost:5173
```

또는 루트에서:

```bash
yarn dev:e1:before
```

### After (최적화 후)

```bash
# After 프로젝트 실행
cd packages/example-01-code-splitting/after
yarn dev

# 브라우저에서 접속:
# http://localhost:5174
```

또는 루트에서:

```bash
yarn dev:e1:after
```

## 빌드 및 프리뷰

### Before

```bash
cd packages/example-01-code-splitting/before
yarn build
yarn preview
```

또는 루트에서:

```bash
yarn build:e1:before
yarn preview:e1:before
```

### After

```bash
cd packages/example-01-code-splitting/after
yarn build
yarn preview
```

또는 루트에서:

```bash
yarn build:e1:after
yarn preview:e1:after
```

---

## 측정 방법

### 1. Network 탭에서 번들 크기 비교

**Before 프로젝트:**

1. 개발자 도구 Network 탭 열기
2. 페이지 새로고침 (Cmd/Ctrl + Shift + R)
3. JS 파일 확인:
   - `index-[hash].js`: 메인 번들
   - `vendor-all-[hash].js`: 모든 vendor 라이브러리 (victory, d3, lodash, moment, date-fns, ramda, axios, react 등)
   - **초기 번들 크기: 약 669KB (gzip: 213KB)** (실제 빌드 결과: vendor-all 655KB gzip: 209KB + index 14KB gzip: 4KB)

**After 프로젝트:**

1. 개발자 도구 Network 탭 열기
2. 페이지 새로고침 (Cmd/Ctrl + Shift + R)
3. 초기 로딩 시 JS 파일 확인:
   - `index-[hash].js`: 메인 번들 (React + ReactDOM + App + PerformanceMetrics 포함)
   - **초기 번들 크기: 약 200KB (gzip: 63KB)** (실제 빌드 결과: index 200KB gzip: 63KB)
4. "컴포넌트 보기" 버튼 클릭
5. 추가로 로드되는 JS 파일 확인:
   - `vendor-heavy-[hash].js`: 무거운 라이브러리 청크 (lodash, moment, date-fns, ramda, axios)
   - `HeavyChart-[hash].js`, `HeavyTable-[hash].js` 등: 컴포넌트 청크
   - **추가 번들 크기: 약 164KB (gzip: 55KB)** (실제 빌드 결과: vendor-heavy 164KB gzip: 55KB)

### 2. 페이지 내 성능 메트릭

각 페이지 상단에 실시간으로 측정된 성능 메트릭이 표시됩니다:

- **초기 JS 번들 크기**: 모든 JS 파일의 총 크기
- **페이지 로딩 시간**: Network 탭의 Load 이벤트와 동일한 시간
- **JS 파일 개수**: 로드된 JS 파일의 개수

### 3. Bundle Analyzer

빌드 후 `dist/stats.html` 파일을 열어 번들 구성을 시각적으로 확인할 수 있습니다:

```bash
cd packages/example-01-code-splitting/before
yarn build
open dist/stats.html
```

---

## 주요 차이점

### Before (최적화 전)

- 모든 무거운 라이브러리(victory, d3, lodash, moment, date-fns, ramda, axios)를 **static import**
- `vite.config.ts`에서 모든 vendor를 하나의 `vendor-all` 청크로 묶음
- 초기 번들에 모든 라이브러리가 포함되어 **초기 로딩이 느림** (약 669KB, gzip: 213KB - 실제 빌드 결과 기준)
- 사용자가 컴포넌트를 보지 않아도 모든 라이브러리를 다운로드해야 함

### After (최적화 후)

- 무거운 컴포넌트들을 **dynamic import** (`React.lazy`)
- `vite.config.ts`에서 무거운 라이브러리(lodash, moment, date-fns, ramda, axios)를 `vendor-heavy` 청크로 분리
- 초기 번들에는 React + ReactDOM + App만 포함되어 **초기 로딩이 빠름** (약 200KB, gzip: 63KB - 실제 빌드 결과 기준)
- 사용자가 "컴포넌트 보기" 버튼을 클릭할 때만 무거운 라이브러리 로드 (약 164KB, gzip: 55KB - 실제 빌드 결과 기준)

---

## 학습 포인트

1. **초기 번들 크기 차이**: Before는 669KB (gzip: 213KB), After는 200KB (gzip: 63KB)로 약 **3.3배 차이** (실제 빌드 결과 기준)
2. **로딩 시간 차이**: Before는 초기 로딩이 느리고, After는 빠르게 시작
3. **사용자 경험**: After는 필요한 기능만 로드하여 더 나은 사용자 경험 제공
4. **Network 탭 관찰**: After에서 버튼 클릭 시 `vendor-heavy` 청크가 추가로 로드되는 것을 확인
5. **워터폴 방지**: After는 초기 로드 시 `index.js`만 로드되어 워터폴이 발생하지 않음

---

## 참고 자료

- [React.lazy()](https://react.dev/reference/react/lazy)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Web.dev Code Splitting](https://web.dev/code-splitting-suspense/)
