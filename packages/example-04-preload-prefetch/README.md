# 예제 4: 리소스 Preload/Prefetch

## 목적

리소스 Preload/Prefetch 최적화 기법만 독립적으로 학습할 수 있는 예제입니다.

## 구조

Before와 After를 별도 프로젝트로 분리하여 명확하게 비교할 수 있습니다.

- **`before/`**: Preload/Prefetch 적용 전 (리소스를 필요할 때만 로드)
- **`after/`**: Preload/Prefetch 적용 후 (중요한 리소스를 미리 로드)

---

## 📚 이론: 리소스 Preload/Prefetch 원리와 전략

### 1. 개요 (Overview)

**Preload/Prefetch**는 브라우저에게 중요한 리소스를 미리 다운로드하도록 지시하는 최적화 기법입니다. 이를 통해 리소스 로딩 시간을 단축하고 사용자 경험을 개선할 수 있습니다.

### 2. 문제 상황: 리소스 로딩 지연

#### ❌ Bad Case: 리소스 발견 지연

```html
<head>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body></body>
```

```css
/* styles.css - HTML 파싱 중에 발견됨 */
@font-face {
  font-family: "MainFont";
  src: url("/fonts/main.woff2") format("woff2");
}
```

**문제점:**

- 폰트가 CSS 파일 내부에서 발견되어 HTML 파싱 후에야 로드 시작
- CSS 파일 다운로드 → 파싱 → 폰트 발견 → 폰트 다운로드 (순차적 지연)
- FOIT(Flash of Invisible Text) 발생: 폰트 로드 전까지 텍스트가 보이지 않음

#### ❌ Bad Case: 외부 리소스 연결 지연

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet" />
```

**문제점:**

- 외부 도메인(`fonts.googleapis.com`) 연결 시 DNS 조회, TCP 연결, TLS 핸드셰이크 필요
- 연결 설정에 100-500ms 소요
- 연결 완료 후에야 리소스 다운로드 시작

### 3. Preload vs Prefetch vs Preconnect

#### 3.1. Preload (`<link rel="preload">`)

**현재 페이지에서 곧 사용할 중요한 리소스를 미리 로드합니다.**

```html
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link rel="preload" href="/images/hero.jpg" as="image" />
<link rel="preload" href="/styles/critical.css" as="style" />
```

**특징:**

- 높은 우선순위로 즉시 다운로드
- 현재 페이지에서 반드시 필요한 리소스에 사용
- 브라우저 캐시에 저장되어 나중에 빠르게 사용 가능

**사용 사례:**

- LCP(Largest Contentful Paint) 이미지
- 중요한 폰트 파일
- Critical CSS

#### 3.2. Prefetch (`<link rel="prefetch">`)

**다음 페이지에서 사용할 가능성이 있는 리소스를 미리 로드합니다.**

```html
<link rel="prefetch" href="/images/next-page-hero.jpg" as="image" />
```

**특징:**

- 낮은 우선순위로 백그라운드에서 다운로드
- 현재 페이지 리소스 로딩이 완료된 후 다운로드
- 다음 페이지로 이동할 때 이미 캐시에 있어 빠르게 로드

**사용 사례:**

- 다음 페이지의 메인 이미지
- 사용자가 클릭할 가능성이 높은 링크의 리소스

#### 3.3. Preconnect (`<link rel="preconnect">`)

**외부 도메인과의 연결을 미리 설정합니다.**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**특징:**

- DNS 조회, TCP 연결, TLS 핸드셰이크를 미리 수행
- 외부 리소스(CDN, API 서버 등) 로딩 시간 단축
- `crossorigin` 속성으로 CORS 요청 준비

**사용 사례:**

- Google Fonts
- CDN 리소스
- 외부 API 호출

#### 3.4. DNS-Prefetch (`<link rel="dns-prefetch">`)

**DNS 조회만 미리 수행합니다 (Preconnect보다 가벼움).**

```html
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

