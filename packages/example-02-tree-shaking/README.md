# 예제 2: Tree Shaking

## 목적

Tree Shaking 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

Before와 After를 별도 프로젝트로 분리하여 명확하게 비교할 수 있습니다.

- **`before/`**: Tree Shaking 적용 전 (사용하지 않는 코드가 번들에 포함)
- **`after/`**: Tree Shaking 적용 후 (사용하지 않는 코드가 번들에서 제거)

---

## 📚 이론: Tree Shaking 원리와 최적화 전략

### 1. 개요 (Overview)

**Tree Shaking**은 사용하지 않는 코드를 번들에서 제거하는 최적화 기법입니다.

> **🍃 개념 요약**
>
> - **Tree Shaking 전:** 🌳 나무를 통째로 가져옴 (필요 없는 죽은 잎사귀 포함)
> - **Tree Shaking 후:** 🍂 나무를 흔들어서 죽은 잎사귀(사용 안 하는 코드)를 털어내고 필요한 가지만 남김

모던 번들러(Webpack, Rollup, Vite 등)는 ES Module의 정적 분석을 통해 사용하지 않는 export를 감지하고 번들에서 제거할 수 있습니다.

### 2. 문제 상황: 사용하지 않는 코드 포함

#### ❌ Bad Case: 전체 라이브러리 import

```tsx
// lodash 전체를 import (약 70KB)
import _ from "lodash";

// 실제로는 debounce만 사용
const debouncedFn = _.debounce(fn, 300);
```

이 경우 lodash의 모든 함수(약 300개)가 번들에 포함되어 약 70KB가 추가됩니다.

#### ❌ Bad Case: CommonJS 모듈

```tsx
// moment.js는 CommonJS 모듈 (약 290KB, Tree Shaking 효과 미미함)
import moment from "moment";

// format만 사용해도 전체 라이브러리가 포함됨
const formatted = moment().format("YYYY-MM-DD");
```

### 3. Tree Shaking이 자동으로 작동하는 방법

**중요:** Tree Shaking은 **별도 설정 없이 자동으로 작동**합니다! 단, 다음 조건을 만족해야 합니다:

#### 3.1. 자동 Tree Shaking 조건

1. **ES Module 사용**: `import/export` 문법 사용 (필수)
2. **정적 분석 가능**: 동적 import(`import()`)는 빌드 타임에 분석이 어려워 Tree Shaking이 제한적일 수 있음
3. **Side-effect 없음**: 모듈이 import만으로도 실행되는 부수 효과(side-effect)가 없어야 함
4. **번들러 지원**: Vite, Webpack, Rollup 등이 **기본적으로 지원**

#### 3.2. Vite의 자동 Tree Shaking

Vite는 프로덕션 빌드(`vite build`) 시 **기본적으로 Tree Shaking을 자동으로 수행**합니다.

```ts
// vite.config.ts
export default defineConfig({
  // 별도 설정 불필요!
  // ES Module을 사용하면 자동으로 사용하지 않는 코드 제거
});
```

**작동 원리:**

- Vite는 내부적으로 Rollup을 사용하여 빌드
- Rollup은 ES Module의 정적 분석을 통해 사용하지 않는 export를 자동으로 감지 및 제거

### 4. 라이브러리별 최적화 전략

#### Lodash

```tsx
// ❌ Bad: 전체 import (약 70KB, CommonJS)
import _ from "lodash";
const result = _.debounce(fn, 300);

// ⚠️ Soso: 개별 함수 import (CommonJS라 완벽한 최적화는 아님)
import debounce from "lodash/debounce";
const result = debounce(fn, 300);

// ✅ Best: lodash-es 사용 (ES Module, Tree Shaking 완벽 지원)
import { debounce } from "lodash-es";
const result = debounce(fn, 300);
```

#### Date 라이브러리

```tsx
// ❌ Bad: moment.js (약 290KB, CommonJS라 Tree Shaking 어려움)
import moment from "moment";
const formatted = moment().format("YYYY-MM-DD");

// ✅ Good: date-fns (함수별 쪼개기 가능, Tree Shaking 지원)
import { format } from "date-fns";
const formatted = format(new Date(), "yyyy-MM-dd");

// ✅ Good: dayjs (약 2KB, 플러그인 방식)
import dayjs from "dayjs";
const formatted = dayjs().format("YYYY-MM-DD");
```

### 5. Named Export vs Default Export

#### ✅ Named Export (Tree Shaking에 가장 유리)

```tsx
// utils.ts
export const utilA = () => "A";
export const utilB = () => "B";

// 사용하는 쪽:
import { utilA } from "./utils";
// utilB는 번들에서 제거됨 ✅
```