**특징:**

- DNS 조회만 수행 (TCP/TLS 연결은 하지 않음)
- Preconnect보다 리소스 사용이 적음
- 여러 외부 도메인에 사용할 때 유용

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

### Before (최적화 전)

```bash
# 루트에서 실행
yarn dev:e4:before
# 접속: http://localhost:5175

```

- 리소스를 필요할 때만 로드
- 폰트 로딩 지연으로 FOIT 발생 가능
- 외부 리소스 로딩 시 연결 지연 발생

### After (최적화 후)

```bash
# 루트에서 실행
yarn dev:e4:after
# 접속: http://localhost:5176

```

- 중요한 리소스를 preload로 미리 로드
- 외부 도메인은 preconnect로 연결 설정
- 다음 페이지 리소스는 prefetch로 미리 로드

---

## 측정 방법

### 1. Network 탭 분석 (로딩 순서 확인)

1. 크롬 개발자 도구 > **Network** 탭 클릭
2. **"Disable cache"** 체크 (필수)
3. 새로고침 후 타임라인 확인

**예상 결과:**

- **Before:**
- HTML → CSS → CSS 파싱 → 폰트 발견 → 폰트 다운로드 (순차적)
- 외부 리소스: DNS 조회 → TCP 연결 → TLS 핸드셰이크 → 리소스 다운로드

- **After:**
- HTML → Preload 폰트 즉시 다운로드 (병렬)
- Preconnect로 외부 도메인 연결 미리 설정
- 폰트가 CSS 파싱 전에 이미 다운로드 완료되어 FOIT 방지

### 2. Performance 탭 분석

1. 개발자 도구 > **Performance** 탭
2. **Record** 클릭 후 페이지 로드
3. **Network** 트랙에서 리소스 로딩 시작 시점 비교

---

## 주요 코드 변경점

### Preload 적용 (`index.html`)

```html
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<link rel="preload" href="/images/hero.jpg" as="image" />
```

### Preconnect 적용 (`index.html`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet" />
```

### 동적 Prefetch (React 컴포넌트)

> **주의:** JS 파일은 빌드 시 해시값(`index.a1b2.js`)이 붙으므로, 이미지 같은 정적 리소스를 Prefetch하는 것이 실무적으로 안전합니다.

```tsx
import { useEffect } from "react";

function NavigationLink({ to, children }) {
  // 마우스를 올리면 다음 페이지의 이미지를 미리 로드
  const prefetchImage = () => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = "/images/next-hero.webp"; // 다음 페이지 핵심 이미지
    link.as = "image";
    document.head.appendChild(link);
  };

  return (
    <a href={to} onMouseEnter={prefetchImage}>
      {children}
    </a>
  );
}
```

---

## 📚 참고 자료 (References)

**Preload/Prefetch 가이드**

- [MDN: Preloading content](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) - `preload`, `prefetch`, `preconnect` 차이점과 사용법
- [Web.dev: Preload critical assets](https://web.dev/preload-critical-assets/) - 중요한 리소스 preload 가이드
- [Web.dev: Preconnect to required origins](https://web.dev/preconnect-to-dns-prefetch/) - 외부 도메인 연결 최적화

**성능 측정 및 최적화**

- [Web.dev: Resource Hints](https://web.dev/uses-rel-preconnect/) - 리소스 힌트 최적화 가이드
- [Chrome DevTools: Network Analysis](https://developer.chrome.com/docs/devtools/network/) - Network 탭을 통한 리소스 분석
- [MDN: DNS prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch) - DNS prefetch 상세 설명

**브라우저 호환성**

- [Can I Use: Preload](https://caniuse.com/link-rel-preload) - Preload 브라우저 호환성
- [Can I Use: Prefetch](https://caniuse.com/link-rel-prefetch) - Prefetch 브라우저 호환성
- [Can I Use: Preconnect](https://caniuse.com/link-rel-preconnect) - Preconnect 브라우저 호환성