#### ⚠️ Default Export (제한적)

```tsx
// utils.ts
export default {
  utilA: () => "A",
  utilB: () => "B",
};

// 사용하는 쪽:
import utils from "./utils";
utils.utilA();
// utilB도 객체의 일부이므로 번들에 포함될 가능성이 높음 ⚠️
```

**결론:** 되도록 **Named Export**를 사용하는 것이 최적화에 유리합니다.

### 6. package.json sideEffects 설정

번들러에게 "이 파일들은 부수 효과(Side Effect)가 있으니 **지우지 말라**"고 알려주는 설정입니다.

```json
{
  // false: "모든 파일에 부수 효과가 없으니, 안 쓰면 과감히 지워라" (가장 강력한 최적화)
  "sideEffects": false
}
```

혹은 특정 파일만 보호(보존)해야 할 경우:

```json
{
  // "*.css"는 import만 해도 스타일이 적용되는 부수 효과가 있으므로
  // 사용되지 않는 것처럼 보여도 절대 지우지 말라는 의미
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

### 7. 번들 분석으로 Tree Shaking 확인

#### Vite: rollup-plugin-visualizer 설정

```bash
npm install -D rollup-plugin-visualizer

```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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

빌드 후 `dist/stats.html`을 열어 실제로 어떤 코드가 번들에 포함되었는지 시각적으로 확인할 수 있습니다.

---

## 실행 방법

> **참고:** 모든 의존성은 루트에서 공유됩니다. 루트에서 `yarn install` 한 번만 실행하면 됩니다.

### Before (최적화 전)

```bash
# 루트에서 의존성 설치 (최초 1회만)
cd ../../..  # 프로젝트 루트로 이동
yarn install

# Before 프로젝트 실행
yarn dev:e2:before
# 접속: http://localhost:5173

```

### After (최적화 후)

```bash
# After 프로젝트 실행
yarn dev:e2:after
# 접속: http://localhost:5174

```

## 빌드 및 프리뷰

**Tree Shaking은 Production Build 시에 제대로 적용됩니다.** 반드시 빌드 후 크기를 확인하세요.

### Before 빌드

```bash
cd packages/example-02-tree-shaking/before
yarn build
yarn preview

```

### After 빌드

```bash
cd packages/example-02-tree-shaking/after
yarn build
yarn preview

```

---

## 측정 방법

### 1. Network 탭에서 번들 크기 비교

**Before 프로젝트:**

1. 개발자 도구 Network 탭 열기
2. 새로고침 후 JS 리소스 확인
3. `vendor` 번들 등에 lodash, moment 전체가 포함되어 용량이 큼

- **총 초기 번들 크기: 약 330.63 KB (gzip: 108.84 KB)**

**After 프로젝트:**

1. 개발자 도구 Network 탭 열기
2. 새로고침 후 JS 리소스 확인
3. 실제로 사용하는 함수(`debounce`, `format`)만 포함됨

- **총 초기 번들 크기: 약 217.42 KB (gzip: 68.28 KB)**

### 2. Bundle Analyzer (시각적 확인)

빌드 후 생성된 `dist/stats.html` 파일을 브라우저로 엽니다.

```bash
# Before 폴더에서
open dist/stats.html
# 결과: 거대한 lodash, moment 박스가 보임

```

```bash
# After 폴더에서
open dist/stats.html
# 결과: lodash, moment 박스가 사라지거나 매우 작아짐

```

### 3. 결과 요약

| 구분       | Bundle Size (Raw) | Bundle Size (Gzip) | 개선율             |
| ---------- | ----------------- | ------------------ | ------------------ |
| **Before** | 330.63 KB         | 108.84 KB          | -                  |
| **After**  | 217.42 KB         | 68.28 KB           | **약 37% 감소** 🔻 |

> _수치는 빌드 환경에 따라 소폭 다를 수 있습니다._

---

## 학습 포인트

1. **ES Module 필수:** Tree Shaking은 ES Module(`import/export`) 환경에서만 완벽하게 작동합니다.
2. **라이브러리 선정:** 처음부터 Tree Shaking을 지원하는 라이브러리(`lodash-es`, `date-fns` 등)를 고르는 것이 중요합니다.
3. **코드 습관:** `Default Export`보다는 `Named Export`를 사용하는 습관이 최적화에 유리합니다.
4. **설정 확인:** `sideEffects` 설정이 잘못되면 필요한 코드가 지워지거나, 불필요한 코드가 남을 수 있습니다.

---

## 참고 자료

- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Vite Features: Build Optimization](https://www.google.com/search?q=https://vitejs.dev/guide/features.html%23build-optimizations)
- [ES Modules vs CommonJS](https://nodejs.org/api/esm.html)
